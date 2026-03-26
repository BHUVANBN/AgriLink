import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '../../prisma/client/index.js';
import { z } from 'zod';

const UpdateQuantitySchema = z.object({
  quantity: z.number().int().min(1).max(999),
});

export async function cartRoutes(fastify: FastifyInstance) {
  const { prisma } = fastify as any;
  fastify.addHook('preHandler', (fastify as any).authenticate);

  // GET /marketplace/cart
  fastify.get('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).user.sub;
    const cartItems = await prisma.cartItem.findMany({
      where: { farmerId: userId },
      orderBy: { addedAt: 'desc' },
    });
    return reply.send({ success: true, data: cartItems });
  });

  // POST /marketplace/cart/add
  fastify.post('/add', async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).user.sub;
    const { productId, supplierId, quantity, snapshot } = req.body as any;

    if (!productId || !supplierId || !quantity) {
      return reply.status(400).send({ success: false, error: 'Missing required fields' });
    }

    const existing = await prisma.cartItem.findFirst({
      where: { farmerId: userId, productId },
    });

    if (existing) {
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + Math.max(1, Number(quantity)), snapshot },
      });
      return reply.send({ success: true, data: updated });
    }

    const created = await prisma.cartItem.create({
      data: { farmerId: userId, productId, supplierId, quantity: Math.max(1, Number(quantity)), snapshot },
    });
    return reply.send({ success: true, data: created });
  });

  // PATCH /marketplace/cart/:id — update quantity (BUG-013 fix)
  fastify.patch('/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).user.sub;
    const { id } = req.params as { id: string };

    const result = UpdateQuantitySchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: result.error.flatten() });
    }

    const item = await prisma.cartItem.findUnique({ where: { id } });
    if (!item || item.farmerId !== userId) {
      return reply.status(404).send({ success: false, error: 'Cart item not found' });
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: { quantity: result.data.quantity },
    });
    return reply.send({ success: true, data: updated });
  });

  // DELETE /marketplace/cart/:id
  fastify.delete('/:id', async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).user.sub;
    const { id } = req.params as { id: string };

    const item = await prisma.cartItem.findUnique({ where: { id } });
    if (!item || item.farmerId !== userId) {
      return reply.status(404).send({ success: false, error: 'Not found' });
    }

    await prisma.cartItem.delete({ where: { id } });
    return reply.send({ success: true });
  });

  // DELETE /marketplace/cart — clear entire cart
  fastify.delete('/', async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).user.sub;
    await prisma.cartItem.deleteMany({ where: { farmerId: userId } });
    return reply.send({ success: true, data: { message: 'Cart cleared' } });
  });
}
