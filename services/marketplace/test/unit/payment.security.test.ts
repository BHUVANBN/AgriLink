import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import { isValidCheckoutSignature, hmacHex } from '../../src/routes/payment.js';
import { canTransition, requiresPayment } from '../../src/utils/orderState.js';

const SECRET = 'test_secret';
const sign = (o: string, p: string) => crypto.createHmac('sha256', SECRET).update(`${o}|${p}`).digest('hex');

describe('Razorpay checkout signature', () => {
  it('accepts a genuine signature', () => {
    expect(isValidCheckoutSignature('order_A', 'pay_1', sign('order_A', 'pay_1'), SECRET)).toBe(true);
  });

  it('rejects a signature from a different Razorpay order (cheap-order replay)', () => {
    const sigForCheapOrder = sign('order_CHEAP', 'pay_1');
    expect(isValidCheckoutSignature('order_EXPENSIVE', 'pay_1', sigForCheapOrder, SECRET)).toBe(false);
  });

  it('rejects tampered / malformed signatures without throwing', () => {
    expect(isValidCheckoutSignature('order_A', 'pay_1', 'deadbeef', SECRET)).toBe(false);
    expect(isValidCheckoutSignature('order_A', 'pay_1', '', SECRET)).toBe(false);
  });

  it('webhook HMAC is computed over the raw body bytes', () => {
    const body = Buffer.from('{"event":"payment.captured"}');
    expect(hmacHex(SECRET, body)).toBe(crypto.createHmac('sha256', SECRET).update(body).digest('hex'));
  });
});

describe('Order state machine', () => {
  it('allows the normal fulfilment path', () => {
    expect(canTransition('PLACED', 'CONFIRMED')).toBe(true);
    expect(canTransition('CONFIRMED', 'PROCESSING')).toBe(true);
    expect(canTransition('PROCESSING', 'SHIPPED')).toBe(true);
    expect(canTransition('SHIPPED', 'DELIVERED')).toBe(true);
  });

  it('blocks skipping steps and reviving finished orders', () => {
    expect(canTransition('PLACED', 'DELIVERED')).toBe(false);
    expect(canTransition('CANCELLED', 'CONFIRMED')).toBe(false);
    expect(canTransition('DELIVERED', 'SHIPPED')).toBe(false);
  });

  it('requires payment before fulfilling online orders, but allows cancelling', () => {
    const unpaid = { paymentMethod: 'RAZORPAY', paymentStatus: 'PENDING' };
    expect(requiresPayment(unpaid, 'CONFIRMED')).toBe(true);
    expect(requiresPayment(unpaid, 'CANCELLED')).toBe(false);
    expect(requiresPayment({ paymentMethod: 'COD', paymentStatus: 'PENDING' }, 'CONFIRMED')).toBe(false);
  });
});
