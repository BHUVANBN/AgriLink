import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User.js';
import {
  incrementLoginAttempts,
  clearLoginAttempts,
  isLoginLocked,
} from '../services/redis.service.js';
import { publishEvent } from '../services/kafka.producer.js';
import { issueSession } from '../services/tokens.service.js';

// ── Schemas ───────────────────────────────────────────────────

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

// Used to equalise timing when the email doesn't exist
const DUMMY_HASH = bcrypt.hashSync('agrilink-timing-equaliser', 12);

// ── Routes ────────────────────────────────────────────────────

export async function loginRoutes(fastify: FastifyInstance) {

  // ── POST /auth/login ────────────────────────────────────────
  fastify.post(
    '/login',
    {
      config: {
        rateLimit: { max: 30, timeWindow: '15m', keyGenerator: (req) => req.ip },
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

      const email = result.data.email.toLowerCase().trim();
      const { password } = result.data;

      // ─ Redis-backed account lockout ─────────────────────────
      // BUG-034 fix: track per-email, not just per-IP
      const locked = await isLoginLocked(email, req.ip);
      if (locked) {
        return reply.status(429).send({
          success: false,
          error: 'Too many failed login attempts. Account locked for 15 minutes.',
          code: 'ACCOUNT_LOCKED',
        });
      }

      // ─ Lookup user ──────────────────────────────────────────
      const user = await User.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } }) as any;

      // Constant-time response — don't leak that email doesn't exist
      if (!user) {
        // Burn comparable CPU time so response timing doesn't reveal unknown emails
        await bcrypt.compare(password, DUMMY_HASH);
        await incrementLoginAttempts(email, req.ip);
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
          error: 'Your account has been suspended. Please contact support.',
          code: 'ACCOUNT_SUSPENDED',
        });
      }

      // ─ Password verification ────────────────────────────────
      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordValid) {
        const attempts = await incrementLoginAttempts(email, req.ip);
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
      await clearLoginAttempts(email, req.ip);

      // ─ Issue tokens + cookies ───────────────────────────────
      const { accessToken } = await issueSession(fastify, reply, user);

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

  // ── POST /auth/verify-password ──────────────────────────────
  // Used for re-authentication before sensitive operations (e.g., signing blockchain agreements)
  fastify.post(
    '/verify-password',
    {
      preHandler: [(fastify as any).authenticate],
      config: {
        rateLimit: { max: 10, timeWindow: '1m', keyGenerator: (req) => req.ip },
      },
    },
    async (req: any, reply: FastifyReply) => {
      const { password } = req.body as { password?: string };
      if (!password) {
        return reply.status(400).send({ success: false, error: 'Password is required' });
      }

      const user = await User.findUnique({ where: { id: req.user.sub } }) as any;
      if (!user) {
        return reply.status(404).send({ success: false, error: 'User not found' });
      }

      const passwordValid = await bcrypt.compare(password, user.passwordHash);
      if (!passwordValid) {
        return reply.status(401).send({
          success: false,
          error: 'Incorrect password',
          code: 'INVALID_PASSWORD',
        });
      }

      return reply.send({ success: true, message: 'Password verified' });
    }
  );
}
