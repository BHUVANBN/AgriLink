/**
 * Shared Auth Middleware
 * Used by Farmer, Supplier, Marketplace, Notification and Blockchain services
 * to verify JWT tokens issued by the Auth Service.
 *
 * Usage in any Fastify service:
 *   import { makeAuthMiddleware } from '@agrilink/auth-middleware';
 *   fastify.decorate('authenticate', makeAuthMiddleware(fastify, { redis }));
 *
 * Revocation: the Auth service mirrors each user's `tokenVersion` and
 * suspension flag into Redis (see `authStateKeys`). When a Redis client is
 * passed in, every request is checked against it, so logout / password change /
 * admin suspension take effect immediately in every service instead of
 * waiting for the access token to expire. Redis outages fail open (the token
 * is still signature-checked and short-lived).
 */
import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { timingSafeEqual } from 'crypto';
import type {} from '@fastify/jwt'; // type augmentation only (no runtime dependency)

export interface JwtClaims {
  sub: string;       // User ID
  email: string;
  role: 'farmer' | 'supplier' | 'admin';
  jti: string;       // JWT unique ID
  tokenVersion: number;
  name?: string;     // display name (fullName / companyName)
  iat: number;
  exp: number;
}

export type AuthenticatedRequest = FastifyRequest & { user: JwtClaims };

/** Minimal Redis surface we need (ioredis compatible). */
export interface RedisLike {
  mget(...keys: string[]): Promise<(string | null)[]>;
}

export interface AuthMiddlewareOptions {
  redis?: RedisLike | null;
}

/** Redis keys shared between the Auth service (writer) and all services (readers). */
export const authStateKeys = {
  tokenVersion: (userId: string) => `auth:tv:${userId}`,
  suspended: (userId: string) => `auth:off:${userId}`,
};

/** TTL for the mirrored auth state — longer than the refresh-token lifetime. */
export const AUTH_STATE_TTL_SECONDS = 8 * 24 * 3600;

/**
 * Returns a Fastify preHandler that:
 * 1. Reads JWT from HttpOnly cookie OR Authorization header
 * 2. Verifies signature + expiry
 * 3. Rejects refresh tokens used as access tokens
 * 4. (optional) Checks revocation state in Redis
 * 5. Attaches user claims to req.user
 */
export function makeAuthMiddleware(fastify: FastifyInstance, opts: AuthMiddlewareOptions = {}) {
  return async function authenticate(req: FastifyRequest, reply: FastifyReply) {
    let claims: JwtClaims & { type?: string };
    try {
      // Prefer cookie, fallback to Bearer header
      const cookieToken = (req as any).cookies?.agrilink_access;
      const headerToken = req.headers.authorization?.replace(/^Bearer\s+/i, '');
      const token = cookieToken ?? headerToken;

      if (!token) {
        return reply.status(401).send({
          success: false,
          error: 'Not authenticated',
          code: 'NO_TOKEN',
        });
      }

      claims = fastify.jwt.verify<JwtClaims & { type?: string }>(token);
    } catch (err: any) {
      const expired = err?.code === 'FAST_JWT_EXPIRED' || err?.message?.includes('expired');
      return reply.status(401).send({
        success: false,
        error: expired ? 'Session expired — please refresh your token' : 'Invalid token',
        code: expired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
      });
    }

    if (claims?.type === 'refresh') {
      return reply.status(401).send({ success: false, error: 'Invalid token', code: 'INVALID_TOKEN' });
    }

    if (opts.redis && claims?.sub) {
      try {
        const [tv, off] = await opts.redis.mget(
          authStateKeys.tokenVersion(claims.sub),
          authStateKeys.suspended(claims.sub),
        );
        if (off === '1') {
          return reply.status(403).send({ success: false, error: 'Account suspended', code: 'ACCOUNT_SUSPENDED' });
        }
        if (tv !== null && tv !== undefined && Number(tv) !== Number(claims.tokenVersion ?? 0)) {
          return reply.status(401).send({ success: false, error: 'Session has been revoked', code: 'TOKEN_REVOKED' });
        }
      } catch {
        // Fail open: Redis down must not take the whole platform down.
      }
    }

    (req as any).user = claims;
  };
}

/**
 * Role guard factory.
 * Usage: fastify.get('/admin', { preHandler: [authenticate, requireRole('admin')] }, handler)
 */
export function requireRole(...roles: JwtClaims['role'][]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user as JwtClaims | undefined;
    if (!user) {
      return reply.status(401).send({ success: false, error: 'Not authenticated', code: 'NO_TOKEN' });
    }
    if (!roles.includes(user.role)) {
      return reply.status(403).send({
        success: false,
        error: `Access denied. Required role: ${roles.join(' or ')}`,
        code: 'FORBIDDEN',
      });
    }
  };
}

/**
 * Require account to be authenticated. KYC status lives in each service's
 * own DB, so services check `kycStatus` themselves on top of this.
 */
export function requireKycApproved() {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user as JwtClaims | undefined;
    if (!user) {
      return reply.status(401).send({ success: false, error: 'Not authenticated' });
    }
  };
}

/**
 * Service-to-service guard. Internal endpoints (never routed by Nginx)
 * require the shared INTERNAL_API_KEY in the `x-internal-key` header.
 */
export function requireInternalKey(expected = process.env.INTERNAL_API_KEY) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const got = req.headers['x-internal-key'];
    if (!expected || typeof got !== 'string' || !safeEqual(got, expected)) {
      return reply.status(403).send({ success: false, error: 'Forbidden', code: 'FORBIDDEN' });
    }
  };
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}
