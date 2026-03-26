/**
 * Marketplace Service — Order Calculations Extended Tests
 * Covers edge cases, pagination helpers, and cart validation logic
 */
import { describe, it, expect } from 'vitest';
import { calculateOrderTotals } from '../../src/utils/calculations.js';

// ── Additional utility: pagination calculation helper ────────────
function buildPagination(page: number, limit: number, total: number) {
  return {
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    hasNext: page * limit < total,
    hasPrev: page > 1,
  };
}

describe('Marketplace Service — Order & Pagination Logic 🛒', () => {

  describe('calculateOrderTotals() — extended cases', () => {
    it('should handle a single item correctly', () => {
      const totals = calculateOrderTotals([{ totalPaise: 25000 }]);
      expect(totals.subtotalPaise).toBe(25000);
      expect(totals.taxPaise).toBe(1250); // 5%
      expect(totals.shippingPaise).toBe(5000);
      expect(totals.totalPaise).toBe(31250);
    });

    it('should handle many items', () => {
      const items = Array.from({ length: 10 }, () => ({ totalPaise: 1000 }));
      const totals = calculateOrderTotals(items);
      expect(totals.subtotalPaise).toBe(10000);
      expect(totals.taxPaise).toBe(500);
      expect(totals.totalPaise).toBe(15500);
    });

    it('should always add flat ₹50 shipping regardless of subtotal', () => {
      const small = calculateOrderTotals([{ totalPaise: 1 }]);
      const large = calculateOrderTotals([{ totalPaise: 1000000 }]);
      expect(small.shippingPaise).toBe(5000);
      expect(large.shippingPaise).toBe(5000);
    });

    it('should floor fractional tax (no rounding up)', () => {
      // 10001 * 0.05 = 500.05 -> floor to 500
      const totals = calculateOrderTotals([{ totalPaise: 10001 }]);
      expect(totals.taxPaise).toBe(500);
    });

    it('should add subtotal + tax + shipping correctly in all cases', () => {
      const items = [{ totalPaise: 7777 }, { totalPaise: 3333 }];
      const totals = calculateOrderTotals(items);
      expect(totals.totalPaise).toBe(totals.subtotalPaise + totals.taxPaise + totals.shippingPaise);
    });

    it('should return all four fields', () => {
      const totals = calculateOrderTotals([{ totalPaise: 5000 }]);
      expect(totals).toHaveProperty('subtotalPaise');
      expect(totals).toHaveProperty('taxPaise');
      expect(totals).toHaveProperty('shippingPaise');
      expect(totals).toHaveProperty('totalPaise');
    });
  });

  describe('Pagination Logic', () => {
    it('should calculate total pages correctly', () => {
      const p = buildPagination(1, 10, 25);
      expect(p.pages).toBe(3);
    });

    it('should set hasNext to true when more pages exist', () => {
      const p = buildPagination(1, 10, 25);
      expect(p.hasNext).toBe(true);
    });

    it('should set hasNext to false on last page', () => {
      const p = buildPagination(3, 10, 25);
      expect(p.hasNext).toBe(false);
    });

    it('should set hasPrev to false on first page', () => {
      const p = buildPagination(1, 10, 25);
      expect(p.hasPrev).toBe(false);
    });

    it('should set hasPrev to true on page 2+', () => {
      const p = buildPagination(2, 10, 25);
      expect(p.hasPrev).toBe(true);
    });

    it('should handle single-page result', () => {
      const p = buildPagination(1, 20, 5);
      expect(p.pages).toBe(1);
      expect(p.hasNext).toBe(false);
      expect(p.hasPrev).toBe(false);
    });

    it('should handle exactly full pages', () => {
      const p = buildPagination(1, 10, 20);
      expect(p.pages).toBe(2);
      expect(p.hasNext).toBe(true);
    });

    it('should handle zero total records', () => {
      const p = buildPagination(1, 10, 0);
      expect(p.pages).toBe(0);
      expect(p.hasNext).toBe(false);
    });
  });

  describe('Cart Quantity Validation', () => {
    const isValidQuantity = (qty: number) => Number.isInteger(qty) && qty >= 1 && qty <= 999;

    it('should accept quantity of 1', () => {
      expect(isValidQuantity(1)).toBe(true);
    });

    it('should accept quantity of 999 (max)', () => {
      expect(isValidQuantity(999)).toBe(true);
    });

    it('should reject quantity of 0', () => {
      expect(isValidQuantity(0)).toBe(false);
    });

    it('should reject quantity of 1000 (over max)', () => {
      expect(isValidQuantity(1000)).toBe(false);
    });

    it('should reject negative quantities', () => {
      expect(isValidQuantity(-1)).toBe(false);
    });

    it('should reject float quantities', () => {
      expect(isValidQuantity(1.5)).toBe(false);
    });
  });
});
