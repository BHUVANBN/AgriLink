import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { z } from 'zod';
import { User } from '../models/User.js';
import { sendEmail } from '../services/email.service.js';
import { sendOtpSms } from '../services/sms.service.js';
import {
  storePasswordResetToken,
  getPasswordResetToken,
  deletePasswordResetToken,
  getRedis,
} from '../services/redis.service.js';
import { publishEvent } from '../services/kafka.producer.js';

// ── Schemas ───────────────────────────────────────────────────

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

const ResetPasswordSchema = z.object({
  email: z.string().email(),
  token: z.string().min(32, 'Invalid reset token'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number'),
});

const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
});

// ── Routes ────────────────────────────────────────────────────

export async function passwordRoutes(fastify: FastifyInstance) {

  // ── POST /auth/forgot-password ──────────────────────────────
  // Generates a time-limited token (not OTP) sent via email + SMS
  fastify.post(
    '/forgot-password',
    { config: { rateLimit: { max: 3, timeWindow: '15m' } } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const result = ForgotPasswordSchema.safeParse(req.body);
      if (!result.success) {
        return reply.status(400).send({ success: false, error: 'Valid email required' });
      }

      const { email } = result.data;

      // Always return 200 — don't leak whether email exists
      const user = await User.findUnique({ where: { email } });
      if (!user) {
        return reply.send({
          success: true,
          data: { message: 'If that email exists, a reset link has been sent.' },
        });
      }

      // Generate a cryptographically secure 64-char token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Store hashed token in Redis (15 min TTL)
      await storePasswordResetToken(user.id, hashedToken);

      const resetLink = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

      const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f7f0;font-family:Inter,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f0;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <tr>
        <td style="background:linear-gradient(135deg,#15803d,#166534);padding:32px 40px;text-align:center;">
          <h1 style="color:#fff;margin:0;font-size:28px;">🌾 AgriLink</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:40px;">
          <h2 style="color:#1f2937;font-size:22px;margin:0 0 16px;">Reset Your Password</h2>
          <p style="color:#4b5563;font-size:16px;line-height:1.6;margin:0 0 24px;">
            We received a request to reset the password for your AgriLink account.
            Click the button below to set a new password.
          </p>
          <div style="text-align:center;margin:0 0 24px;">
            <a href="${resetLink}"
               style="display:inline-block;background:linear-gradient(135deg,#15803d,#059669);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-weight:700;font-size:16px;">
              Reset Password
            </a>
          </div>
          <p style="color:#6b7280;font-size:13px;line-height:1.5;margin:0 0 8px;">
            ⏱ This link expires in <strong>15 minutes</strong>.
          </p>
          <p style="color:#6b7280;font-size:13px;">
            If you didn't request this, you can safely ignore this email.
            Your password will not change.
          </p>
          <div style="background:#f9fafb;border-radius:8px;padding:12px;margin-top:20px;word-break:break-all;">
            <p style="color:#9ca3af;font-size:11px;margin:0;">Or copy this link:</p>
            <p style="color:#374151;font-size:12px;margin:4px 0 0;">${resetLink}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
            © ${new Date().getFullYear()} AgriLink. This is an automated security email.
          </p>
        </td>
      </tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

      // Send email reset link
      await sendEmail(
        email,
        'Reset your AgriLink password',
        html,
        `Reset your AgriLink password: ${resetLink} (expires in 15 minutes)`
      );

      // Also send SMS with short-form notice (no token in SMS — security)
      if (user.phone) {
        await sendOtpSms(
          user.phone,
          'Reset link',
          'Password Reset Request'
        ).catch(() => {}); // Non-fatal
      }

      return reply.send({
        success: true,
        data: { message: 'If that email exists, a reset link has been sent.' },
      });
    }
  );

  // ── POST /auth/reset-password ───────────────────────────────
  fastify.post(
    '/reset-password',
    { config: { rateLimit: { max: 5, timeWindow: '15m' } } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const result = ResetPasswordSchema.safeParse(req.body);
      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        });
      }

      const { email, token, newPassword } = result.data;

      const user = await User.findUnique({ where: { email } });
      if (!user) {
        return reply.status(400).send({ success: false, error: 'Invalid or expired reset token' });
      }

      // Hash the received token and compare with stored hash
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const storedHash = await getPasswordResetToken(user.id);

      if (!storedHash || storedHash !== hashedToken) {
        return reply.status(400).send({ success: false, error: 'Invalid or expired reset token' });
      }

      // Hash and save new password
      const passwordHash = await bcrypt.hash(newPassword, 12);
      await User.update({
        where: { id: user.id },
        data: {
          passwordHash,
          tokenVersion: { increment: 1 }
        }
      });

      // Consume token (single-use)
      await deletePasswordResetToken(user.id);

      // Publish security event
      await publishEvent('notification.send', {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        channels: ['email'] as const,
        subject: 'Your AgriLink password was changed',
        body: `Your password was successfully reset at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST. If you did not do this, contact support immediately.`,
      });

      return reply.send({
        success: true,
        data: { message: 'Password reset successful. Please log in with your new password.' },
      });
    }
  );

  // ── POST /auth/change-password (authenticated) ──────────────
  fastify.post(
    '/change-password',
    { preHandler: [(fastify as any).authenticate] },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const result = ChangePasswordSchema.safeParse(req.body);
      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        });
      }

      const { currentPassword, newPassword } = result.data;
      const userId = (req as any).user.sub;

      const user = await User.findUnique({ where: { id: userId } });
      if (!user) {
        return reply.status(404).send({ success: false, error: 'User not found' });
      }

      const valid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!valid) {
        return reply.status(400).send({ success: false, error: 'Current password is incorrect' });
      }

      if (await bcrypt.compare(newPassword, user.passwordHash)) {
        return reply.status(400).send({
          success: false,
          error: 'New password must be different from current password',
        });
      }

      await User.update({
        where: { id: user.id },
        data: {
          passwordHash: await bcrypt.hash(newPassword, 12),
          tokenVersion: { increment: 1 }
        }
      });

      // Clear cookies
      reply.clearCookie('agrilink_access', { path: '/' });
      reply.clearCookie('agrilink_refresh', { path: '/auth/refresh' });

      // Notify user
      await publishEvent('notification.send', {
        userId: user.id,
        email: user.email,
        phone: user.phone,
        channels: ['email', 'sms'] as const,
        subject: 'AgriLink password changed',
        body: `Your password was changed at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST. If you did not do this, contact support immediately.`,
      });

      return reply.send({
        success: true,
        data: { message: 'Password changed successfully. Please log in again.' },
      });
    }
  );
}
