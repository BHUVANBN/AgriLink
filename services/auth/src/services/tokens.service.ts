/**
 * Token issuance — single place that decides token lifetimes and cookie flags.
 *
 * Access token:  short-lived (default 15m), sent on every request (path=/)
 * Refresh token: long-lived (default 7d), only sent to /auth/* so logout can
 *                read it even after the access token has expired.
 */
import type { FastifyInstance, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { syncAuthState, trackSession } from './redis.service.js';

export const REFRESH_COOKIE_PATH = '/auth';

/** Parse '15m' | '1h' | '7d' | '900' into seconds. */
export function durationToSeconds(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const m = /^(\d+)\s*([smhd]?)$/.exec(value.trim());
  if (!m) return fallback;
  const n = Number(m[1]);
  const mult = { '': 1, s: 1, m: 60, h: 3600, d: 86400 }[m[2] as '' | 's' | 'm' | 'h' | 'd'];
  return n * mult;
}

export const accessTtl = () => durationToSeconds(process.env.JWT_ACCESS_EXPIRES_IN, 15 * 60);
export const refreshTtl = () => durationToSeconds(process.env.JWT_REFRESH_EXPIRES_IN, 7 * 86400);

export function cookieOpts() {
  const domain = process.env.COOKIE_DOMAIN || undefined; // e.g. ".agrilink.example" when web + api share a parent domain
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    domain,
  };
}

export interface TokenUser {
  id: string;
  email: string;
  role: string;
  tokenVersion: number;
  isActive?: boolean;
  fullName?: string | null;
  companyName?: string | null;
}

export async function issueSession(fastify: FastifyInstance, reply: FastifyReply, user: TokenUser) {
  const sessionId = randomUUID();
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    jti: sessionId,
    tokenVersion: user.tokenVersion,
    // Display name, so services can label lazily-created profiles correctly
    name: user.fullName ?? user.companyName ?? undefined,
  };

  const accessToken = fastify.jwt.sign(payload, { expiresIn: accessTtl() });
  const refreshToken = jwt.sign(
    { ...payload, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: refreshTtl() },
  );

  await trackSession(user.id, sessionId, refreshTtl());
  await syncAuthState(user.id, user.tokenVersion, user.isActive ?? true);

  const base = cookieOpts();
  reply.setCookie('agrilink_access', accessToken, { ...base, path: '/', maxAge: accessTtl() });
  reply.setCookie('agrilink_refresh', refreshToken, { ...base, path: REFRESH_COOKIE_PATH, maxAge: refreshTtl() });

  return { accessToken, refreshToken };
}

export function clearSessionCookies(reply: FastifyReply) {
  const { domain } = cookieOpts();
  reply.clearCookie('agrilink_access', { path: '/', domain });
  reply.clearCookie('agrilink_refresh', { path: REFRESH_COOKIE_PATH, domain });
  // Legacy cookie path used by older builds
  reply.clearCookie('agrilink_refresh', { path: '/auth/refresh', domain });
}
