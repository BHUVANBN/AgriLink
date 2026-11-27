import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { getQuote } from '../services/supplier.js';
import { publishEvent } from '../services/kafka.js';
import { calculateOrderTotals } from '../utils/calculations.js';

/**
 * Community (group-buy) deals.
 *  - A KYC-approved supplier offers a discounted price on one of their products
 *    if farmers collectively pledge `targetQuantity` before `endsAt`.
 *  - Farmers pledge a quantity (can change or withdraw until the deal closes).
 *  - When the deal closes (see `settleExpiredDeals`): if the target was met,
 *    every participant gets an order at the deal price, payable online from
 *    My Orders; otherwise participants are told the deal did not unlock.
 */

const JoinDealSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(10_000),
  shippingAddress: z.object({
    name: z.string().trim().min(2).max(100),
    phone: z.string().trim().min(10).max(15),
    street: z.string().trim().min(3).max(300),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().max(100).default('Karnataka'),
    pincode: z.string().trim().regex(/^\d{6}$/, 'Invalid PIN code'),
  }),
});

const CreateDealSchema = z.object({
  productId: z.string().min(1),
  title: z.string().trim().min(5).max(120),
  description: z.string().trim().min(10).max(1000),
  targetQuantity: z.coerce.number().int().min(2).max(100_000),
  dealPricePaise: z.coerce.number().int().positive(),
  endsAt: z.coerce.date(),
});

