/**
 * Supplier Service — Helper Utilities Unit Tests
 * Tests: slugify, generateSku, applyDiscount, getStockStatus, isValidGstNumber, formatPaiseToRupees, rupeesToPaise
 */
import { describe, it, expect } from 'vitest';
import {
  slugify,
  applyDiscount,
  getStockStatus,
  isValidGstNumber,
  formatPaiseToRupees,
  rupeesToPaise,
} from '../../src/utils/helpers.js';

describe('Supplier Service — Helper Utilities 🏪', () => {

  describe('slugify()', () => {
    it('should convert a plain name to a valid slug', () => {
      expect(slugify('Organic Fertilizer')).toBe('organic-fertilizer');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('NPK  Fertilizer   25kg')).toBe('npk-fertilizer-25kg');
    });

    it('should remove special characters', () => {
      expect(slugify('Bio-Pesticide (50ml)!')).toBe('bio-pesticide-50ml');
    });

    it('should convert uppercase to lowercase', () => {
      expect(slugify('ORGANIC COMPOST')).toBe('organic-compost');
    });

    it('should trim leading and trailing spaces', () => {
      expect(slugify('  Urea Fertilizer  ')).toBe('urea-fertilizer');
    });

    it('should truncate slug to 100 characters', () => {
      const longName = 'A Very Long Product Name '.repeat(10);
      expect(slugify(longName).length).toBeLessThanOrEqual(100);
    });

    it('should handle names with numbers', () => {
      expect(slugify('NPK 10-26-26 Fertilizer 50kg')).toBe('npk-10-26-26-fertilizer-50kg');
    });

    it('should handle single word', () => {
      expect(slugify('Compost')).toBe('compost');
    });

    it('should handle empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('should collapse duplicate hyphens', () => {
      expect(slugify('A--B')).toBe('a-b');
    });
  });

  describe('applyDiscount()', () => {
    it('should apply 10% discount correctly', () => {
      expect(applyDiscount(10000, 10)).toBe(9000);
    });

    it('should apply 0% discount (no change)', () => {
      expect(applyDiscount(5000, 0)).toBe(5000);
    });

    it('should apply 100% discount (free)', () => {
      expect(applyDiscount(5000, 100)).toBe(0);
    });

    it('should apply 50% discount', () => {
      expect(applyDiscount(20000, 50)).toBe(10000);
    });

    it('should round down fractional paise', () => {
      expect(applyDiscount(999, 10)).toBe(899); // 999 * 0.9 = 899.1 -> floor to 899
    });

    it('should throw for negative discount', () => {
      expect(() => applyDiscount(10000, -1)).toThrow('Discount must be 0–100%');
    });

    it('should throw for discount over 100%', () => {
      expect(() => applyDiscount(10000, 101)).toThrow('Discount must be 0–100%');
    });
  });

  describe('getStockStatus()', () => {
    it('should return out_of_stock when quantity is 0', () => {
      expect(getStockStatus(0, 5)).toBe('out_of_stock');
    });

    it('should return low_stock when quantity equals reorder threshold', () => {
      expect(getStockStatus(5, 5)).toBe('low_stock');
    });

    it('should return low_stock when quantity is below threshold', () => {
      expect(getStockStatus(2, 5)).toBe('low_stock');
    });

    it('should return in_stock when quantity exceeds threshold', () => {
      expect(getStockStatus(10, 5)).toBe('in_stock');
    });

    it('should return in_stock for high stock', () => {
      expect(getStockStatus(1000, 10)).toBe('in_stock');
    });

    it('should return out_of_stock for quantity 0 regardless of threshold', () => {
      expect(getStockStatus(0, 0)).toBe('out_of_stock');
    });
  });

  describe('isValidGstNumber()', () => {
    it('should accept a valid GST number', () => {
      expect(isValidGstNumber('29ABCDE1234F1Z5')).toBe(true);
    });

    it('should reject a GST number with wrong length', () => {
      expect(isValidGstNumber('29ABCDE1234F1Z')).toBe(false);
    });

    it('should reject a GST number with lowercase letters', () => {
      expect(isValidGstNumber('29abcde1234f1z5')).toBe(false);
    });

    it('should reject an empty string', () => {
      expect(isValidGstNumber('')).toBe(false);
    });

    it('should reject a random string', () => {
      expect(isValidGstNumber('INVALID-GST')).toBe(false);
    });
  });

  describe('formatPaiseToRupees()', () => {
    it('should convert paise to rupees with 2 decimal places', () => {
      expect(formatPaiseToRupees(10000)).toBe('₹100.00');
    });

    it('should handle zero paise', () => {
      expect(formatPaiseToRupees(0)).toBe('₹0.00');
    });

    it('should handle fractional paise correctly', () => {
      expect(formatPaiseToRupees(150)).toBe('₹1.50');
    });

    it('should include the ₹ symbol', () => {
      expect(formatPaiseToRupees(5000).startsWith('₹')).toBe(true);
    });

    it('should handle large amounts', () => {
      expect(formatPaiseToRupees(1000000)).toBe('₹10000.00');
    });
  });

  describe('rupeesToPaise()', () => {
    it('should convert rupees to paise correctly', () => {
      expect(rupeesToPaise(100)).toBe(10000);
    });

    it('should handle fractional rupees', () => {
      expect(rupeesToPaise(1.5)).toBe(150);
    });

    it('should handle zero', () => {
      expect(rupeesToPaise(0)).toBe(0);
    });

    it('should roundtrip correctly', () => {
      const paise = 9999;
      expect(rupeesToPaise(paise / 100)).toBe(paise);
    });

    it('should round correctly for floating point imprecision', () => {
      // 0.1 + 0.2 = 0.30000000004 in JS
      expect(rupeesToPaise(0.30)).toBe(30);
    });
  });
});
