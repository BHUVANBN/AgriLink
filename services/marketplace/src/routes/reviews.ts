import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { publishEvent } from '../services/kafka.js';

// Reviews are "verified purchase" only: the farmer must own a DELIVERED order
// that contains the product. Supplier is taken from the order, not the client.
const CreateReviewSchema = z.object({
  orderId: z.string().uuid(),
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().min(3).max(100),
  body: z.string().trim().min(10).max(1000),
});

const FlagReviewSchema = z.object({
  isFlagged: z.boolean(),
  flagReason: z.string().max(300).optional(),
});

/** Recompute a product's public rating and broadcast it (idempotent). */
export async function publishProductRating(prisma: any, productId: string) {
  const agg = await prisma.review.aggregate({
    where: { productId, isFlagged: false },
    _avg: { rating: true },
    _count: { _all: true },
  });
  await publishEvent('product.rating.updated', {
    productId,
    rating: Number((agg._avg.rating ?? 0).toFixed(2)),
    reviewCount: agg._count._all,
  });
}

export async function reviewRoutes(fastify: FastifyInstance) {
  const { prisma } = fastify as any;
  const auth = (fastify as any).authenticate;

  // Public: GET /marketplace/reviews?productId=… | ?supplierId=…   (hides flagged)
  fastify.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const { productId, supplierId, limit = 50 } = req.query as any;
    if (!productId && !supplierId) {
      return reply.status(400).send({ success: false, error: 'productId or supplierId is required' });
    }
    const where: any = { isFlagged: false };
    if (productId) where.productId = productId;
    if (supplierId) where.supplierId = supplierId;

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: Math.min(Number(limit) || 50, 200),
      select: { id: true, productId: true, supplierId: true, rating: true, title: true, body: true, isVerified: true, createdAt: true },
    });
    return reply.send({ success: true, data: reviews });
  });

  // Farmer: GET /marketplace/reviews/mine — which order items are already reviewed
  fastify.get('/mine', { preHandler: [auth] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const reviews = await prisma.review.findMany({
      where: { farmerId: (req as any).user.sub },
      orderBy: { createdAt: 'desc' },
    });
    return reply.send({ success: true, data: reviews });
  });

  // Farmer: POST /marketplace/reviews
  fastify.post('/', { preHandler: [auth], config: { rateLimit: { max: 10, timeWindow: '1m' } } }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { sub: farmerId, role } = (req as any).user;
    if (role !== 'farmer') {
      return reply.status(403).send({ success: false, error: 'Only farmers can review products' });
    }

    const result = CreateReviewSchema.safeParse(req.body);
    if (!result.success) return reply.status(400).send({ success: false, error: result.error.flatten() });
    const { orderId, productId, rating, title, body } = result.data;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.farmerId !== farmerId) {
      return reply.status(404).send({ success: false, error: 'Order not found' });
    }
    if (order.orderStatus !== 'DELIVERED') {
      return reply.status(409).send({ success: false, error: 'You can review a product once the order is delivered' });
    }
    const items = (order.items ?? []) as { productId: string }[];
    if (!items.some((i) => i.productId === productId)) {
      return reply.status(400).send({ success: false, error: 'This product is not part of the order' });
    }

    const existing = await prisma.review.findFirst({ where: { farmerId, productId, orderId } });
    if (existing) {
      return reply.status(409).send({ success: false, error: 'You have already reviewed this product for this order' });
    }

    const review = await prisma.review.create({
      data: { orderId, productId, supplierId: order.supplierId, farmerId, rating, title, body, isVerified: true },
    });

    await publishProductRating(prisma, productId);
    await publishEvent('review.created', {
      reviewId: review.id,
      supplierId: review.supplierId,
      userId: order.supplierUserId ?? undefined, // notifies the supplier in-app
      productId,
      rating,
      subject: `New ${rating}★ review`,
      body: title,
    });

    return reply.status(201).send({ success: true, data: review });
  });

  // Flag / unflag: admin, the review's author, or the supplier being reviewed
  fastify.patch('/:id/flag', { preHandler: [auth] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { sub: userId, role } = (req as any).user;

    const result = FlagReviewSchema.safeParse(req.body);
    if (!result.success) return reply.status(400).send({ success: false, error: result.error.flatten() });

    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return reply.status(404).send({ success: false, error: 'Review not found' });

    let allowed = role === 'admin' || review.farmerId === userId;
    if (!allowed && role === 'supplier') {
      // Supplier profile IDs differ from user IDs — resolve via an order we know is theirs
      const owns = await prisma.order.findFirst({
        where: { supplierId: review.supplierId, supplierUserId: userId },
        select: { id: true },
      });
      allowed = !!owns;
    }
    // Only admins can un-flag (otherwise a supplier could hide and restore at will)
    if (!allowed || (!result.data.isFlagged && role !== 'admin')) {
      return reply.status(403).send({ success: false, error: 'Access denied' });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { isFlagged: result.data.isFlagged, flagReason: result.data.flagReason ?? null },
    });
    await publishProductRating(prisma, review.productId);
    return reply.send({ success: true, data: updated });
  });

  // Admin: DELETE /marketplace/reviews/:id
  fastify.delete('/:id', { preHandler: [auth] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    if ((req as any).user.role !== 'admin') {
      return reply.status(403).send({ success: false, error: 'Admin access required' });
    }
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return reply.status(404).send({ success: false, error: 'Review not found' });
    await prisma.review.delete({ where: { id } });
    await publishProductRating(prisma, review.productId);
    return reply.send({ success: true, message: 'Review removed by administrator' });
  });
}

/** Admin-only marketplace routes (registered under /marketplace/admin). */
export async function marketplaceAdminRoutes(fastify: FastifyInstance) {
  const { prisma } = fastify as any;
  fastify.addHook('preHandler', (fastify as any).authenticate);
  fastify.addHook('preHandler', (fastify as any).requireRole('admin'));

  // GET /marketplace/admin/transactions?status=PAID|PENDING|REFUNDED|FAILED&method=RAZORPAY|COD
  fastify.get('/transactions', async (req: FastifyRequest, reply: FastifyReply) => {
    const { status, method, limit = 100 } = req.query as any;
    const where: any = {};
    if (status) where.paymentStatus = status;
    if (method) where.paymentMethod = method;

    const [orders, byStatus] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: Math.min(Number(limit) || 100, 500),
        select: {
          id: true, orderNumber: true, farmerId: true, supplierId: true, totalPaise: true,
          paymentMethod: true, paymentStatus: true, orderStatus: true,
          razorpayOrderId: true, razorpayPaymentId: true, paidAt: true, createdAt: true,
        },
      }),
      prisma.order.groupBy({ by: ['paymentStatus'], _sum: { totalPaise: true }, _count: { _all: true } }),
    ]);

    const summary = Object.fromEntries(byStatus.map((g: any) => [g.paymentStatus, { count: g._count._all, totalPaise: g._sum.totalPaise ?? 0 }]));
    return reply.send({ success: true, data: { summary, orders } });
  });

  // GET /marketplace/admin/reviews?flagged=true
  fastify.get('/reviews', async (req: FastifyRequest, reply: FastifyReply) => {
    const { flagged, limit = 200 } = req.query as any;
    const reviews = await prisma.review.findMany({
      where: flagged === undefined ? {} : { isFlagged: flagged === 'true' },
      orderBy: [{ isFlagged: 'desc' }, { createdAt: 'desc' }],
      take: Math.min(Number(limit) || 200, 500),
    });
    return reply.send({ success: true, data: reviews });
  });
}
