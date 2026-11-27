/**
 * Internal (service-to-service) routes.
 * Never exposed publicly: Nginx returns 404 for /<service>/internal/*,
 * and every route requires the shared INTERNAL_API_KEY.
 */
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireInternalKey } from '@agrilink/auth-middleware';
import { User } from '../models/User.js';

const ListUsersQuery = z.object({
  role: z.enum(['farmer', 'supplier', 'admin', 'all']).default('all'),
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(1000).default(500),
});

export async function internalRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireInternalKey());

  // GET /auth/internal/users?role=farmer&cursor=<id>&limit=500
  // Cursor-paginated so broadcasts scale past a few thousand users.
  fastify.get('/users', async (req, reply) => {
    const q = ListUsersQuery.safeParse(req.query);
    if (!q.success) return reply.status(400).send({ success: false, error: q.error.flatten() });
    const { role, cursor, limit } = q.data;

    const users = await User.findMany({
      where: { isActive: true, emailVerified: true, ...(role === 'all' ? {} : { role }) },
      select: { id: true, email: true, phone: true, role: true, fullName: true, companyName: true },
      orderBy: { id: 'asc' },
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    return reply.send({
      success: true,
      data: { users, nextCursor: users.length === limit ? users[users.length - 1].id : null },
    });
  });
}
