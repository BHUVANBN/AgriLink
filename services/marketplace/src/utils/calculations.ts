/**
 * Marketplace Service - Calculation Logic Helpers 🛒
 */

export interface OrderTotalResult {
  subtotalPaise: number;
  taxPaise: number;
  shippingPaise: number;
  totalPaise: number;
}

export function calculateOrderTotals(items: { totalPaise: number }[]): OrderTotalResult {
  const subtotalPaise = items.reduce((acc, cur) => acc + cur.totalPaise, 0);
  const taxPaise = Math.floor(subtotalPaise * 0.05); // 5% GST
  const shippingPaise = 5000; // ₹50 flat shipping
  const totalPaise = subtotalPaise + taxPaise + shippingPaise;

  return { subtotalPaise, taxPaise, shippingPaise, totalPaise };
}
