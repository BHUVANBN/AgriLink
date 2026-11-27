/**
 * Order lifecycle rules — the only legal status transitions.
 * Prevents e.g. a supplier jumping PLACED → DELIVERED on an unpaid order.
 */
export type OrderStatus =
  | 'PLACED' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED' | 'CANCELLED';

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PLACED: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'RETURNED'],
  DELIVERED: ['RETURNED'],
  RETURNED: [],
  CANCELLED: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

/** Online orders must be paid before a supplier can start fulfilling them. */
export function requiresPayment(
  order: { paymentMethod: string; paymentStatus: string },
  to: OrderStatus,
): boolean {
  return order.paymentMethod === 'RAZORPAY'
    && order.paymentStatus !== 'PAID'
    && to !== 'CANCELLED';
}
