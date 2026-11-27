import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { getProduct } from '../services/supplier.js';

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

  // POST /marketplace/cart  (and legacy /marketplace/cart/add)
  // Client sends only { productId, quantity }. Supplier, price, name and image
  // are looked up from the live catalogue so the cart can't be spoofed and
  // every UI gets the same snapshot shape.
  const AddSchema = z.object({
    productId: z.string().min(1),
    quantity: z.coerce.number().int().min(1).max(999).default(1),
  });

  const addHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = (req as any).user.sub;
    const parsed = AddSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ success: false, error: 'productId and quantity are required' });
    }
    const { productId, quantity } = parsed.data;

    const product = await getProduct(productId);
    if (!product) return reply.status(404).send({ success: false, error: 'Product not available' });

    const existing = await prisma.cartItem.findFirst({ where: { farmerId: userId, productId: product.id } });
    const newQty = (existing?.quantity ?? 0) + quantity;
    if (newQty > product.stockQuantity) {
      return reply.status(409).send({
        success: false,
        error: `Only ${product.stockQuantity} ${product.unit ?? 'units'} in stock`,
        code: 'OUT_OF_STOCK',
      });
    }

    const snapshot = {
      name: product.name,
      price: product.price,
      mrp: product.mrp,
      unit: product.unit,
      category: product.category,
      image: product.images?.[0] ?? null,
      images: product.images ?? [],
      supplierName: product.supplier?.companyName ?? null,
    };

    const item = existing
      ? await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: newQty, snapshot } })
      : await prisma.cartItem.create({
          data: { farmerId: userId, productId: product.id, supplierId: product.supplierId, quantity, snapshot },
        });
    return reply.send({ success: true, data: item });
  };

  fastify.post('/', addHandler);
  fastify.post('/add', addHandler);

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
