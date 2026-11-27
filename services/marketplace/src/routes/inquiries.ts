import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { publishEvent } from '../services/kafka.js';
import { getProduct } from '../services/supplier.js';

// Farmers ask about a specific product; the supplier is resolved server-side.
const CreateInquirySchema = z.object({
  productId: z.string().min(1),
  subject: z.string().trim().min(3).max(200),
  body: z.string().trim().min(10).max(5000),
});

const ReplyInquirySchema = z.object({
  message: z.string().trim().min(1).max(5000),
});

const StatusSchema = z.object({
  status: z.enum(['OPEN', 'RESOLVED', 'CLOSED']),
});

/** Is this user a party to the inquiry? */
function partyOf(inquiry: any, user: { sub: string; role: string }): 'farmer' | 'supplier' | 'admin' | null {
  if (user.role === 'admin') return 'admin';
  if (inquiry.farmerId === user.sub) return 'farmer';
  if (inquiry.supplierUserId && inquiry.supplierUserId === user.sub) return 'supplier';
  return null;
}

export async function inquiryRoutes(fastify: FastifyInstance) {
  const { prisma } = fastify as any;
  fastify.addHook('preHandler', (fastify as any).authenticate);

  // POST /marketplace/inquiries (farmer asks a supplier about a product)
  fastify.post('/', { config: { rateLimit: { max: 10, timeWindow: '1m' } } }, async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;
    if (user.role !== 'farmer') {
      return reply.status(403).send({ success: false, error: 'Only farmers can start an inquiry' });
    }
    const result = CreateInquirySchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: 'Please add a subject and at least 10 characters', details: result.error.flatten() });
    }

    const product = await getProduct(result.data.productId);
    if (!product) return reply.status(404).send({ success: false, error: 'Product not available' });

    const inquiry = await prisma.inquiry.create({
      data: {
        productId: product.id,
        supplierId: product.supplierId,
        supplierUserId: product.supplier?.userId ?? null,
        farmerId: user.sub,
        subject: result.data.subject,
        body: result.data.body,
        status: 'OPEN',
      },
    });

    if (inquiry.supplierUserId) {
      await publishEvent('notification.send', {
        userId: inquiry.supplierUserId,
        channels: ['web'],
        subject: `New question about ${product.name}`,
        body: inquiry.subject,
        data: { inquiryId: inquiry.id },
      });
    }

    return reply.status(201).send({ success: true, data: inquiry });
  });

  // GET /marketplace/inquiries — my threads (farmer or supplier); admin sees all
  fastify.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const { sub: userId, role } = (req as any).user;
    const where: any = role === 'farmer' ? { farmerId: userId }
      : role === 'supplier' ? { supplierUserId: userId }
      : {};

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { lastMessageAt: 'desc' },
      take: 200,
      include: { _count: { select: { replies: true } } },
    });
    return reply.send({ success: true, data: inquiries });
  });

  // GET /marketplace/inquiries/:id — thread with replies
  fastify.get('/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: { replies: { orderBy: { createdAt: 'asc' } } },
    });
    if (!inquiry || !partyOf(inquiry, (req as any).user)) {
      return reply.status(404).send({ success: false, error: 'Inquiry not found' });
    }
    return reply.send({ success: true, data: inquiry });
  });

  // POST /marketplace/inquiries/:id/replies
  fastify.post('/:id/replies', { config: { rateLimit: { max: 30, timeWindow: '1m' } } }, async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;
    const { id: inquiryId } = req.params as { id: string };

    const result = ReplyInquirySchema.safeParse(req.body);
    if (!result.success) return reply.status(400).send({ success: false, error: 'Message cannot be empty' });

    const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
    const party = inquiry && partyOf(inquiry, user);
    if (!inquiry || !party || party === 'admin') {
      return reply.status(404).send({ success: false, error: 'Inquiry not found' });
    }
    if (inquiry.status === 'CLOSED') {
      return reply.status(409).send({ success: false, error: 'This conversation is closed' });
    }

    const [message] = await prisma.$transaction([
      prisma.inquiryReply.create({
        data: { inquiryId, senderId: user.sub, senderRole: party, message: result.data.message },
      }),
      prisma.inquiry.update({
        where: { id: inquiryId },
        data: { lastMessageAt: new Date(), status: party === 'supplier' ? 'RESPONDED' : 'OPEN' },
      }),
    ]);

    const recipientId = party === 'farmer' ? inquiry.supplierUserId : inquiry.farmerId;
    if (recipientId) {
      await publishEvent('notification.send', {
        userId: recipientId,
        channels: ['web'],
        subject: `New reply: ${inquiry.subject}`,
        body: result.data.message.slice(0, 140),
        data: { inquiryId },
      });
    }

    return reply.status(201).send({ success: true, data: message });
  });

  // PATCH /marketplace/inquiries/:id — resolve / close / reopen (either party or admin)
  fastify.patch('/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const parsed = StatusSchema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ success: false, error: 'Invalid status' });

    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry || !partyOf(inquiry, (req as any).user)) {
      return reply.status(404).send({ success: false, error: 'Inquiry not found' });
    }
    const updated = await prisma.inquiry.update({ where: { id }, data: { status: parsed.data.status } });
    return reply.send({ success: true, data: updated });
  });
}