export async function communityRoutes(fastify: FastifyInstance) {
  const { prisma } = fastify as any;
  const auth = (fastify as any).authenticate;

  // Public: GET /marketplace/community/deals — open deals
  fastify.get('/deals', async (_req: FastifyRequest, reply: FastifyReply) => {
    const deals = await prisma.communityDeal.findMany({
      where: { isActive: true, endsAt: { gt: new Date() } },
      include: { _count: { select: { participants: true } } },
      orderBy: { endsAt: 'asc' },
      take: 100,
    });
    return reply.send({ success: true, data: deals });
  });

  // Farmer: GET /marketplace/community/deals/mine — my pledges (incl. closed deals)
  fastify.get('/deals/mine', { preHandler: [auth] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const pledges = await prisma.dealParticipant.findMany({
      where: { farmerId: (req as any).user.sub },
      include: { deal: true },
      orderBy: { createdAt: 'desc' },
    });
    return reply.send({ success: true, data: pledges });
  });

  // Supplier: GET /marketplace/community/deals/supplier — deals I created
  fastify.get('/deals/supplier', { preHandler: [auth] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;
    if (user.role !== 'supplier') return reply.status(403).send({ success: false, error: 'Suppliers only' });
    const deals = await prisma.communityDeal.findMany({
      where: { supplierUserId: user.sub },
      include: { _count: { select: { participants: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return reply.send({ success: true, data: deals });
  });

  // Farmer: POST /marketplace/community/deals/:id/join  { quantity }
  fastify.post('/deals/:id/join', { preHandler: [auth] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const user = (req as any).user;
    if (user.role !== 'farmer') return reply.status(403).send({ success: false, error: 'Only farmers can join deals' });

    const result = JoinDealSchema.safeParse(req.body ?? { quantity: 1 });
    if (!result.success) {
      return reply.status(400).send({ success: false, error: 'Please enter a quantity and a complete delivery address', details: result.error.flatten() });
    }

    const deal = await prisma.communityDeal.findUnique({ where: { id } });
    if (!deal || !deal.isActive || deal.endsAt <= new Date()) {
      return reply.status(404).send({ success: false, error: 'This deal is closed' });
    }

    const participation = await prisma.$transaction(async (tx: any) => {
      const p = await tx.dealParticipant.upsert({
        where: { dealId_farmerId: { dealId: id, farmerId: user.sub } },
        update: { quantity: result.data.quantity, shippingAddress: result.data.shippingAddress },
        create: { dealId: id, farmerId: user.sub, quantity: result.data.quantity, shippingAddress: result.data.shippingAddress },
      });
      const agg = await tx.dealParticipant.aggregate({ where: { dealId: id }, _sum: { quantity: true } });
      await tx.communityDeal.update({ where: { id }, data: { currentQuantity: agg._sum.quantity ?? 0 } });
      return p;
    });

    return reply.send({ success: true, data: participation });
  });

  // Farmer: DELETE /marketplace/community/deals/:id/join — withdraw pledge
  fastify.delete('/deals/:id/join', { preHandler: [auth] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const user = (req as any).user;
    const deal = await prisma.communityDeal.findUnique({ where: { id } });
    if (!deal || !deal.isActive || deal.endsAt <= new Date()) {
      return reply.status(409).send({ success: false, error: 'This deal is already closed' });
    }
    await prisma.$transaction(async (tx: any) => {
      await tx.dealParticipant.deleteMany({ where: { dealId: id, farmerId: user.sub } });
      const agg = await tx.dealParticipant.aggregate({ where: { dealId: id }, _sum: { quantity: true } });
      await tx.communityDeal.update({ where: { id }, data: { currentQuantity: agg._sum.quantity ?? 0 } });
    });
    return reply.send({ success: true });
  });

  // Supplier: POST /marketplace/community/deals
  fastify.post('/deals', { preHandler: [auth] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;
    if (user.role !== 'supplier') return reply.status(403).send({ success: false, error: 'Only suppliers can create deals' });

    const parsed = CreateDealSchema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ success: false, error: parsed.error.flatten() });
    const d = parsed.data;

    const now = Date.now();
    if (d.endsAt.getTime() < now + 3600_000 || d.endsAt.getTime() > now + 90 * 86400_000) {
      return reply.status(400).send({ success: false, error: 'Deal must end between 1 hour and 90 days from now' });
    }

    // Product must be live and belong to this supplier; price comes from the catalogue
    const quote = await getQuote([{ productId: d.productId, quantity: 1 }]).catch(() => null);
    const line = quote?.lines[0];
    const supplier = line?.supplierId ? quote!.suppliers[line.supplierId] : undefined;
    if (!line?.ok || !supplier || supplier.userId !== user.sub) {
      return reply.status(400).send({ success: false, error: 'Choose one of your own active products' });
    }
    if (d.dealPricePaise >= line.pricePaise!) {
      return reply.status(400).send({ success: false, error: 'Deal price must be lower than the current price' });
    }

    const deal = await prisma.communityDeal.create({
      data: {
        productId: d.productId,
        supplierId: line.supplierId,
        supplierUserId: user.sub,
        title: d.title,
        description: d.description,
        targetQuantity: d.targetQuantity,
        originalPricePaise: line.pricePaise!,
        dealPricePaise: d.dealPricePaise,
        endsAt: d.endsAt,
      },
    });
    return reply.status(201).send({ success: true, data: deal });
  });

  // Supplier: POST /marketplace/community/deals/:id/close — end early
  fastify.post('/deals/:id/close', { preHandler: [auth] }, async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const user = (req as any).user;
    const deal = await prisma.communityDeal.findUnique({ where: { id } });
    if (!deal || (deal.supplierUserId !== user.sub && user.role !== 'admin')) {
      return reply.status(404).send({ success: false, error: 'Deal not found' });
    }
    if (!deal.isActive) return reply.status(409).send({ success: false, error: 'Deal already closed' });
    await prisma.communityDeal.update({ where: { id }, data: { endsAt: new Date() } });
    const settled = await settleExpiredDeals(fastify);
    return reply.send({ success: true, data: { settled } });
  });
}

/**
 * Close every deal past its end date (idempotent; safe to run from any replica
 * because each deal is claimed with a conditional update first).
 */
export async function settleExpiredDeals(fastify: FastifyInstance): Promise<number> {
  const { prisma } = fastify as any;
  const due = await prisma.communityDeal.findMany({
    where: { isActive: true, endsAt: { lte: new Date() } },
    take: 50,
  });

  let settled = 0;
  for (const deal of due) {
    const claim = await prisma.communityDeal.updateMany({ where: { id: deal.id, isActive: true }, data: { isActive: false } });
    if (claim.count === 0) continue; // another replica got it
    settled++;

    const participants = await prisma.dealParticipant.findMany({ where: { dealId: deal.id } });
    const unlocked = deal.currentQuantity >= deal.targetQuantity;

    if (!unlocked) {
      for (const p of participants) {
        await publishEvent('notification.send', {
          userId: p.farmerId,
          channels: ['web'],
          subject: 'Group deal did not unlock',
          body: `"${deal.title}" reached ${deal.currentQuantity}/${deal.targetQuantity}. No order was created and you will not be charged.`,
        });
      }
      continue;
    }

    // Look up name/unit/tax once; price is the locked deal price
    const quote = await getQuote([{ productId: deal.productId, quantity: 1 }]).catch(() => null);
    const line = quote?.lines[0];
    const supplier = quote?.suppliers[deal.supplierId];

    for (const p of participants) {
      const items = [{
        productId: deal.productId,
        supplierId: deal.supplierId,
        name: line?.name ?? deal.title,
        unit: line?.unit,
        image: line?.image ?? null,
        quantity: p.quantity,
        pricePaise: deal.dealPricePaise,
        totalPaise: deal.dealPricePaise * p.quantity,
      }];
      const totals = calculateOrderTotals(items, supplier?.taxRate ?? 0.18, supplier?.taxInclusive ?? true);
      const order = await prisma.order.create({
        data: {
          orderNumber: `ORD-${randomUUID().slice(0, 8).toUpperCase()}`,
          farmerId: p.farmerId,
          supplierId: deal.supplierId,
          supplierUserId: deal.supplierUserId,
          items,
          ...totals,
          paymentMethod: 'RAZORPAY',
          paymentStatus: 'PENDING',
          orderStatus: 'PLACED',
          shippingAddress: p.shippingAddress ?? {},
          notes: `Community deal: ${deal.title}`,
        },
      });
      await prisma.dealParticipant.update({ where: { id: p.id }, data: { orderId: order.id } });
      await publishEvent('notification.send', {
        userId: p.farmerId,
        channels: ['web'],
        subject: 'Group deal unlocked 🎉',
        body: `"${deal.title}" hit its target. Your order ${order.orderNumber} is ready — pay from My Orders to confirm.`,
      });
    }
  }
  return settled;
}
