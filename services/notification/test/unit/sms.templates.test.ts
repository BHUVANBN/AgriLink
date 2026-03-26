/**
 * Notification Service — SMS Templates Unit Tests
 * Tests SMS text generation for all event topics
 */
import { describe, it, expect } from 'vitest';
import { getSmsText, smsTemplates } from '../../src/templates/sms.templates.js';

describe('SMS Templates 📱', () => {

  describe('getSmsText() — dispatch', () => {
    it('should return null for an unknown topic', () => {
      expect(getSmsText('unknown.event', {})).toBeNull();
    });

    it('should return a string for a known topic', () => {
      const text = getSmsText('order.placed', { orderNumber: 'ORD-001', totalAmount: 10000 });
      expect(typeof text).toBe('string');
    });

    it('should hard-limit output to 160 characters', () => {
      // Craft a data with very long fields
      const data = { orderNumber: 'ORD-' + 'X'.repeat(200), totalAmount: 999999999 };
      const text = getSmsText('order.placed', data)!;
      expect(text.length).toBeLessThanOrEqual(160);
    });

    it('should not throw on missing data fields', () => {
      expect(() => getSmsText('order.placed', {})).not.toThrow();
    });
  });

  describe('order.placed SMS', () => {
    it('should include the order number', () => {
      const text = getSmsText('order.placed', { orderNumber: 'ORD-ABC123', totalAmount: 50000 })!;
      expect(text).toContain('ORD-ABC123');
    });

    it('should include the total amount in rupees', () => {
      const text = getSmsText('order.placed', { orderNumber: 'ORD-001', totalAmount: 50000 })!;
      // 50000 paise = Rs.500
      expect(text).toContain('500');
    });

    it('should mention AgriLink brand', () => {
      const text = getSmsText('order.placed', { orderNumber: 'ORD-001', totalAmount: 100 })!;
      expect(text).toContain('AgriLink');
    });
  });

  describe('order.status.updated SMS', () => {
    it('should include the new status in uppercase', () => {
      const text = getSmsText('order.status.updated', { orderNumber: 'ORD-001', newStatus: 'shipped' })!;
      expect(text).toContain('SHIPPED');
    });

    it('should include tracking number if provided', () => {
      const text = getSmsText('order.status.updated', { orderNumber: 'ORD-001', newStatus: 'shipped', trackingNumber: 'TRK999' })!;
      expect(text).toContain('TRK999');
    });
  });

  describe('kyc.submitted SMS', () => {
    it("should include user's first name", () => {
      const text = getSmsText('kyc.submitted', { displayName: 'Bhuvan BN' })!;
      expect(text).toContain('Bhuvan');
    });

    it('should mention 2-3 working days', () => {
      const text = getSmsText('kyc.submitted', { displayName: 'Test' })!;
      expect(text).toContain('2-3');
    });
  });

  describe('kyc.approved SMS', () => {
    it("should include user's first name", () => {
      const text = getSmsText('kyc.approved', { displayName: 'Ravi Kumar' })!;
      expect(text).toContain('Ravi');
    });

    it('should say APPROVED', () => {
      const text = getSmsText('kyc.approved', { displayName: 'Test' })!;
      expect(text).toContain('APPROVED');
    });
  });

  describe('kyc.rejected SMS', () => {
    it('should include truncated rejection reason', () => {
      const text = getSmsText('kyc.rejected', { displayName: 'Test', reason: 'Photo was blurry' })!;
      expect(text).toContain('blurry');
    });
  });

  describe('land.agreement.created SMS', () => {
    it('should mention land and agreement', () => {
      const text = getSmsText('land.agreement.created', {})!;
      expect(text.toLowerCase()).toContain('land');
      expect(text.toLowerCase()).toContain('agreement');
    });
  });

  describe('land.agreement.signed SMS', () => {
    it('should say fully executed when both signed', () => {
      const text = getSmsText('land.agreement.signed', { fullyExecuted: true, signerName: 'Farmer A' })!;
      expect(text.toLowerCase()).toContain('executed');
    });

    it('should mention signer when not fully executed', () => {
      const text = getSmsText('land.agreement.signed', { fullyExecuted: false, signerName: 'Farmer A' })!;
      expect(text).toContain('Farmer A');
    });
  });

  describe('notification.send generic SMS', () => {
    it('should return the body text', () => {
      const text = getSmsText('notification.send', { body: 'Hello from AgriLink' })!;
      expect(text).toContain('Hello from AgriLink');
    });

    it('should truncate long bodies to 160 chars', () => {
      const longBody = 'X'.repeat(200);
      const text = getSmsText('notification.send', { body: longBody })!;
      expect(text.length).toBeLessThanOrEqual(160);
    });
  });

  describe('user.registered SMS', () => {
    it("should greet user by first name", () => {
      const text = getSmsText('user.registered', { displayName: 'Chandra Shekhar' })!;
      expect(text).toContain('Chandra');
    });
  });
});
