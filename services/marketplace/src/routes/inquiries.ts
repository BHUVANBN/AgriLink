import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { publishEvent } from '../services/kafka.js';

const CreateInquirySchema = z.object({
  productId: z.string().optional(),
  supplierId: z.string(),
  subject: z.string().min(3).max(200),
  body: z.string().min(10).max(5000),
});

const ReplyInquirySchema = z.object({
  message: z.string().min(1).max(5000),
});

export async function inquiryRoutes(fastify: FastifyInstance) {
  const { prisma } = fastify as any;
  fastify.addHook('preHandler', (fastify as any).authenticate);

  // POST /marketplace/inquiries (Farmer creates)
  fastify.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).user.sub;
    const userRole = (req as any).user.role;

    if (userRole !== 'farmer') {
      return reply.status(403).send({ success: false, error: 'Only farmers can initiate inquiries' });
    }

    const result = CreateInquirySchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: result.error.flatten() });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        ...result.data,
        farmerId: userId,
        status: 'OPEN',
      },
    });

    // Notify Supplier via Kafka
    await publishEvent('inquiry.created', {
      inquiryId: inquiry.id,
      supplierId: inquiry.supplierId,
      farmerId: inquiry.farmerId,
      subject: inquiry.subject,
    });

    return reply.status(201).send({ success: true, data: inquiry });
  });

  // GET /marketplace/inquiries (Supplier or Farmer list)
  fastify.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const { sub: userId, role } = (req as any).user;
    
    let where: any = {};
    if (role === 'farmer') where.farmerId = userId;
    else if (role === 'supplier') where.supplierId = userId;
    else return reply.status(403).send({ success: false, error: 'Access denied' });

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: { lastMessageAt: 'desc' },
      include: {
        _count: { select: { replies: true } }
      }
    });

    return reply.send({ success: true, data: inquiries });
  });

  // GET /marketplace/inquiries/:id (Detail with replies)
  fastify.get('/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const { sub: userId, role } = (req as any).user;
    const { id } = req.params as { id: string };

    const inquiry = await prisma.inquiry.findUnique({
      where: { id },
      include: {
        replies: { orderBy: { createdAt: 'asc' } }
      }
    });

    if (!inquiry) return reply.status(404).send({ success: false, error: 'Inquiry not found' });
    if (role !== 'admin' && inquiry.farmerId !== userId && inquiry.supplierId !== userId) {
      return reply.status(403).send({ success: false, error: 'Access denied' });
    }

    return reply.send({ success: true, data: inquiry });
  });

  // POST /marketplace/inquiries/:id/replies (Reply)
  fastify.post('/:id/replies', async (req: FastifyRequest, reply: FastifyReply) => {
    const { sub: userId, role } = (req as any).user;
    const { id: inquiryId } = req.params as { id: string };

    const result = ReplyInquirySchema.safeParse(req.body);
    if (!result.success) return reply.status(400).send({ success: false, error: result.error.flatten() });

    const inquiry = await prisma.inquiry.findUnique({ where: { id: inquiryId } });
    if (!inquiry) return reply.status(404).send({ success: false, error: 'Inquiry not found' });

    if (inquiry.farmerId !== userId && inquiry.supplierId !== userId) {
      return reply.status(403).send({ success: false, error: 'Access denied' });
    }

    const [message] = await prisma.$transaction([
      prisma.inquiryReply.create({
        data: {
          inquiryId,
          senderId: userId,
          senderRole: role,
          message: result.data.message,
        }
      }),
      prisma.inquiry.update({
        where: { id: inquiryId },
        data: { 
          lastMessageAt: new Date(),
          status: role === 'supplier' ? 'RESPONDED' : 'OPEN'
        }
      })
    ]);

    // Send notification to recipient via Kafka
    const recipientId = role === 'farmer' ? inquiry.supplierId : inquiry.farmerId;
    await publishEvent('inquiry.replied', {
      inquiryId,
      senderId: userId,
      recipientId,
      messageSnippet: result.data.message.slice(0, 100)
    });

    return reply.status(201).send({ success: true, data: message });
  });

  // PATCH /marketplace/inquiries/:id (Status update — Close/Resolve)
  fastify.patch('/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const { sub: userId, role } = (req as any).user;
    const { id } = req.params as { id: string };
    const { status } = req.body as { status: string };

    const inquiry = await prisma.inquiry.findUnique({ where: { id } });
    if (!inquiry) return reply.status(404).send({ success: false, error: 'Inquiry not found' });

    if (inquiry.farmerId !== userId && role !== 'admin') {
       return reply.status(403).send({ success: false, error: 'Only farmers or admins can close inquiries' });
    }

    const updated = await prisma.inquiry.update({
      where: { id },
      data: { status: status as any }
    });

    return reply.send({ success: true, data: updated });
  });
}
