/**
 * Auth Service — Validation Utility Functions
 * Extracted for testability
 */
import { z } from 'zod';

// ── Password Rules ─────────────────────────────────────────────

export const PasswordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[0-9]/, 'Must contain a number');

export const IndianPhoneSchema = z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number');

export const EmailSchema = z.string().email('Invalid email address');

export const OtpSchema = z
  .string()
  .length(6, 'OTP must be exactly 6 digits')
  .regex(/^\d{6}$/, 'OTP must be numeric');

// ── Validator Functions ─────────────────────────────────────────

export function isValidIndianPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

export function isValidPassword(password: string): { valid: boolean; errors: string[] } {
  const result = PasswordSchema.safeParse(password);
  if (result.success) return { valid: true, errors: [] };
  return {
    valid: false,
    errors: result.error.errors.map(e => e.message),
  };
}

export function isValidOtp(otp: string): boolean {
  return /^\d{6}$/.test(otp) && otp.length === 6;
}

export function sanitizeDisplayName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').slice(0, 100);
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return email;
  const masked = local.length > 2 ? local[0] + '*'.repeat(local.length - 2) + local[local.length - 1] : local[0] + '*';
  return `${masked}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length < 4) return phone;
  return phone.slice(0, 2) + '*'.repeat(phone.length - 4) + phone.slice(-2);
}
