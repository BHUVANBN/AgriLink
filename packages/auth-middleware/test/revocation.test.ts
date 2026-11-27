import { describe, it, expect, vi, beforeEach } from 'vitest';
import { makeAuthMiddleware, requireInternalKey, authStateKeys } from '../src/index.js';

function mocks(claims: any) {
  const fastify: any = { jwt: { verify: vi.fn().mockReturnValue(claims) } };
  const req: any = { headers: {}, cookies: { agrilink_access: 'tok' } };
  const reply: any = { status: vi.fn().mockReturnThis(), send: vi.fn().mockReturnThis() };
  return { fastify, req, reply };
}

describe('Auth middleware — revocation via Redis', () => {
  let redis: any;
  beforeEach(() => {
    redis = { mget: vi.fn() };
  });

  it('accepts a token whose tokenVersion matches Redis', async () => {
    const { fastify, req, reply } = mocks({ sub: 'u1', role: 'farmer', tokenVersion: 3 });
    redis.mget.mockResolvedValue(['3', null]);
    await makeAuthMiddleware(fastify, { redis })(req, reply);
    expect(redis.mget).toHaveBeenCalledWith(authStateKeys.tokenVersion('u1'), authStateKeys.suspended('u1'));
    expect(reply.status).not.toHaveBeenCalled();
    expect(req.user.sub).toBe('u1');
  });

  it('rejects a token issued before logout (stale tokenVersion)', async () => {
    const { fastify, req, reply } = mocks({ sub: 'u1', role: 'farmer', tokenVersion: 2 });
    redis.mget.mockResolvedValue(['3', null]);
    await makeAuthMiddleware(fastify, { redis })(req, reply);
    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({ code: 'TOKEN_REVOKED' }));
    expect(req.user).toBeUndefined();
  });

  it('rejects suspended users with 403', async () => {
    const { fastify, req, reply } = mocks({ sub: 'u1', role: 'farmer', tokenVersion: 3 });
    redis.mget.mockResolvedValue(['3', '1']);
    await makeAuthMiddleware(fastify, { redis })(req, reply);
    expect(reply.status).toHaveBeenCalledWith(403);
  });

  it('fails open when Redis is unavailable', async () => {
    const { fastify, req, reply } = mocks({ sub: 'u1', role: 'farmer', tokenVersion: 3 });
    redis.mget.mockRejectedValue(new Error('ECONNREFUSED'));
    await makeAuthMiddleware(fastify, { redis })(req, reply);
    expect(reply.status).not.toHaveBeenCalled();
    expect(req.user.sub).toBe('u1');
  });

  it('rejects refresh tokens presented as access tokens', async () => {
    const { fastify, req, reply } = mocks({ sub: 'u1', role: 'farmer', type: 'refresh' });
    await makeAuthMiddleware(fastify)(req, reply);
    expect(reply.status).toHaveBeenCalledWith(401);
  });
});

describe('requireInternalKey', () => {
  it('allows the correct key and rejects others', async () => {
    const guard = requireInternalKey('secret-key');
    const reply: any = { status: vi.fn().mockReturnThis(), send: vi.fn().mockReturnThis() };

    await guard({ headers: { 'x-internal-key': 'secret-key' } } as any, reply);
    expect(reply.status).not.toHaveBeenCalled();

    await guard({ headers: { 'x-internal-key': 'wrong' } } as any, reply);
    expect(reply.status).toHaveBeenCalledWith(403);
  });

  it('rejects everything when no key is configured', async () => {
    const guard = requireInternalKey('');
    const reply: any = { status: vi.fn().mockReturnThis(), send: vi.fn().mockReturnThis() };
    await guard({ headers: { 'x-internal-key': '' } } as any, reply);
    expect(reply.status).toHaveBeenCalledWith(403);
  });
});
