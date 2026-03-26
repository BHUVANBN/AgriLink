import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { User } from '../models/User.js';
import type { JwtPayload } from '@agrilink/types';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

export async function refreshRoutes(fastify: FastifyInstance) {
  // ── POST /auth/refresh ──────────────────────────────────────
  fastify.post(
    '/refresh',
    { config: { rateLimit: { max: 30, timeWindow: '15m' } } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const refreshToken =
        (req.cookies as any)?.agrilink_refresh ??
        (req.headers.authorization?.startsWith('Bearer ')
          ? req.headers.authorization.slice(7)
          : null);

      if (!refreshToken) {
        return reply.status(401).send({ success: false, error: 'No refresh token provided' });
      }

      let decoded: { sub: string; version: number };
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { sub: string; version: number };
      } catch {
        return reply.status(401).send({ success: false, error: 'Invalid or expired refresh token' });
      }

      const user = await User.findUnique({ where: { id: decoded.sub } });
      if (!user || !user.isActive) {
        return reply.status(401).send({ success: false, error: 'User not found' });
      }

      // Token invalidation check (logout/password change increments tokenVersion)
      if (user.tokenVersion !== decoded.version) {
        return reply.status(401).send({ success: false, error: 'Token has been revoked' });
      }

      const sessionId = randomUUID();
      const newAccessToken = fastify.jwt.sign({
        sub: user.id,
        email: user.email,
        role: user.role,
        jti: sessionId,
        tokenVersion: user.tokenVersion,
      }, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '1h',
      });

      reply.setCookie('agrilink_access', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 3600,
      });

      return reply.send({
        success: true,
        data: { accessToken: newAccessToken },
      });
    }
  );

  // ── POST /auth/logout ───────────────────────────────────────
  fastify.post('/logout', async (req: FastifyRequest, reply: FastifyReply) => {
    // Try to get user from access token
    try {
      const token = (req.cookies as any)?.agrilink_access;
      if (token) {
        const payload = (fastify.jwt as any).verify(token) as JwtPayload;
        // Increment tokenVersion to invalidate all existing refresh tokens
        await User.update({ where: { id: payload.sub }, data: { tokenVersion: { increment: 1 } } });
      }
    } catch {
      // Token already expired — still clear cookies
    }

    reply.clearCookie('agrilink_access', { path: '/' });
    reply.clearCookie('agrilink_refresh', { path: '/auth/refresh' });

    return reply.send({ success: true, data: { message: 'Logged out successfully' } });
  });
}
