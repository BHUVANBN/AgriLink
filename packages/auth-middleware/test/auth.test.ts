import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeAuthMiddleware, requireRole } from '../src/index.js';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

describe('Auth Middleware', () => {
  let mockFastify: any;
  let mockRequest: any;
  let mockReply: any;

  beforeEach(() => {
    mockFastify = {
      jwt: {
        verify: vi.fn(),
      },
    };
    mockRequest = {
      headers: {},
      cookies: {},
    };
    mockReply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
  });

  describe('makeAuthMiddleware', () => {
    it('should reject if no token is present', async () => {
      const authenticate = makeAuthMiddleware(mockFastify as any);
      await authenticate(mockRequest as any, mockReply as any);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({ code: 'NO_TOKEN' }));
    });

    it('should verify token from cookie', async () => {
      const token = 'fake-token';
      const claims = { sub: '123', role: 'farmer' };
      mockRequest.cookies.agrilink_access = token;
      mockFastify.jwt.verify.mockReturnValue(claims);

      const authenticate = makeAuthMiddleware(mockFastify as any);
      await authenticate(mockRequest as any, mockReply as any);

      expect(mockFastify.jwt.verify).toHaveBeenCalledWith(token);
      expect(mockRequest.user).toEqual(claims);
    });

    it('should verify token from authorization header', async () => {
      const token = 'bearer-token';
      const claims = { sub: '456', role: 'supplier' };
      mockRequest.headers.authorization = `Bearer ${token}`;
      mockFastify.jwt.verify.mockReturnValue(claims);

      const authenticate = makeAuthMiddleware(mockFastify as any);
      await authenticate(mockRequest as any, mockReply as any);

      expect(mockFastify.jwt.verify).toHaveBeenCalledWith(token);
      expect(mockRequest.user).toEqual(claims);
    });

    it('should return 401 with TOKEN_EXPIRED if token is expired', async () => {
      mockRequest.cookies.agrilink_access = 'expired-token';
      mockFastify.jwt.verify.mockImplementation(() => {
        const err = new Error('Token expired') as any;
        err.code = 'FAST_JWT_EXPIRED';
        throw err;
      });

      const authenticate = makeAuthMiddleware(mockFastify as any);
      await authenticate(mockRequest as any, mockReply as any);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith(expect.objectContaining({ code: 'TOKEN_EXPIRED' }));
    });
  });

  describe('requireRole', () => {
    it('should reject if no user is on request', async () => {
      const guard = requireRole('admin');
      await guard(mockRequest as any, mockReply as any);

      expect(mockReply.status).toHaveBeenCalledWith(401);
    });

    it('should reject if user has wrong role', async () => {
      mockRequest.user = { role: 'farmer' };
      const guard = requireRole('admin');
      await guard(mockRequest as any, mockReply as any);

      expect(mockReply.status).toHaveBeenCalledWith(403);
    });

    it('should allow if user has correct role', async () => {
      mockRequest.user = { role: 'admin' };
      const guard = requireRole('admin');
      await guard(mockRequest as any, mockReply as any);

      expect(mockReply.status).not.toHaveBeenCalled();
    });

    it('should allow if user has one of multiple allowed roles', async () => {
        mockRequest.user = { role: 'supplier' };
        const guard = requireRole('admin', 'supplier');
        await guard(mockRequest as any, mockReply as any);
  
        expect(mockReply.status).not.toHaveBeenCalled();
      });
  });
});
