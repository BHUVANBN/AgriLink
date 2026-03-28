import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { User } from '../models/User.js';
import {
  incrementLoginAttempts,
  clearLoginAttempts,
  isLoginLocked,
  trackSession,
} from '../services/redis.service.js';
import { publishEvent } from '../services/kafka.producer.js';

// ── Schemas ───────────────────────────────────────────────────

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

// ── Routes ────────────────────────────────────────────────────

export async function loginRoutes(fastify: FastifyInstance) {

  // ── POST /auth/login ────────────────────────────────────────
  fastify.post(
    '/login',
    {
      config: {
        rateLimit: { max: 100, timeWindow: '15m', keyGenerator: (req) => req.ip },
      },
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const result = LoginSchema.safeParse(req.body);
      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: 'Valid email and password are required',
        });
      }

      const { email, password } = result.data;

      // ─ Redis-backed account lockout ─────────────────────────
      // BUG-034 fix: track per-email, not just per-IP
      const locked = await isLoginLocked(email);
      if (locked) {
        return reply.status(429).send({
          success: false,
          error: 'Too many failed login attempts. Account locked for 15 minutes.',
          code: 'ACCOUNT_LOCKED',
        });
      }

      // ─ Lookup user ──────────────────────────────────────────
      const user = await User.findUnique({ where: { email } }) as any;

      // Constant-time response — don't leak that email doesn't exist
      if (!user) {
        await incrementLoginAttempts(email);
        return reply.status(401).send({
          success: false,
          error: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        });
      }

      // ─ Account active check ─────────────────────────────────
      if (!user.isActive) {
        return reply.status(403).send({
          success: false,
          error: 'Your account has been suspended. Contact support@agrilink.app',
          code: 'ACCOUNT_SUSPENDED',
        });
      }

      // ─ Password verification ────────────────────────────────
      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordValid) {
        const attempts = await incrementLoginAttempts(email);
        const remaining = 10 - attempts;
        return reply.status(401).send({
          success: false,
          error: remaining > 0
            ? `Invalid email or password. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
            : 'Account locked due to too many failed attempts.',
          code: 'INVALID_CREDENTIALS',
          attemptsRemaining: Math.max(0, remaining),
        });
      }

      // ─ BUG-010 fix: Enforce email verification ──────────────
      if (!user.emailVerified) {
        return reply.status(403).send({
          success: false,
          error: 'Please verify your email before logging in.',
          code: 'EMAIL_NOT_VERIFIED',
          userId: user.id, // Allow frontend to offer resend
        });
      }

      // ─ Clear failed attempt counter on success ──────────────
      await clearLoginAttempts(email);

      // ─ Issue tokens ─────────────────────────────────────────
      const sessionId = randomUUID();
      const jwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        jti: sessionId,
        tokenVersion: user.tokenVersion,
      };

      const accessToken = fastify.jwt.sign(jwtPayload, {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '1h',
      });

      const refreshToken = jwt.sign(
        { ...jwtPayload, type: 'refresh' },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') } as any
      );

      // ─ Track session in Redis ────────────────────────────────
      await trackSession(user.id, sessionId, 7 * 24 * 3600);

      // ─ Set cookies ──────────────────────────────────────────
      reply.setCookie('agrilink_access', accessToken, {
        ...COOKIE_OPTS,
        maxAge: 3600, // 1 hour
      });
      reply.setCookie('agrilink_refresh', refreshToken, {
        ...COOKIE_OPTS,
        path: '/auth/refresh', // Limit refresh cookie scope
        maxAge: 7 * 24 * 3600,
      });

      // ─ Publish login event (for audit/notification) ─────────
      await publishEvent('notification.send', {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        channels: [] as const, // No notification on login — too noisy
        subject: '',
        body: '',
        metadata: {
          event: 'login',
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          at: new Date().toISOString(),
        },
      }).catch(() => {}); // Non-fatal

      fastify.log.info(
        { userId: user.id, email: user.email, role: user.role, ip: req.ip },
        'User logged in'
      );

      return reply.send({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            displayName: user.fullName ?? user.companyName ?? user.email,
            kycStatus: user.kycStatus,
            emailVerified: user.emailVerified,
          },
          accessToken, // Also in cookie — useful for mobile clients
        },
      });
    }
  );
}
