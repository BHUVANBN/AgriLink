/**
 * Auth Service — Validation Utilities Unit Tests
 * Tests: isValidIndianPhone, isValidPassword, isValidOtp, maskEmail, maskPhone, sanitizeDisplayName
 */
import { describe, it, expect } from 'vitest';
import {
  isValidIndianPhone,
  isValidPassword,
  isValidOtp,
  sanitizeDisplayName,
  maskEmail,
  maskPhone,
} from '../../src/utils/validation.js';

describe('Validation Utilities ✅', () => {

  describe('isValidIndianPhone()', () => {
    it('should accept valid Indian mobile numbers starting with 6', () => {
      expect(isValidIndianPhone('6789012345')).toBe(true);
    });
    it('should accept numbers starting with 7', () => {
      expect(isValidIndianPhone('7890123456')).toBe(true);
    });
    it('should accept numbers starting with 8', () => {
      expect(isValidIndianPhone('8901234567')).toBe(true);
    });
    it('should accept numbers starting with 9', () => {
      expect(isValidIndianPhone('9012345678')).toBe(true);
    });
    it('should reject numbers starting with 5', () => {
      expect(isValidIndianPhone('5123456789')).toBe(false);
    });
    it('should reject numbers starting with 0', () => {
      expect(isValidIndianPhone('0123456789')).toBe(false);
    });
    it('should reject 11-digit numbers', () => {
      expect(isValidIndianPhone('91234567890')).toBe(false);
    });
    it('should reject 9-digit numbers', () => {
      expect(isValidIndianPhone('912345678')).toBe(false);
    });
    it('should reject numbers with letters', () => {
      expect(isValidIndianPhone('9123abc456')).toBe(false);
    });
    it('should reject empty string', () => {
      expect(isValidIndianPhone('')).toBe(false);
    });
    it('should reject numbers with country code prefix', () => {
      expect(isValidIndianPhone('+919876543210')).toBe(false);
    });
  });

  describe('isValidPassword()', () => {
    it('should accept a strong password with uppercase and number', () => {
      expect(isValidPassword('Agrilink1').valid).toBe(true);
    });
    it('should reject a short password under 8 chars', () => {
      const r = isValidPassword('Ab1');
      expect(r.valid).toBe(false);
      expect(r.errors.some(e => e.includes('8'))).toBe(true);
    });
    it('should reject a password without uppercase', () => {
      const r = isValidPassword('agrilink1');
      expect(r.valid).toBe(false);
      expect(r.errors.some(e => e.includes('uppercase'))).toBe(true);
    });
    it('should reject a password without a number', () => {
      const r = isValidPassword('AgriLink');
      expect(r.valid).toBe(false);
      expect(r.errors.some(e => e.includes('number'))).toBe(true);
    });
    it('should accept complex passwords', () => {
      expect(isValidPassword('MySuper@Secure1Password').valid).toBe(true);
    });
    it('should return empty errors array on success', () => {
      expect(isValidPassword('ValidPass1').errors).toHaveLength(0);
    });
  });

  describe('isValidOtp()', () => {
    it('should accept a 6-digit numeric OTP', () => {
      expect(isValidOtp('123456')).toBe(true);
    });
    it('should reject a 5-digit OTP', () => {
      expect(isValidOtp('12345')).toBe(false);
    });
    it('should reject a 7-digit OTP', () => {
      expect(isValidOtp('1234567')).toBe(false);
    });
    it('should reject an OTP with letters', () => {
      expect(isValidOtp('12345a')).toBe(false);
    });
    it('should reject empty string', () => {
      expect(isValidOtp('')).toBe(false);
    });
    it('should accept OTP with leading zeros', () => {
      expect(isValidOtp('000001')).toBe(true);
    });
  });

  describe('sanitizeDisplayName()', () => {
    it('should trim leading/trailing whitespace', () => {
      expect(sanitizeDisplayName('  Bhuvan BN  ')).toBe('Bhuvan BN');
    });
    it('should collapse multiple spaces to one', () => {
      expect(sanitizeDisplayName('Bhuvan  BN   Kumar')).toBe('Bhuvan BN Kumar');
    });
    it('should truncate names beyond 100 characters', () => {
      const longName = 'A'.repeat(120);
      expect(sanitizeDisplayName(longName)).toHaveLength(100);
    });
    it('should handle already clean names', () => {
      expect(sanitizeDisplayName('Bhuvan BN')).toBe('Bhuvan BN');
    });
  });

  describe('maskEmail()', () => {
    it('should mask the local part of the email', () => {
      expect(maskEmail('bhuvan@agrilink.app')).toBe('b****n@agrilink.app');
    });
    it('should handle short local parts', () => {
      expect(maskEmail('ab@x.com')).toBe('a*@x.com');
    });
    it('should preserve the domain', () => {
      const result = maskEmail('test@example.com');
      expect(result.endsWith('@example.com')).toBe(true);
    });
  });

  describe('maskPhone()', () => {
    it('should mask middle digits of a phone number', () => {
      const masked = maskPhone('9876543210');
      expect(masked.startsWith('98')).toBe(true);
      expect(masked.endsWith('10')).toBe(true);
      expect(masked).toContain('*');
    });
    it('should handle short phone numbers gracefully', () => {
      expect(maskPhone('123')).toBe('123');
    });
  });
});
