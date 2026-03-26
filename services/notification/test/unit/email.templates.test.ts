/**
 * Notification Service — Email Templates Unit Tests
 * Tests that all templates render correctly with provided data
 */
import { describe, it, expect } from 'vitest';
import { getTemplate, templates } from '../../src/templates/email.templates.js';

describe('Email Templates 📧', () => {

  describe('getTemplate() — dispatch', () => {
    it('should return null for an unknown topic', () => {
      expect(getTemplate('unknown.topic', {})).toBeNull();
    });

    it('should return an EmailTemplate object for a known topic', () => {
      const t = getTemplate('order.placed', { orderNumber: 'ORD-001', totalAmount: 10000 });
      expect(t).not.toBeNull();
      expect(t).toHaveProperty('subject');
      expect(t).toHaveProperty('html');
      expect(t).toHaveProperty('text');
    });

    it('should not throw on missing data fields (graceful rendering)', () => {
      expect(() => getTemplate('order.placed', {})).not.toThrow();
    });
  });

  describe('order.placed template', () => {
    const data = { orderNumber: 'ORD-1A2B3C4D', totalAmount: 150000, items: [{ name: 'Urea 50kg', quantity: 2 }] };
    let t: any;

    it('should include the order number in subject', () => {
      t = getTemplate('order.placed', data)!;
      expect(t.subject).toContain('ORD-1A2B3C4D');
    });

    it('should include the order number in HTML', () => {
      t = getTemplate('order.placed', data)!;
      expect(t.html).toContain('ORD-1A2B3C4D');
    });

    it('should display total in rupees (divide by 100)', () => {
      t = getTemplate('order.placed', data)!;
      expect(t.html).toContain('1500.00');
    });

    it('should list ordered items in HTML', () => {
      t = getTemplate('order.placed', data)!;
      expect(t.html).toContain('Urea 50kg');
    });

    it('should have a plain-text version', () => {
      t = getTemplate('order.placed', data)!;
      expect(t.text).toContain('Order Confirmed');
    });
  });

  describe('kyc.submitted template', () => {
    it('should include the user name in HTML', () => {
      const t = getTemplate('kyc.submitted', { displayName: 'Bhuvan BN', email: 'bhuvan@test.com' })!;
      expect(t.html).toContain('Bhuvan BN');
    });

    it('should mention review time of 2-3 business days', () => {
      const t = getTemplate('kyc.submitted', { displayName: 'Test', email: 't@test.com' })!;
      expect(t.html).toContain('2');
    });

    it('should have KYC in the subject', () => {
      const t = getTemplate('kyc.submitted', {})!;
      expect(t.subject.toLowerCase()).toContain('kyc');
    });
  });

  describe('kyc.approved template', () => {
    it('should say KYC Approved in subject', () => {
      const t = getTemplate('kyc.approved', { displayName: 'Bhuvan', role: 'farmer' })!;
      expect(t.subject.toLowerCase()).toContain('approved');
    });

    it('should show supplier-specific unlocked features for supplier role', () => {
      const t = getTemplate('kyc.approved', { displayName: 'Supplier Co', role: 'supplier' })!;
      expect(t.html).toContain('List products');
    });

    it('should show farmer-specific unlocked features for farmer role', () => {
      const t = getTemplate('kyc.approved', { displayName: 'Farmer', role: 'farmer' })!;
      expect(t.html).toContain('blockchain');
    });
  });

  describe('kyc.rejected template', () => {
    it('should include the rejection reason in HTML', () => {
      const t = getTemplate('kyc.rejected', { displayName: 'Test', reason: 'Document was blurry' })!;
      expect(t.html).toContain('Document was blurry');
    });

    it('should use a fallback reason when not provided', () => {
      const t = getTemplate('kyc.rejected', { displayName: 'Test' })!;
      expect(t.html).toContain('unclear');
    });

    it('should have a warning tone in subject', () => {
      const t = getTemplate('kyc.rejected', {})!;
      expect(t.subject).toContain('⚠️');
    });
  });

  describe('order.status.updated template', () => {
    it('should include the status in the subject', () => {
      const t = getTemplate('order.status.updated', { orderNumber: 'ORD-001', newStatus: 'shipped' })!;
      expect(t.subject.toLowerCase()).toContain('shipped');
    });

    it('should include tracking number if provided', () => {
      const t = getTemplate('order.status.updated', { orderNumber: 'ORD-001', newStatus: 'shipped', trackingNumber: 'TRK123', carrier: 'Delhivery' })!;
      expect(t.html).toContain('TRK123');
    });
  });

  describe('land.agreement.created template', () => {
    it('should include the agreement ID', () => {
      const t = getTemplate('land.agreement.created', { agreementId: 'AGR-XYZ-001' })!;
      expect(t.html).toContain('AGR-XYZ-001');
    });

    it('should warn about signature requirements', () => {
      const t = getTemplate('land.agreement.created', { agreementId: 'AGR-001' })!;
      expect(t.html.toLowerCase()).toContain('sign');
    });
  });

  describe('land.agreement.signed template', () => {
    it('should indicate partial signing when not fully executed', () => {
      const t = getTemplate('land.agreement.signed', { fullyExecuted: false, signerName: 'Farmer A' })!;
      expect(t.html).toContain('Farmer A');
    });

    it('should indicate full execution when fully executed', () => {
      const t = getTemplate('land.agreement.signed', { fullyExecuted: true, txHash: '0xabc123' })!;
      expect(t.subject).toContain('Fully Executed');
    });
  });

  describe('user.registered template', () => {
    it('should greet the user by first name', () => {
      const t = getTemplate('user.registered', { displayName: 'Bhuvan Kumar', role: 'farmer' })!;
      expect(t.html).toContain('Bhuvan');
    });

    it('should have welcome in the subject', () => {
      const t = getTemplate('user.registered', { displayName: 'Test User', role: 'farmer' })!;
      expect(t.subject.toLowerCase()).toContain('welcome');
    });
  });

  describe('notification.send generic template', () => {
    it('should use the provided subject', () => {
      const t = getTemplate('notification.send', { subject: 'System Alert', body: 'Server issues detected.' })!;
      expect(t.subject).toBe('System Alert');
    });

    it('should render the body text', () => {
      const t = getTemplate('notification.send', { subject: 'Test', body: 'Hello World' })!;
      expect(t.html).toContain('Hello World');
    });
  });
});
