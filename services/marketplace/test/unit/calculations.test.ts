import { describe, it, expect } from 'vitest';
import { calculateOrderTotals } from '../../src/utils/calculations.js';

describe('Marketplace Service - Totals Calculation 🛒', () => {
  it('should calculate subtotal correctly', () => {
    const items = [
      { totalPaise: 1000 }, // ₹10
      { totalPaise: 2000 }, // ₹20
    ];
    const totals = calculateOrderTotals(items);
    expect(totals.subtotalPaise).toBe(3000);
  });

  it('should calculate 5% tax correctly (rounding down)', () => {
    const items = [{ totalPaise: 10000 }]; // ₹100
    const totals = calculateOrderTotals(items);
    expect(totals.taxPaise).toBe(500); // 5% of 10000
  });

  it('should add ₹50 shipping (5000 paise)', () => {
    const items = [{ totalPaise: 10000 }];
    const totals = calculateOrderTotals(items);
    expect(totals.shippingPaise).toBe(5000);
  });

  it('should sum everything for totalPaise', () => {
    const items = [{ totalPaise: 10000 }];
    const totals = calculateOrderTotals(items);
    // 10000 (subtotal) + 500 (tax) + 5000 (shipping) = 15500
    expect(totals.totalPaise).toBe(15500);
  });

  it('should handle zero items (flat shipping + tax on zero)', () => {
    const totals = calculateOrderTotals([]);
    expect(totals.subtotalPaise).toBe(0);
    expect(totals.taxPaise).toBe(0);
    expect(totals.shippingPaise).toBe(5000);
    expect(totals.totalPaise).toBe(5000);
  });
});
