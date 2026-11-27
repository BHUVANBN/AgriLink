import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { getProduct } from '../services/supplier.js';

// Only the product ID is trusted; the snapshot comes from the catalogue.
const AddWishlistSchema = z.object({ productId: z.string().min(1) }).passthrough();

export async function wishlistRoutes(fastify: FastifyInstance) {
  const { prisma } = fastify as any;
  // Add item to wishlist
  fastify.post(
    '/',
    { preHandler: [(fastify as any).authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const farmerId = (req as any).user.sub;
      const parsed = AddWishlistSchema.safeParse(req.body);
      if (!parsed.success) return reply.status(400).send({ success: false, error: parsed.error.flatten() });
      const product = await getProduct(parsed.data.productId);
      if (!product) return reply.status(404).send({ success: false, error: 'Product not available' });
      const productId = product.id;
      const supplierId = product.supplierId;
      const snapshot = {
        id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        unit: product.unit,
        category: product.category,
        image: product.images?.[0] ?? null,
        images: product.images ?? [],
      };

      const item = await (prisma as any).wishlistItem.upsert({
        where: {
          farmerId_productId: { farmerId, productId },
        },
        update: {
          snapshot,
        },
        create: {
          farmerId,
          productId,
          supplierId,
          snapshot,
        },
      });

      return reply.send({ success: true, data: item });
    }
  );

  // Get wishlist items
  fastify.get(
    '/',
    { preHandler: [(fastify as any).authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const farmerId = (req as any).user.sub;

      const items = await (prisma as any).wishlistItem.findMany({
        where: { farmerId },
        orderBy: { addedAt: 'desc' },
      });

      return reply.send({ success: true, data: items });
    }
  );

  // Remove item from wishlist
  fastify.delete(
    '/:productId',
    { preHandler: [(fastify as any).authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const farmerId = (req as any).user.sub;
      const { productId } = req.params as { productId: string };

      await (prisma as any).wishlistItem.deleteMany({
        where: { farmerId, productId },
      });

      return reply.send({ success: true, message: 'Item removed from wishlist' });
    }
  );
  
  // Check if item is in wishlist
  fastify.get(
    '/check/:productId',
    { preHandler: [(fastify as any).authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const farmerId = (req as any).user.sub;
      const { productId } = req.params as { productId: string };

      const item = await (prisma as any).wishlistItem.findUnique({
        where: {
          farmerId_productId: { farmerId, productId },
        },
      });

      return reply.send({ success: true, inWishlist: !!item });
    }
  );
}
