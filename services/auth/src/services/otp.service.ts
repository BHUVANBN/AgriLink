import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendOtpEmail } from './email.service.js';
import { sendOtpSms } from './sms.service.js';

const OTP_EXPIRY_MINUTES = 10;
const OTP_RESEND_COOLDOWN_SECONDS = 60;

// ── Generate & Send OTP ───────────────────────────────────────

export function generateOtp(): string {
  // Cryptographically secure 6-digit OTP
  return String(crypto.randomInt(100000, 999999));
}

export async function hashOtp(otp: string): Promise<string> {
  // BUG-003 fix: OTPs are hashed before storing in DB
  return bcrypt.hash(otp, 10);
}

export async function verifyOtp(plainOtp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainOtp, hash);
}

export function getOtpExpiry(): Date {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

export function getResendAllowedAt(): Date {
  return new Date(Date.now() + OTP_RESEND_COOLDOWN_SECONDS * 1000);
}

// ── Dispatch OTP via Both Channels ────────────────────────────

export async function dispatchOtp(
  params: {
    email: string;
    phone?: string;
    otp: string; // plain - never stored, only passed to delivery services
    purpose: string;
    recipientName: string;
  }
): Promise<{ emailSent: boolean; smsSent: boolean }> {
  const { email, phone, otp, purpose, recipientName } = params;

  // Both channels fire in parallel
  const [emailSent, smsSent] = await Promise.all([
    sendOtpEmail(email, {
      otp,
      purpose,
      recipientName,
      expiresInMinutes: OTP_EXPIRY_MINUTES,
    }),
    phone ? sendOtpSms(phone, otp, purpose) : Promise.resolve(false),
  ]);

  // BUG-036 fix: never log OTP value in any environment
  console.log(
    `[otp-service] OTP dispatched for ${purpose} — email:${emailSent} sms:${smsSent}`
  );

  return { emailSent, smsSent };
}
