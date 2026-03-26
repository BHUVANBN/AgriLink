/**
 * Shared Auth Middleware
 * Used by Farmer, Supplier, Marketplace, Blockchain services to verify
 * JWT tokens issued by the Auth Service.
 *
 * Usage in any Fastify service:
 *   import { makeAuthMiddleware } from '@agrilink/auth-middleware';
 *   fastify.decorate('authenticate', makeAuthMiddleware(fastify));
 */
import type { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import '@fastify/jwt';


export interface JwtClaims {
  sub: string;       // User MongoDB ObjectId
  email: string;
  role: 'farmer' | 'supplier' | 'admin';
  jti: string;       // JWT unique ID (for blacklisting)
  tokenVersion: number;
  iat: number;
  exp: number;
}

export type AuthenticatedRequest = FastifyRequest & { user: JwtClaims };

/**
 * Returns a Fastify preHandler that:
 * 1. Reads JWT from HttpOnly cookie OR Authorization header
 * 2. Verifies signature
 * 3. Attaches user claims to req.user
 */
export function makeAuthMiddleware(fastify: FastifyInstance) {
  return async function authenticate(req: FastifyRequest, reply: FastifyReply) {
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

      const claims = fastify.jwt.verify<JwtClaims>(token);
      (req as any).user = claims;

    } catch (err: any) {
      const expired = err?.code === 'FAST_JWT_EXPIRED' || err?.message?.includes('expired');
      return reply.status(401).send({
        success: false,
        error: expired ? 'Session expired — please refresh your token' : 'Invalid token',
        code: expired ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
      });
    }
  };
}

/**
 * Role guard factory.
 * Usage: fastify.get('/admin', { preHandler: [requireRole('admin')] }, handler)
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
 * Require account to be active and KYC approved.
 * Use on routes that need verified users (e.g. placing orders).
 */
export function requireKycApproved() {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    // The JWT payload only has basic claims; service must check its own DB
    // This is a placeholder — each service checks its own kycStatus
    const user = (req as any).user as JwtClaims | undefined;
    if (!user) {
      return reply.status(401).send({ success: false, error: 'Not authenticated' });
    }
  };
}
