import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { publishEvent } from '../services/kafka.js';
import { calculateOrderTotals } from '../utils/calculations.js';
import { getSupplierTaxConfig } from '../services/supplier.js';

const UpdateOrderStatusSchema = z.object({
  orderStatus: z.enum(['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']),
});

export async function orderRoutes(fastify: FastifyInstance) {
  const { prisma } = fastify as any;
  fastify.addHook('preHandler', (fastify as any).authenticate);

  // POST /marketplace/orders
  fastify.post('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).user.sub;
    const { items, shippingAddress, paymentMethod } = req.body as any;

    if (!items || items.length === 0) {
      return reply.status(400).send({ success: false, error: 'Empty order' });
    }

    // Group items by supplier — one order per supplier
    const supplierMap = new Map<string, any[]>();
    for (const item of items) {
      const existing = supplierMap.get(item.supplierId) ?? [];
      existing.push(item);
      supplierMap.set(item.supplierId, existing);
    }

    const createdOrders = [];

    for (const [supplierId, supplierItems] of supplierMap.entries()) {
      // 🛡️ Fetch real tax preference from supplier service
      const { taxRate, taxInclusive } = await getSupplierTaxConfig(supplierId);
      
      const { subtotalPaise, taxPaise, shippingPaise, totalPaise } = calculateOrderTotals(supplierItems, taxRate, taxInclusive);

      // BUG-007 fix: UUID-based order number prevents collisions
      const orderNumber = `ORD-${randomUUID().slice(0, 8).toUpperCase()}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          farmerId: userId,
          supplierId,
          items: supplierItems,
          subtotalPaise,
          taxPaise,
          shippingPaise,
          totalPaise,
          paymentMethod,
          paymentStatus: 'PENDING',
          orderStatus: 'PLACED',
          shippingAddress,
        },
      });

      createdOrders.push(order);

      if (paymentMethod === 'COD') {
        await publishEvent('order.placed', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          farmerId: order.farmerId,
          supplierId: order.supplierId,
          items: order.items,
          totalAmount: order.totalPaise,
          email: (req as any).user.email,
        });
      }
    }

    // Clear cart after order placed
    await prisma.cartItem.deleteMany({ where: { farmerId: userId } });

    return reply.send({ success: true, data: { orders: createdOrders } });
  });

  // GET /marketplace/orders
  fastify.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;
    let whereClause: any = {};

    if (user.role === 'farmer') whereClause.farmerId = user.sub;
    else if (user.role === 'supplier') whereClause.supplierId = user.sub;
    // admin gets all

    const orders = await prisma.order.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return reply.send({ success: true, data: orders });
  });

  // GET /marketplace/orders/:id
  fastify.get('/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;
    const { id } = req.params as { id: string };

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return reply.status(404).send({ success: false, error: 'Not found' });

    if (user.role !== 'admin' && order.farmerId !== user.sub && order.supplierId !== user.sub) {
      return reply.status(403).send({ success: false, error: 'Access denied' });
    }

    return reply.send({ success: true, data: order });
  });

  // PATCH /marketplace/orders/:id — supplier advances order status (BUG-014 fix)
  fastify.patch('/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;
    const { id } = req.params as { id: string };

    const result = UpdateOrderStatusSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: result.error.flatten() });
    }

    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) return reply.status(404).send({ success: false, error: 'Order not found' });

    // Only the supplier who owns the order or an admin can update
    if (user.role !== 'admin' && order.supplierId !== user.sub) {
      return reply.status(403).send({ success: false, error: 'Access denied' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { orderStatus: result.data.orderStatus },
    });

    // Publish status update event for notifications
    await publishEvent('order.status.updated', {
      orderId: updated.id,
      orderNumber: updated.orderNumber,
      farmerId: updated.farmerId,
      newStatus: updated.orderStatus,
    });

    return reply.send({ success: true, data: updated });
  });
}
