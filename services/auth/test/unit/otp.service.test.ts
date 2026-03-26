/**
 * Auth Service — OTP Service Unit Tests
 * Tests: generateOtp, hashOtp, verifyOtp, getOtpExpiry, getResendAllowedAt
 */
import { describe, it, expect } from 'vitest';
import { generateOtp, hashOtp, verifyOtp, getOtpExpiry, getResendAllowedAt } from '../../src/services/otp.service.js';

describe('OTP Service 🔐', () => {
  describe('generateOtp()', () => {
    it('should return a 6-digit string', () => {
      const otp = generateOtp();
      expect(otp).toHaveLength(6);
    });

    it('should only contain numeric digits', () => {
      for (let i = 0; i < 20; i++) {
        const otp = generateOtp();
        expect(otp).toMatch(/^\d{6}$/);
      }
    });

    it('should be in range 100000–999999', () => {
      for (let i = 0; i < 20; i++) {
        const otp = parseInt(generateOtp(), 10);
        expect(otp).toBeGreaterThanOrEqual(100000);
        expect(otp).toBeLessThanOrEqual(999999);
      }
    });

    it('should produce different OTPs on each call (statistical randomness)', () => {
      const otps = new Set(Array.from({ length: 20 }, () => generateOtp()));
      // With 20 random draws from 900000 options, collision is astronomically unlikely
      expect(otps.size).toBeGreaterThan(15);
    });
  });

  describe('hashOtp() / verifyOtp()', () => {
    it('should hash an OTP and verify it correctly', async () => {
      const otp = '456789';
      const hash = await hashOtp(otp);
      expect(hash).not.toBe(otp);
      expect(hash.startsWith('$2')).toBe(true); // bcrypt prefix
      const valid = await verifyOtp(otp, hash);
      expect(valid).toBe(true);
    });

    it('should reject an incorrect OTP against the hash', async () => {
      const hash = await hashOtp('123456');
      const valid = await verifyOtp('654321', hash);
      expect(valid).toBe(false);
    });

    it('should produce different hashes for the same OTP (bcrypt salting)', async () => {
      const hash1 = await hashOtp('111111');
      const hash2 = await hashOtp('111111');
      expect(hash1).not.toBe(hash2);
    });

    it('should verify a freshly generated OTP', async () => {
      const otp = generateOtp();
      const hash = await hashOtp(otp);
      const result = await verifyOtp(otp, hash);
      expect(result).toBe(true);
    });
  });

  describe('getOtpExpiry()', () => {
    it('should return a Date approximately 10 minutes in the future', () => {
      const now = Date.now();
      const expiry = getOtpExpiry();
      const diffMs = expiry.getTime() - now;
      // Between 9.9 and 10.1 minutes
      expect(diffMs).toBeGreaterThan(9.9 * 60 * 1000);
      expect(diffMs).toBeLessThan(10.1 * 60 * 1000);
    });

    it('should return a Date instance', () => {
      expect(getOtpExpiry()).toBeInstanceOf(Date);
    });
  });

  describe('getResendAllowedAt()', () => {
    it('should return a Date about 60 seconds in the future', () => {
      const now = Date.now();
      const resendAt = getResendAllowedAt();
      const diffMs = resendAt.getTime() - now;
      expect(diffMs).toBeGreaterThan(59 * 1000);
      expect(diffMs).toBeLessThan(61 * 1000);
    });

    it('should return a Date instance', () => {
      expect(getResendAllowedAt()).toBeInstanceOf(Date);
    });
  });
});
