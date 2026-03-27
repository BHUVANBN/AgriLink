import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { publishEvent } from '../services/kafka.js';

const CreateReviewSchema = z.object({
  productId: z.string(),
  supplierId: z.string(),
  orderId: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().min(3).max(100),
  body: z.string().min(10).max(1000),
});

const FlagReviewSchema = z.object({
  isFlagged: z.boolean(),
  flagReason: z.string().optional(),
});

export async function reviewRoutes(fastify: FastifyInstance) {
  const { prisma } = fastify as any;

  // 🛡️ Public: GET /marketplace/reviews?productId=... or ?supplierId=...
  fastify.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const { productId, supplierId, flagged } = req.query as any;
    
    const where: any = {};
    if (productId) where.productId = productId;
    if (supplierId) where.supplierId = supplierId;
    if (flagged !== undefined) where.isFlagged = flagged === 'true';

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return reply.send({ success: true, data: reviews });
  });

  // 📝 Authenticated: POST /marketplace/reviews (Farmer creates)
  fastify.post('/', { preHandler: [(fastify as any).authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const farmerId = (req as any).user.sub;
    const role = (req as any).user.role;

    if (role !== 'farmer') {
      return reply.status(403).send({ success: false, error: 'Only farmers can submit feedback' });
    }

    const result = CreateReviewSchema.safeParse(req.body);
    if (!result.success) return reply.status(400).send({ success: false, error: result.error.flatten() });

    // Ensure order exists and belongs to farmer (if orderId is provided)
    if (result.data.orderId) {
       const order = await prisma.order.findUnique({ where: { id: result.data.orderId } });
       if (!order || order.farmerId !== farmerId) {
          return reply.status(400).send({ success: false, error: 'Invalid order reference' });
       }
    }

    const review = await prisma.review.create({
      data: { ...result.data, farmerId, isVerified: !!result.data.orderId }
    });

    // Notify Supplier via Kafka
    await publishEvent('review.created', {
      reviewId: review.id,
      supplierId: review.supplierId,
      productId: review.productId,
      rating: review.rating,
    });

    return reply.status(201).send({ success: true, data: review });
  });

  // 🚩 Admin/Authenticated: PATCH /marketplace/reviews/:id/flag (Flag/Moderate)
  fastify.patch('/:id/flag', { preHandler: [(fastify as any).authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { sub: userId, role } = (req as any).user;

    const result = FlagReviewSchema.safeParse(req.body);
    if (!result.success) return reply.status(400).send({ success: false, error: result.error.flatten() });

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return reply.status(404).send({ success: false, error: 'Review not found' });

    // Only farmers (owners of review), suppliers (targets of review), or admins can flag
    if (role !== 'admin' && review.farmerId !== userId && review.supplierId !== userId) {
      return reply.status(403).send({ success: false, error: 'Access denied' });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { 
        isFlagged: result.data.isFlagged, 
        flagReason: result.data.flagReason 
      }
    });

    return reply.send({ success: true, data: updated });
  });

  // 🗑️ Admin: DELETE /marketplace/reviews/:id (Purge malicious content)
  fastify.delete('/:id', { preHandler: [(fastify as any).authenticate] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const role = (req as any).user.role;

    if (role !== 'admin') {
      return reply.status(403).send({ success: false, error: 'Admin access required' });
    }

    await prisma.review.delete({ where: { id } });
    return reply.send({ success: true, message: 'Review purged by administrator' });
  });
}
