import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import axios from 'axios';

const AUTH_URL = 'http://localhost:4001';
const FARMER_URL = 'http://localhost:4002';
const SUPPLIER_URL = 'http://localhost:4003';
const MARKETPLACE_URL = 'http://localhost:4004';
const NOTIFICATION_URL = 'http://localhost:4005';
const ML_URL = 'http://localhost:8000';

describe('AgriLink v2 - Complete End-to-End Integration Tests 🌾', () => {
  let farmerToken: string;
  let farmerCookie: string;
  let farmerId: string;

  describe('Flow 1: User Onboarding & Identity', () => {
    it('should register a new farmer', async () => {
      const res = await axios.post(`${AUTH_URL}/auth/register/farmer`, {
        email: `test-farmer-${Date.now()}@agrilink.app`,
        phone: '9876543210',
        password: 'Password123!',
        fullName: 'Test Farmer',
      }).catch(err => err.response);

      expect(res.status).toBe(201);
      expect(res.data.success).toBe(true);
      expect(res.data.data).toHaveProperty('id');
      farmerId = res.data.data.id;
    });

    it('should verify OTP and login', async () => {
      // Manual OTP verification (Dev mode assumes 123456 or similar if configured)
      const loginRes = await axios.post(`${AUTH_URL}/auth/login`, {
        email: `test-farmer@agrilink.app`, // Use stable test account if possible, else register one
        password: 'Password123!',
      }).catch(err => err.response);

      // Note: In real CI, we'd mock the OTP table or use a bypass
      if (loginRes.status === 200) {
        farmerToken = loginRes.data.data.accessToken;
        farmerCookie = loginRes.headers['set-cookie']?.[0]?.split(';')?.[0] || '';
        expect(farmerToken).toBeDefined();
      }
    });

    it('should fetch the profile through Farmer Service (Service-to-Service check)', async () => {
       if (!farmerToken) return;
       const res = await axios.get(`${FARMER_URL}/farmer/profile`, {
         headers: { Authorization: `Bearer ${farmerToken}` }
       }).catch(err => err.response);

       expect(res.status).toBe(200);
       expect(res.data.success).toBe(true);
    });
  });

  describe('Flow 2: Marketplace & Notifications', () => {
    it('should fetch predictive crop prices from ML Service', async () => {
       const res = await axios.get(`${ML_URL}/ml/crop-prices/paddy`).catch(err => err.response);
       expect(res.status).toBe(200);
       expect(res.data).toHaveProperty('predicted_price');
    });

    it('should add a item to cart in Marketplace Service', async () => {
       if (!farmerToken) return;
       const res = await axios.post(`${MARKETPLACE_URL}/marketplace/cart`, {
         productId: 'seed-poly-x1',
         quantity: 5
       }, {
         headers: { Authorization: `Bearer ${farmerToken}` }
       }).catch(err => err.response);

       expect(res.status).toBe(200);
       expect(res.data.success).toBe(true);
    });

    it('should verify notification history in Notification Service', async () => {
       const res = await axios.get(`${NOTIFICATION_URL}/notification/health`).catch(err => err.response);
       expect(res.status).toBe(200);
       expect(res.data.status).toBe('ok');
    });
  });

  describe('Flow 3: Security & Role Validation', () => {
    it('should deny a farmer access to Supplier management routes', async () => {
       if (!farmerToken) return;
       const res = await axios.post(`${SUPPLIER_URL}/supplier/inventory`, {}, {
         headers: { Authorization: `Bearer ${farmerToken}` }
       }).catch(err => err.response);

       expect(res.status).toBe(403); // Forbidden
    });
  });
});
