/**
 * Auth Service — Redis Service Logic Unit Tests
 * Tests the pure logic functions that don't need a live Redis connection
 */
import { describe, it, expect } from 'vitest';
import { isOtpLocked } from '../../src/services/redis.service.js';

describe('Redis Service — Pure Logic 🔒', () => {

  describe('isOtpLocked()', () => {
    it('should return false when attempts is 0', () => {
      expect(isOtpLocked(0)).toBe(false);
    });

    it('should return false when attempts is 4 (below threshold)', () => {
      expect(isOtpLocked(4)).toBe(false);
    });

    it('should return true when attempts is exactly 5 (at threshold)', () => {
      expect(isOtpLocked(5)).toBe(true);
    });

    it('should return true when attempts exceeds 5', () => {
      expect(isOtpLocked(6)).toBe(true);
      expect(isOtpLocked(10)).toBe(true);
    });

    it('should return false for negative attempts (edge case)', () => {
      expect(isOtpLocked(-1)).toBe(false);
    });
  });
});
