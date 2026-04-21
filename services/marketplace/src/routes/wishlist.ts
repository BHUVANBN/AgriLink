import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../models/Order.js'; // Reusing prisma client
import { z } from 'zod';

const AddWishlistSchema = z.object({
  productId: z.string(),
  supplierId: z.string(),
  snapshot: z.any(),
});

export async function wishlistRoutes(fastify: FastifyInstance) {
  // Add item to wishlist
  fastify.post(
    '/',
    { preHandler: [(fastify as any).authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const farmerId = (req as any).user.sub;
      const { productId, supplierId, snapshot } = AddWishlistSchema.parse(req.body);

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
