import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../models/User.js';
import { revokeAllSessions } from '../services/redis.service.js';
import { publishEvent } from '../services/kafka.producer.js';

export async function profileRoutes(fastify: FastifyInstance) {

  // ── GET /auth/me ────────────────────────────────────────────
  // Returns full user profile from MongoDB (not just JWT claims)
  fastify.get(
    '/me',
    { preHandler: [(fastify as any).authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const userId = (req as any).user.sub;

      const user = await User.findUnique({ where: { id: userId } }) as any;

      if (!user) {
        return reply.status(404).send({ success: false, error: 'User not found' });
      }
      if (!user.isActive) {
        return reply.status(403).send({ success: false, error: 'Account suspended', code: 'SUSPENDED' });
      }

      return reply.send({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.role,
          fullName: user.fullName,
          companyName: user.companyName,
          displayName: user.fullName ?? user.companyName ?? user.email,
          emailVerified: user.emailVerified,
          kycStatus: user.kycStatus,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      });
    }
  );

  // ── GET /auth/introspect ─────────────────────────────────────
  // Service-to-service token validation endpoint
  // Other services call this to verify if a token is still valid
  fastify.get(
    '/introspect',
    { preHandler: [(fastify as any).authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const claims = (req as any).user;

      // Validate tokenVersion against DB (catches password changes, forced logout)
      const user = await User.findUnique({ where: { id: claims.sub }, select: { tokenVersion: true, isActive: true } }) as any;
      if (!user || !user.isActive) {
        return reply.status(401).send({ success: false, active: false, error: 'User not found or suspended' });
      }
      if (user.tokenVersion !== claims.tokenVersion) {
        return reply.status(401).send({ success: false, active: false, error: 'Token has been revoked' });
      }

      return reply.send({
        success: true,
        active: true,
        data: {
          sub: claims.sub,
          email: claims.email,
          role: claims.role,
          exp: claims.exp,
        },
      });
    }
  );

  // ── DELETE /auth/sessions/all ────────────────────────────────
  // Log out from all devices
  fastify.delete(
    '/sessions/all',
    { preHandler: [(fastify as any).authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const userId = (req as any).user.sub;

      // Increment tokenVersion → all existing JWTs become invalid
      await User.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } });

      // Clear all Redis session records
      await revokeAllSessions(userId);

      // Clear current cookies
      reply.clearCookie('agrilink_access', { path: '/' });
      reply.clearCookie('agrilink_refresh', { path: '/auth/refresh' });

      return reply.send({
        success: true,
        data: { message: 'Logged out from all devices' },
      });
    }
  );

  // ── PUT /auth/me ─────────────────────────────────────────────
  // Update basic profile (name, phone)
  fastify.put(
    '/me',
    { preHandler: [(fastify as any).authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const userId = (req as any).user.sub;
      const body = req.body as { fullName?: string; companyName?: string; phone?: string };

      const allowedUpdates: Record<string, any> = {};
      if (body.fullName) allowedUpdates.fullName = body.fullName.trim();
      if (body.companyName) allowedUpdates.companyName = body.companyName.trim();
      if (body.phone) {
        if (!/^[6-9]\d{9}$/.test(body.phone)) {
          return reply.status(400).send({ success: false, error: 'Invalid Indian phone number' });
        }
        allowedUpdates.phone = body.phone;
      }

      const updated = await User.update({ where: { id: userId }, data: allowedUpdates });

      return reply.send({ success: true, data: updated });
    }
  );
}
