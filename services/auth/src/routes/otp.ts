import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User.js';
import { dispatchOtp, generateOtp, hashOtp, getOtpExpiry } from '../services/otp.service.js';
import {
  incrementOtpAttempts,
  getOtpAttempts,
  clearOtpAttempts,
  isOtpLocked,
} from '../services/redis.service.js';
import { publishEvent } from '../services/kafka.producer.js';

// ── Schemas ───────────────────────────────────────────────────

const VerifyOtpSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  otp: z.string().length(6, 'OTP must be exactly 6 digits').regex(/^\d{6}$/, 'OTP must be numeric'),
});

const ResendOtpSchema = z.object({
  userId: z.string().min(1),
});

// ── Routes ────────────────────────────────────────────────────

export async function otpRoutes(fastify: FastifyInstance) {

  // ── POST /auth/verify-otp ───────────────────────────────────
  // BUG-003 fix: compare against bcrypt hash, not plain text
  // BUG-004 fix: check expiry and lockout
  fastify.post(
    '/verify-otp',
    { config: { rateLimit: { max: 10, timeWindow: '15m' } } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const result = VerifyOtpSchema.safeParse(req.body);
      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: result.error.flatten().fieldErrors,
        });
      }

      const { userId, otp } = result.data;

      // ─ Brute-force check ────────────────────────────────────
      const attempts = await getOtpAttempts(userId);
      if (isOtpLocked(attempts)) {
        return reply.status(429).send({
          success: false,
          error: 'Too many OTP attempts. Please request a new OTP after 30 minutes.',
          code: 'OTP_LOCKED',
        });
      }

      // ─ Load user with OTP fields ─────────────────────────────
      const user = await User.findUnique({ where: { id: userId } });
      if (!user) {
        return reply.status(404).send({ success: false, error: 'User not found', code: 'USER_NOT_FOUND' });
      }

      if (user.emailVerified) {
        return reply.status(400).send({
          success: false,
          error: 'Email is already verified. You can log in.',
          code: 'ALREADY_VERIFIED',
        });
      }

      // ─ Expiry check ─────────────────────────────────────────
      if (!user.emailOtpHash || !user.otpExpiresAt) {
        return reply.status(400).send({
          success: false,
          error: 'No pending OTP. Please request a new one.',
          code: 'OTP_NOT_FOUND',
        });
      }

      if (new Date() > user.otpExpiresAt) {
        return reply.status(400).send({
          success: false,
          error: 'OTP has expired. Please request a new one.',
          code: 'OTP_EXPIRED',
        });
      }

      // ─ BUG-003 fix: bcrypt compare ──────────────────────────
      // IMPORTANT: never log `otp` value
      const otpValid = await bcrypt.compare(otp, user.emailOtpHash);
      if (!otpValid) {
        const attemptCount = await incrementOtpAttempts(userId);
        const remaining = 5 - attemptCount;
        return reply.status(400).send({
          success: false,
          error: remaining > 0
            ? `Incorrect OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`
            : 'Too many incorrect attempts. Please request a new OTP.',
          code: 'INVALID_OTP',
          attemptsRemaining: Math.max(0, remaining),
        });
      }

      // ─ Verify user ──────────────────────────────────────────
      await User.update({
        where: { id: user.id },
        data: {
          emailVerified: true,
          emailOtpHash: null,
          otpExpiresAt: null,
        }
      });

      // Clear attempt counter
      await clearOtpAttempts(userId);

      // Publish registration complete event (Welcome email)
      await publishEvent('user.registered', {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        displayName: user.fullName ?? user.companyName ?? user.email,
        timestamp: new Date().toISOString(),
      });

      fastify.log.info({ userId, role: user.role }, 'User email verified');

      return reply.send({
        success: true,
        data: {
          message: 'Email verified successfully! You can now log in.',
          role: user.role,
        },
      });
    }
  );

  // ── POST /auth/resend-otp ───────────────────────────────────
  // BUG-004 fix: rate-limited resend with 60s cooldown
  fastify.post(
    '/resend-otp',
    { config: { rateLimit: { max: 3, timeWindow: '15m' } } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const result = ResendOtpSchema.safeParse(req.body);
      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: 'userId is required',
        });
      }

      const { userId } = result.data;

      const user = await User.findUnique({ where: { id: userId } });
      if (!user) {
        return reply.status(404).send({ success: false, error: 'User not found' });
      }

      if (user.emailVerified) {
        return reply.status(400).send({
          success: false,
          error: 'Email already verified. Please log in.',
          code: 'ALREADY_VERIFIED',
        });
      }

      // ─ 60-second cooldown ─────────────────────────────────
      const now = new Date();
      if (user.otpResendAfter && now < user.otpResendAfter) {
        const secondsLeft = Math.ceil((user.otpResendAfter.getTime() - now.getTime()) / 1000);
        return reply.status(429).send({
          success: false,
          error: `Please wait ${secondsLeft} seconds before requesting a new OTP.`,
          code: 'OTP_RESEND_TOO_SOON',
          retryAfter: secondsLeft,
        });
      }

      // ─ Generate & dispatch new OTP ─────────────────────────
      const otp = generateOtp();
      const emailOtpHash = await hashOtp(otp);
      
      const { emailSent, smsSent } = await dispatchOtp({
        email: user.email,
        phone: user.phone,
        otp,
        purpose: 'Login Verification',
        recipientName: user.fullName || user.companyName || user.email
      });

      // Set next allowed resend time
      await User.update({
        where: { id: user.id },
        data: {
          emailOtpHash,
          otpExpiresAt: getOtpExpiry(),
          otpResendAfter: new Date(now.getTime() + 60_000)
        }
      });

      // Reset brute-force counter (fresh OTP = fresh chances)
      await clearOtpAttempts(userId);

      fastify.log.info({ userId }, 'OTP resent');

      return reply.send({
        success: true,
        data: {
          message: 'New OTP sent',
          emailSent,
          smsSent,
          nextAllowedAt: user.otpResendAfter,
        },
      });
    }
  );
}
