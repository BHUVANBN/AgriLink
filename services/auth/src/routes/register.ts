import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User.js';
import {
  generateOtp,
  hashOtp,
  dispatchOtp,
  getOtpExpiry,
  getResendAllowedAt,
} from '../services/otp.service.js';

// ── Validation Schemas ────────────────────────────────────────

const RegisterFarmerSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ''))
    .refine((v) => /^(?:\+91|91)?[6-9]\d{9}$/.test(v), 'Invalid Indian mobile number'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number'),
});

const RegisterSupplierSchema = z.object({
  companyName: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z
    .string()
    .transform((v) => v.replace(/[\s-]/g, ''))
    .refine((v) => /^(?:\+91|91)?[6-9]\d{9}$/.test(v), 'Invalid Indian mobile number'),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain a number'),
});

// ── Route Handler ─────────────────────────────────────────────

export async function registerRoutes(fastify: FastifyInstance) {
  // ── POST /auth/register/farmer ──────────────────────────────
  fastify.post(
    '/register/farmer',
    { config: { rateLimit: { max: 5, timeWindow: '15m' } } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const result = RegisterFarmerSchema.safeParse(req.body);
      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        });
      }

      const { fullName, email, phone, password } = result.data;

      // Check for existing user
      const existing = await User.findFirst({ where: { email } });
      if (existing && existing.emailVerified) {
        return reply.status(409).send({ 
          success: false, 
          error: 'Email already registered. Please log in.',
          code: 'ALREADY_VERIFIED'
        });
      }

      // Hash password (NEVER store plain text)
      const passwordHash = await bcrypt.hash(password, 12);

      // Generate OTP — then hash it before saving (BUG-003 fix)
      const otp = generateOtp();
      const emailOtpHash = await hashOtp(otp);
      const otpExpiresAt = getOtpExpiry();
      const otpResendAllowedAt = getResendAllowedAt();

      let user;
      if (existing) {
        // Update unverified user (allows correcting typos/re-registering)
        user = await User.update({
          where: { id: existing.id },
          data: {
            fullName,
            phone,
            passwordHash,
            emailOtpHash,
            otpExpiresAt,
            otpResendAfter: otpResendAllowedAt,
          }
        });
      } else {
        user = await User.create({
          data: {
            email,
            passwordHash,
            role: 'farmer',
            fullName,
            phone,
            emailOtpHash,
            otpExpiresAt,
            otpResendAfter: otpResendAllowedAt,
            emailVerified: false,
          }
        });
      }

      // Dispatch OTP via email AND SMS simultaneously (BUG-005 fix)
      const { emailSent, smsSent } = await dispatchOtp({
        email,
        phone,
        otp,
        purpose: 'Farmer Registration',
        recipientName: fullName,
      });

      return reply.status(201).send({
        success: true,
        data: {
          userId: user.id,
          emailSent,
          smsSent,
          message: 'Farmer registered. Please verify your OTP to continue.',
        },
      });
    }
  );

  // ── POST /auth/register/supplier ────────────────────────────
  fastify.post(
    '/register/supplier',
    { config: { rateLimit: { max: 5, timeWindow: '15m' } } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const result = RegisterSupplierSchema.safeParse(req.body);
      if (!result.success) {
        return reply.status(400).send({
          success: false,
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        });
      }

      const { companyName, email, phone, password } = result.data;

      const existing = await User.findFirst({ where: { email } });
      if (existing && existing.emailVerified) {
        return reply.status(409).send({ 
          success: false, 
          error: 'Email already registered. Please log in.',
          code: 'ALREADY_VERIFIED'
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const otp = generateOtp();
      const emailOtpHash = await hashOtp(otp);
      const otpExpiresAt = getOtpExpiry();
      const otpResendAllowedAt = getResendAllowedAt();

      let user;
      if (existing) {
        user = await User.update({
          where: { id: existing.id },
          data: {
            companyName,
            phone,
            passwordHash,
            emailOtpHash,
            otpExpiresAt,
            otpResendAfter: otpResendAllowedAt,
          }
        });
      } else {
        user = await User.create({
          data: {
            email,
            role: 'supplier',
            companyName,
            phone,
            passwordHash,
            emailOtpHash,
            otpExpiresAt,
            otpResendAfter: otpResendAllowedAt,
            emailVerified: false,
            kycStatus: 'not_started',
          }
        });
      }

      const { emailSent, smsSent } = await dispatchOtp({
        email,
        phone,
        otp,
        purpose: 'Supplier Registration',
        recipientName: companyName,
      });

      return reply.status(201).send({
        success: true,
        data: {
          userId: user.id,
          emailSent,
          smsSent,
          message: 'Supplier registered. Verify your OTP to proceed with KYC submission.',
        },
      });
    }
  );
}
