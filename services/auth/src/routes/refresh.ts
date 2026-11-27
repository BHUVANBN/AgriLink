import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { issueSession, clearSessionCookies } from '../services/tokens.service.js';

interface RefreshClaims {
  sub: string;
  tokenVersion?: number;
  type?: string;
}

function readRefreshToken(req: FastifyRequest): string | null {
  const cookie = (req.cookies as any)?.agrilink_refresh;
  if (cookie) return cookie;
  // Mobile clients may send it explicitly in the body
  const bodyToken = (req.body as any)?.refreshToken;
  return typeof bodyToken === 'string' ? bodyToken : null;
}

function verifyRefresh(token: string): RefreshClaims | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as RefreshClaims;
    return decoded?.type === 'refresh' ? decoded : null;
  } catch {
    return null;
  }
}

export async function refreshRoutes(fastify: FastifyInstance) {
  // ── POST /auth/refresh ──────────────────────────────────────
  // Rotates both tokens. A refresh token is only valid while the user's
  // tokenVersion is unchanged (logout / password change / suspension bump it).
  fastify.post(
    '/refresh',
    { config: { rateLimit: { max: 60, timeWindow: '15m' } } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const token = readRefreshToken(req);
      if (!token) {
        return reply.status(401).send({ success: false, error: 'No refresh token provided', code: 'NO_REFRESH' });
      }

      const decoded = verifyRefresh(token);
      if (!decoded) {
        clearSessionCookies(reply);
        return reply.status(401).send({ success: false, error: 'Invalid or expired refresh token', code: 'INVALID_REFRESH' });
      }

      const user = await User.findUnique({ where: { id: decoded.sub } });
      if (!user || !user.isActive) {
        clearSessionCookies(reply);
        return reply.status(401).send({ success: false, error: 'User not found or suspended', code: 'INVALID_REFRESH' });
      }

      if (user.tokenVersion !== (decoded.tokenVersion ?? 0)) {
        clearSessionCookies(reply);
        return reply.status(401).send({ success: false, error: 'Token has been revoked', code: 'TOKEN_REVOKED' });
      }

      const { accessToken } = await issueSession(fastify, reply, user);

      return reply.send({ success: true, data: { accessToken } });
    }
  );

  // ── POST /auth/logout ───────────────────────────────────────
  // Works even when the access token has already expired (uses refresh cookie).
  fastify.post('/logout', async (req: FastifyRequest, reply: FastifyReply) => {
    let userId: string | undefined;

    const access = (req.cookies as any)?.agrilink_access;
    if (access) {
      try {
        userId = ((fastify.jwt as any).verify(access) as { sub: string }).sub;
      } catch { /* expired — fall through to refresh token */ }
    }
    if (!userId) {
      const refresh = readRefreshToken(req);
      userId = refresh ? verifyRefresh(refresh)?.sub : undefined;
    }

    if (userId) {
      // Invalidates every outstanding access + refresh token for this user
      await User.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } }).catch(() => {});
    }

    clearSessionCookies(reply);
    return reply.send({ success: true, data: { message: 'Logged out successfully' } });
  });
}
