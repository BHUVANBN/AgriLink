import { describe, it, expect, vi, beforeEach } from 'vitest';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../../prisma/client/index.js';

// Mock Prisma
vi.mock('../../prisma/client/index.js', () => ({
  PrismaClient: class {
    user = {
      findUnique: vi.fn(),
      create: vi.fn(),
    }
    otp = {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    }
  }
}));

describe('Auth Logic Units', () => {
  let prisma: any;

  beforeEach(() => {
    prisma = new PrismaClient();
  });

  describe('Password Hashing', () => {
    it('should correctly hash and compare passwords', async () => {
      const password = 'my-secret-password';
      const salt = await bcrypt.genSalt(12);
      const hash = await bcrypt.hash(password, salt);

      expect(hash).not.toBe(password);
      expect(await bcrypt.compare(password, hash)).toBe(true);
      expect(await bcrypt.compare('wrong-password', hash)).toBe(false);
    });
  });

  describe('OTP Logic (Mocked)', () => {
    it('should generate a 6-digit OTP', () => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });
  });
});
