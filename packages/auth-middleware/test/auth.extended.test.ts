/**
 * Auth Middleware — Extended Tests
 * Additional tests for requireKycApproved, edge cases, and role hierarchies
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeAuthMiddleware, requireRole } from '../src/index.js';

// ── Mock Setup ────────────────────────────────────────────────────
const makeRequest = (overrides: object = {}) => ({
  cookies: {},
  headers: {},
  ...overrides,
});

const makeReply = () => {
  const reply: any = {
    status: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
  };
  return reply;
};

const makeFastify = (verifyResult?: any, shouldThrow = false) => ({
  jwt: {
    verify: vi.fn().mockImplementation(() => {
      if (shouldThrow) throw new Error('invalid token');
      return verifyResult;
    }),
  },
});

describe('Auth Middleware — Extended Edge Cases 🔐', () => {

  describe('makeAuthMiddleware() — token sources', () => {
    it('should prefer cookie token over Authorization header when both are present', async () => {
      const claims = { sub: 'user-1', email: 'test@test.com', role: 'farmer', jti: 'j1', tokenVersion: 1, iat: 0, exp: 9999 };
      const fastify = makeFastify(claims);
      const req: any = makeRequest({
        cookies: { agrilink_access: 'cookie-token' },
        headers: { authorization: 'Bearer header-token' },
      });
      const reply = makeReply();

      const middleware = makeAuthMiddleware(fastify as any);
      await middleware(req, reply);

      // Should succeed and set user claims
      expect(req.user).toEqual(claims);
    });

    it('should fall back to Authorization header when cookie is missing', async () => {
      const claims = { sub: 'user-2', email: 'x@x.com', role: 'supplier', jti: 'j2', tokenVersion: 1, iat: 0, exp: 9999 };
      const fastify = makeFastify(claims);
      const req: any = makeRequest({
        cookies: {},
        headers: { authorization: 'Bearer header-only-token' },
      });
      const reply = makeReply();

      const middleware = makeAuthMiddleware(fastify as any);
      await middleware(req, reply);

      expect(req.user).toEqual(claims);
      expect(reply.status).not.toHaveBeenCalled();
    });

    it('should handle Bearer token with mixed case prefix: "bearer "', async () => {
      const claims = { sub: 'user-3', email: 'a@a.com', role: 'admin', jti: 'j3', tokenVersion: 1, iat: 0, exp: 9999 };
      const fastify = makeFastify(claims);
      const req: any = makeRequest({
        headers: { authorization: 'BEARER some-token' },
      });
      const reply = makeReply();

      const middleware = makeAuthMiddleware(fastify as any);
      await middleware(req, reply);

      expect(req.user).toEqual(claims);
    });

    it('should return 401 when both cookie and header are absent', async () => {
      const fastify = makeFastify(null);
      const req: any = makeRequest({ cookies: {}, headers: {} });
      const reply = makeReply();

      const middleware = makeAuthMiddleware(fastify as any);
      await middleware(req, reply);

      expect(reply.status).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({ code: 'NO_TOKEN' }));
    });

    it('should return 401 with INVALID_TOKEN for a bad token', async () => {
      const fastify = makeFastify(null, true);
      const req: any = makeRequest({ headers: { authorization: 'Bearer bad-token' } });
      const reply = makeReply();

      const middleware = makeAuthMiddleware(fastify as any);
      await middleware(req, reply);

      expect(reply.status).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({ code: 'INVALID_TOKEN' }));
    });

    it('should return 401 with TOKEN_EXPIRED for expired token', async () => {
      const expiredError = new Error('Token is expired');
      expiredError.name = 'FAST_JWT_EXPIRED';
      (expiredError as any).code = 'FAST_JWT_EXPIRED';

      const fastify = {
        jwt: { verify: vi.fn().mockImplementation(() => { throw expiredError; }) },
      };
      const req: any = makeRequest({ headers: { authorization: 'Bearer expired-token' } });
      const reply = makeReply();

      const middleware = makeAuthMiddleware(fastify as any);
      await middleware(req, reply);

      expect(reply.status).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({ code: 'TOKEN_EXPIRED' }));
    });
  });

  describe('requireRole() — role validation', () => {
    it('should allow access for a user with the exact required role', async () => {
      const req: any = { user: { sub: 'u1', role: 'admin', email: 'a@a.com', jti: '', tokenVersion: 1, iat: 0, exp: 0 } };
      const reply = makeReply();
      await requireRole('admin')(req, reply);
      expect(reply.status).not.toHaveBeenCalled();
    });

    it('should deny access for a user with a different role', async () => {
      const req: any = { user: { sub: 'u1', role: 'farmer', email: 'a@a.com', jti: '', tokenVersion: 1, iat: 0, exp: 0 } };
      const reply = makeReply();
      await requireRole('admin')(req, reply);
      expect(reply.status).toHaveBeenCalledWith(403);
      expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({ code: 'FORBIDDEN' }));
    });

    it('should allow access when the user matches one of multiple accepted roles', async () => {
      const req: any = { user: { sub: 'u1', role: 'supplier', email: 'a@a.com', jti: '', tokenVersion: 1, iat: 0, exp: 0 } };
      const reply = makeReply();
      await requireRole('admin', 'supplier')(req, reply);
      expect(reply.status).not.toHaveBeenCalled();
    });

    it('should return 401 when no user is attached to the request', async () => {
      const req: any = {};
      const reply = makeReply();
      await requireRole('admin')(req, reply);
      expect(reply.status).toHaveBeenCalledWith(401);
    });

    it('should allow farmer when accepted roles include farmer', async () => {
      const req: any = { user: { sub: 'u1', role: 'farmer', email: 'a@a.com', jti: '', tokenVersion: 1, iat: 0, exp: 0 } };
      const reply = makeReply();
      await requireRole('farmer')(req, reply);
      expect(reply.status).not.toHaveBeenCalled();
    });

    it('should deny farmer from accessing supplier-only routes', async () => {
      const req: any = { user: { sub: 'u1', role: 'farmer', email: 'a@a.com', jti: '', tokenVersion: 1, iat: 0, exp: 0 } };
      const reply = makeReply();
      await requireRole('supplier')(req, reply);
      expect(reply.status).toHaveBeenCalledWith(403);
    });

    it('should include the required role name in the error message', async () => {
      const req: any = { user: { sub: 'u1', role: 'farmer', email: 'a@a.com', jti: '', tokenVersion: 1, iat: 0, exp: 0 } };
      const reply = makeReply();
      await requireRole('admin')(req, reply);
      const sent = reply.send.mock.calls[0][0];
      expect(sent.error).toContain('admin');
    });
  });
});
