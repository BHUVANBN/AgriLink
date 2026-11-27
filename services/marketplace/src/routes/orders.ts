import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { publishEvent, enqueueEvent, flushOutbox } from '../services/kafka.js';
import { calculateOrderTotals } from '../utils/calculations.js';
import { getQuote, SupplierUnavailableError } from '../services/supplier.js';
import { canTransition, requiresPayment, type OrderStatus } from '../utils/orderState.js';

const AddressSchema = z.object({}).passthrough();

// Only product IDs + quantities are accepted from the client.
// Any price / total fields the browser sends are ignored.
const CreateOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().int().min(1).max(10_000),
  }).passthrough()).min(1).max(100),
  shippingAddress: AddressSchema,
  paymentMethod: z.enum(['COD', 'RAZORPAY']),
});

const UpdateOrderStatusSchema = z.object({
  orderStatus: z.enum(['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']),
});

export function orderPlacedPayload(order: any, email?: string) {
  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    farmerId: order.farmerId,
    supplierId: order.supplierId,
    supplierUserId: order.supplierUserId,
    items: order.items,
    totalAmount: order.totalPaise,
    shippingAddress: order.shippingAddress,
    paymentStatus: order.paymentStatus,
    email,
  };
}

export async function orderRoutes(fastify: FastifyInstance) {
  const { prisma } = fastify as any;
  fastify.addHook('preHandler', (fastify as any).authenticate);

  // POST /marketplace/orders — one order per supplier, priced server-side
  fastify.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;
    if (user.role !== 'farmer') {
      return reply.status(403).send({ success: false, error: 'Only farmers can place orders' });
    }

    const parsed = CreateOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ success: false, error: 'Invalid order', details: parsed.error.flatten() });
    }
    const { shippingAddress, paymentMethod } = parsed.data;

    // Merge duplicate product lines
    const qtyByProduct = new Map<string, number>();
    for (const i of parsed.data.items) qtyByProduct.set(i.productId, (qtyByProduct.get(i.productId) ?? 0) + i.quantity);
    const requested = [...qtyByProduct].map(([productId, quantity]) => ({ productId, quantity }));

    let quote;
    try {
      quote = await getQuote(requested);
    } catch (err) {
      if (err instanceof SupplierUnavailableError) {
        return reply.status(503).send({ success: false, error: 'Catalogue temporarily unavailable, please retry' });
      }
      throw err;
    }

    const problems = quote.lines.filter((l) => !l.ok);
    if (problems.length) {
      return reply.status(409).send({
        success: false,
        error: 'Some items are no longer available',
        code: 'ITEMS_UNAVAILABLE',
        details: problems.map((p) => ({ productId: p.productId, name: p.name, reason: p.reason, available: p.available })),
      });
    }

    // Group priced lines by supplier
    const bySupplier = new Map<string, typeof quote.lines>();
    for (const line of quote.lines) {
      const list = bySupplier.get(line.supplierId!) ?? [];
      list.push(line);
      bySupplier.set(line.supplierId!, list);
    }

    const createdOrders = await prisma.$transaction(async (tx: any) => {
      const out = [];
      for (const [supplierId, lines] of bySupplier) {
        const supplier = quote.suppliers[supplierId];
        const items = lines.map((l) => ({
          productId: l.productId,
          supplierId,
          name: l.name,
          unit: l.unit,
          image: l.image,
          quantity: l.quantity,
          pricePaise: l.pricePaise!,
          totalPaise: l.totalPaise!,
        }));
        const totals = calculateOrderTotals(items, supplier?.taxRate ?? 0.18, supplier?.taxInclusive ?? true);

        out.push(await tx.order.create({
          data: {
            orderNumber: `ORD-${randomUUID().slice(0, 8).toUpperCase()}`,
            farmerId: user.sub,
            supplierId,
            supplierUserId: supplier?.userId ?? null,
            items,
            ...totals,
            paymentMethod,
            paymentStatus: 'PENDING',
            orderStatus: 'PLACED',
            shippingAddress,
          },
        }));
      }
      // COD orders go to suppliers immediately (same transaction → never lost);
      // online orders only after payment
      if (paymentMethod === 'COD') {
        for (const order of out) await enqueueEvent(tx, 'order.placed', orderPlacedPayload(order, user.email));
      }
      await tx.cartItem.deleteMany({ where: { farmerId: user.sub } });
      return out;
    });
    if (paymentMethod === 'COD') flushOutbox();

    const grandTotalPaise = createdOrders.reduce((s: number, o: any) => s + o.totalPaise, 0);
    return reply.send({ success: true, data: { orders: createdOrders, grandTotalPaise } });
  });

  // GET /marketplace/orders
  fastify.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;
    const { page = 1, limit = 50 } = req.query as any;
    const where: any = {};

    if (user.role === 'farmer') where.farmerId = user.sub;
    else if (user.role === 'supplier') where.supplierUserId = user.sub;
    // admin gets all

    const take = Math.min(Number(limit) || 50, 100);
    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip: (Math.max(Number(page) || 1, 1) - 1) * take,
    });

    return reply.send({ success: true, data: orders });
  });

  // GET /marketplace/orders/:id
  fastify.get('/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;
    const { id } = req.params as { id: string };

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return reply.status(404).send({ success: false, error: 'Not found' });

    if (user.role !== 'admin' && order.farmerId !== user.sub && order.supplierUserId !== user.sub) {
      return reply.status(404).send({ success: false, error: 'Not found' });
    }

    return reply.send({ success: true, data: order });
  });

  // PATCH /marketplace/orders/:id — supplier/admin advances status; farmer may cancel
  fastify.patch('/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;
    const { id } = req.params as { id: string };

    const result = UpdateOrderStatusSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: result.error.flatten() });
    }
    const next = result.data.orderStatus as OrderStatus;

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return reply.status(404).send({ success: false, error: 'Order not found' });

    const isAdmin = user.role === 'admin';
    const isSupplier = order.supplierUserId === user.sub;
    // Farmers may cancel unpaid orders themselves; paid ones need a refund (admin)
    const isFarmerCancel = order.farmerId === user.sub && next === 'CANCELLED'
      && ['PLACED', 'CONFIRMED'].includes(order.orderStatus)
      && order.paymentStatus !== 'PAID';

    if (!isAdmin && !isSupplier && !isFarmerCancel) {
      return reply.status(403).send({ success: false, error: 'Access denied' });
    }
    if (!isAdmin && !canTransition(order.orderStatus, next)) {
      return reply.status(409).send({ success: false, error: `Cannot move order from ${order.orderStatus} to ${next}` });
    }
    if (!isAdmin && requiresPayment(order, next)) {
      return reply.status(409).send({ success: false, error: 'Order has not been paid yet' });
    }

    // Optimistic concurrency: only update if nobody changed it meanwhile
    const res = await prisma.order.updateMany({
      where: { id, orderStatus: order.orderStatus },
      data: { orderStatus: next },
    });
    if (res.count === 0) return reply.status(409).send({ success: false, error: 'Order was updated concurrently, refresh and retry' });
    const updated = await prisma.order.findUnique({ where: { id } });

    await publishEvent('order.status.updated', {
      orderId: updated.id,
      orderNumber: updated.orderNumber,
      farmerId: updated.farmerId,
      newStatus: updated.orderStatus,
    });

    return reply.send({ success: true, data: updated });
  });
}
