/**
 * Redis Token Blacklist + Rate-Limit Helpers
 * Used for:
 *  - Refresh token revocation (logout from all devices)
 *  - OTP attempt counting (brute-force prevention)
 *  - Password reset token storage (short-lived, single-use)
 */
import { Redis } from 'ioredis';
import { authStateKeys, AUTH_STATE_TTL_SECONDS } from '@agrilink/auth-middleware';

let redis: Redis | null = null;

export function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      lazyConnect: true,
      enableReadyCheck: true,
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => (times > 5 ? null : Math.min(times * 200, 2000)),
    });
    redis.on('error', (err: any) => {
      console.warn('[redis] Connection error (non-fatal):', err.message);
    });
  }
  return redis;
}

// ── Token Blacklist ───────────────────────────────────────────

/**
 * Blacklist a refresh token (e.g. on logout or password change).
 * TTL matches the token's remaining expiry.
 */
export async function blacklistToken(jti: string, ttlSeconds: number): Promise<void> {
  try {
    await getRedis().setex(`bl:${jti}`, ttlSeconds, '1');
  } catch { /* Non-fatal */ }
}

export async function isTokenBlacklisted(jti: string): Promise<boolean> {
  try {
    const val = await getRedis().get(`bl:${jti}`);
    return val === '1';
  } catch {
    return false; // Fail open if Redis is down
  }
}

// ── Password Reset Tokens ─────────────────────────────────────

const RESET_TOKEN_TTL = 15 * 60; // 15 minutes

export async function storePasswordResetToken(userId: string, token: string): Promise<void> {
  // Only one valid reset token at a time per user
  await getRedis().setex(`rst:${userId}`, RESET_TOKEN_TTL, token);
}

export async function getPasswordResetToken(userId: string): Promise<string | null> {
  try {
    return await getRedis().get(`rst:${userId}`);
  } catch {
    return null;
  }
}

export async function deletePasswordResetToken(userId: string): Promise<void> {
  try {
    await getRedis().del(`rst:${userId}`);
  } catch { /* Non-fatal */ }
}

// ── OTP Attempt Counter (Brute-Force Prevention) ──────────────

const MAX_OTP_ATTEMPTS = 5;
const OTP_LOCKOUT_TTL = 30 * 60; // 30 minutes

export async function incrementOtpAttempts(userId: string): Promise<number> {
  try {
    const key = `otp_attempts:${userId}`;
    const count = await getRedis().incr(key);
    if (count === 1) {
      // Set expiry only on first attempt
      await getRedis().expire(key, OTP_LOCKOUT_TTL);
    }
    return count;
  } catch {
    return 0; // Fail open
  }
}

export async function getOtpAttempts(userId: string): Promise<number> {
  try {
    const val = await getRedis().get(`otp_attempts:${userId}`);
    return val ? parseInt(val) : 0;
  } catch {
    return 0;
  }
}

export async function clearOtpAttempts(userId: string): Promise<void> {
  try {
    await getRedis().del(`otp_attempts:${userId}`);
  } catch { /* Non-fatal */ }
}

export function isOtpLocked(attempts: number): boolean {
  return attempts >= MAX_OTP_ATTEMPTS;
}

// ── Login Attempt Counter ─────────────────────────────────────
// Two counters:
//  - per (email, IP): strict — 10 failures locks that IP out of that account
//  - per email:       loose  — 50 failures from many IPs locks the account
// Keying only by email let anyone lock any farmer out by guessing wrong 10x.

const MAX_LOGIN_ATTEMPTS = 10;
const MAX_LOGIN_ATTEMPTS_GLOBAL = 50;
const LOGIN_LOCKOUT_TTL = 15 * 60; // 15 minutes

const loginKey = (email: string, ip: string) => `login_attempts:${email.toLowerCase()}:${ip}`;
const loginKeyGlobal = (email: string) => `login_attempts:${email.toLowerCase()}`;

export async function incrementLoginAttempts(email: string, ip = 'unknown'): Promise<number> {
  try {
    const r = getRedis();
    const [[, local], [, global]] = (await r
      .multi()
      .incr(loginKey(email, ip))
      .incr(loginKeyGlobal(email))
      .exec()) as [unknown, number][];
    if (local === 1) await r.expire(loginKey(email, ip), LOGIN_LOCKOUT_TTL);
    if (global === 1) await r.expire(loginKeyGlobal(email), LOGIN_LOCKOUT_TTL);
    return Number(local);
  } catch {
    return 0;
  }
}

export async function clearLoginAttempts(email: string, ip = 'unknown'): Promise<void> {
  try {
    await getRedis().del(loginKey(email, ip), loginKeyGlobal(email));
  } catch { /* Non-fatal */ }
}

export async function isLoginLocked(email: string, ip = 'unknown'): Promise<boolean> {
  try {
    const [local, global] = await getRedis().mget(loginKey(email, ip), loginKeyGlobal(email));
    return (local ? parseInt(local) >= MAX_LOGIN_ATTEMPTS : false)
      || (global ? parseInt(global) >= MAX_LOGIN_ATTEMPTS_GLOBAL : false);
  } catch {
    return false;
  }
}

// ── Cross-service auth state (revocation) ─────────────────────

/**
 * Mirror a user's tokenVersion + active flag into Redis so every service's
 * auth middleware can reject revoked or suspended sessions immediately.
 */
export async function syncAuthState(userId: string, tokenVersion: number, isActive: boolean): Promise<void> {
  try {
    const r = getRedis();
    const pipe = r.pipeline().setex(authStateKeys.tokenVersion(userId), AUTH_STATE_TTL_SECONDS, String(tokenVersion));
    if (isActive) pipe.del(authStateKeys.suspended(userId));
    else pipe.setex(authStateKeys.suspended(userId), AUTH_STATE_TTL_SECONDS, '1');
    await pipe.exec();
  } catch { /* Non-fatal: tokens are short-lived */ }
}

// ── Session Store (Active sessions per user) ──────────────────

export async function trackSession(userId: string, sessionId: string, ttlSeconds: number): Promise<void> {
  try {
    await getRedis().setex(`session:${userId}:${sessionId}`, ttlSeconds, new Date().toISOString());
    // Track sessionId in user's session set
    await getRedis().sadd(`sessions:${userId}`, sessionId);
  } catch { /* Non-fatal */ }
}

export async function revokeAllSessions(userId: string): Promise<void> {
  try {
    const sessionIds = await getRedis().smembers(`sessions:${userId}`);
    if (sessionIds.length > 0) {
      const pipeline = getRedis().pipeline();
      for (const sid of sessionIds) {
        pipeline.del(`session:${userId}:${sid}`);
      }
      pipeline.del(`sessions:${userId}`);
      await pipeline.exec();
    }
  } catch { /* Non-fatal */ }
}
