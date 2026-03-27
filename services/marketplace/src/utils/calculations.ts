/**
 * Marketplace Service - Calculation Logic Helpers 🛒
 */

export interface OrderTotalResult {
  subtotalPaise: number;
  taxPaise: number;
  shippingPaise: number;
  totalPaise: number;
}

export function calculateOrderTotals(items: { totalPaise: number }[], taxRate: number = 0.05, taxInclusive: boolean = false): OrderTotalResult {
  const itemTotalPaise = items.reduce((acc, cur) => acc + cur.totalPaise, 0);
  const shippingPaise = 5000; // ₹50.00 flat shipping (can be scaled per supplier later)

  let subtotalPaise: number;
  let taxPaise: number;
  let totalPaise: number;

  if (taxInclusive) {
     // Inclusive — Extract tax from the provided price vector
     totalPaise = itemTotalPaise + shippingPaise;
     taxPaise = Math.floor(itemTotalPaise - (itemTotalPaise / (1 + taxRate)));
     subtotalPaise = itemTotalPaise - taxPaise;
  } else {
     // Exclusive — Add tax on top as a dynamic surcharge
     subtotalPaise = itemTotalPaise;
     taxPaise = Math.floor(subtotalPaise * taxRate);
     totalPaise = subtotalPaise + taxPaise + shippingPaise;
  }

  return { subtotalPaise, taxPaise, shippingPaise, totalPaise };
}
