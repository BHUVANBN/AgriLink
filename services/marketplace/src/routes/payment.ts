import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import '@fastify/rate-limit';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import type { OrderDto } from '@agrilink/types';
import { publishEvent } from '../services/kafka.js';

// ── Razorpay Client ───────────────────────────────────────────

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// ── Schemas ───────────────────────────────────────────────────

const CreatePaymentOrderSchema = z.object({
  orderId: z.string().uuid(),
  totalPaise: z.number().int().positive(),
  farmerId: z.string(),
  notes: z.record(z.string()).optional(),
});

const VerifyPaymentSchema = z.object({
  orderId: z.string().uuid(),                  // our internal order ID
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export async function paymentRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', (fastify as any).authenticate);
  /**
   * POST /marketplace/payment/create-order
   * Creates a Razorpay order for a given marketplace order.
   */
  fastify.post(
    '/payment/create-order',
    { config: { rateLimit: { max: 20, timeWindow: '1m' } } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const result = CreatePaymentOrderSchema.safeParse(req.body);
      if (!result.success) {
        return reply.status(400).send({ success: false, error: result.error.flatten() });
      }

      const { orderId, totalPaise, farmerId, notes } = result.data;

      try {
        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
          amount: totalPaise,          // Already in paise
          currency: 'INR',
          receipt: `agrilink_${orderId.slice(0, 8)}`,
          notes: {
            orderId,
            farmerId,
            platform: 'agrilink',
            ...notes,
          },
        });

        // Update our order with razorpayOrderId
        const { prisma } = req.server as any;
        await prisma.order.update({
          where: { id: orderId },
          data: { razorpayOrderId: razorpayOrder.id },
        });

        return reply.send({
          success: true,
          data: {
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
          },
        });
      } catch (err: any) {
        fastify.log.error({ err }, 'Razorpay create order failed');
        return reply.status(500).send({ success: false, error: 'Payment initialization failed' });
      }
    }
  );

  /**
   * POST /marketplace/payment/verify
   * Verifies Razorpay payment signature and marks order as PAID.
   * This is the single most critical endpoint — HMAC verification prevents fraud.
   */
  fastify.post(
    '/payment/verify',
    { config: { rateLimit: { max: 20, timeWindow: '1m' } } },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const result = VerifyPaymentSchema.safeParse(req.body);
      if (!result.success) {
        return reply.status(400).send({ success: false, error: result.error.flatten() });
      }

      const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = result.data;

      // ── HMAC Signature Verification ────────────────────────
      const body = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest('hex');

      if (expectedSignature !== razorpaySignature) {
        fastify.log.warn({ orderId, razorpayPaymentId }, 'Payment signature verification FAILED');
        return reply.status(400).send({
          success: false,
          error: 'Payment verification failed — invalid signature',
        });
      }

      // ── Mark Order as PAID ─────────────────────────────────
      try {
        const { prisma } = fastify as any;
        const order = await prisma.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: 'PAID',
            razorpayPaymentId,
            razorpaySignature,
            paidAt: new Date(),
            orderStatus: 'CONFIRMED',
          },
        });

        fastify.log.info({ orderId, razorpayPaymentId }, 'Payment verified and order confirmed');

        // Publish 'order.placed' event (BUG-011 fix)
        await publishEvent('order.placed', {
          orderId: order.id,
          orderNumber: order.orderNumber,
          farmerId: order.farmerId,
          supplierId: order.supplierId,
          items: order.items,
          totalAmount: order.totalPaise,
          email: (req as any).user?.email,
          paymentStatus: 'PAID',
        });

        return reply.send({
          success: true,
          data: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            orderStatus: order.orderStatus,
            paidAt: order.paidAt,
          },
        });
      } catch (err: any) {
        fastify.log.error({ err }, 'Failed to update order after payment');
        return reply.status(500).send({
          success: false,
          error: 'Payment verified but order update failed — contact support',
        });
      }
    }
  );

  /**
   * POST /marketplace/payment/refund
   * Initiates a refund for a paid order. (Admin Only)
   */
  fastify.post(
    '/payment/refund',
    { 
      preHandler: [(fastify as any).requireRole('admin')],
      config: { rateLimit: { max: 5, timeWindow: '1m' } } 
    },
    async (req: FastifyRequest, reply: FastifyReply) => {
      const { orderId } = req.body as { orderId: string };
      const { prisma } = req.server as any;

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (!order) {
        return reply.status(404).send({ success: false, error: 'Order not found' });
      }
      if (order.paymentStatus !== 'PAID') {
        return reply.status(400).send({ success: false, error: 'Order is not paid' });
      }
      if (!order.razorpayPaymentId) {
        return reply.status(400).send({ success: false, error: 'No payment to refund' });
      }

      try {
        const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
          amount: order.totalPaise,
          speed: 'optimum',
          notes: { orderId, reason: 'customer_requested' },
        });

        await prisma.order.update({
          where: { id: orderId },
          data: { paymentStatus: 'REFUNDED', orderStatus: 'RETURNED' },
        });

        return reply.send({
          success: true,
          data: { refundId: refund.id, status: refund.status },
        });
      } catch (err: any) {
        fastify.log.error({ err }, 'Refund failed');
        return reply.status(500).send({ success: false, error: 'Refund failed' });
      }
    }
  );
}
