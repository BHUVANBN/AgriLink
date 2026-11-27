import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { z } from 'zod';
import { safeEqual } from '@agrilink/auth-middleware';
import { publishEvent, enqueueEvent, flushOutbox } from '../services/kafka.js';
import { orderPlacedPayload } from './orders.js';

// ── Razorpay Client (lazy: service still boots without keys, e.g. COD-only) ──

let razorpayClient: Razorpay | null = null;
function razorpay(): Razorpay {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw Object.assign(new Error('Online payments are not configured'), { statusCode: 503 });
  }
  razorpayClient ??= new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  return razorpayClient;
}

export function hmacHex(secret: string, payload: string | Buffer): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

/** Razorpay checkout signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret) */
export function isValidCheckoutSignature(rzpOrderId: string, rzpPaymentId: string, signature: string, secret: string) {
  return safeEqual(hmacHex(secret, `${rzpOrderId}|${rzpPaymentId}`), signature);
}

// ── Schemas ───────────────────────────────────────────────────

const CreatePaymentOrderSchema = z.union([
  z.object({ orderIds: z.array(z.string().uuid()).min(1).max(20) }),
  z.object({ orderId: z.string().uuid() }).transform((v) => ({ orderIds: [v.orderId] })),
]);

const VerifyPaymentSchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
});

/**
 * Mark every still-PENDING order attached to a Razorpay order as PAID.
 * Each order is flipped with a conditional update, so verify + webhook racing
 * each other still publishes `order.placed` exactly once per order.
 */
async function settleRazorpayOrder(
  fastify: FastifyInstance,
  rzpOrderId: string,
  rzpPaymentId: string,
  opts: { farmerId?: string; signature?: string; email?: string } = {},
) {
  const { prisma } = fastify as any;
  const orders = await prisma.order.findMany({
    where: { razorpayOrderId: rzpOrderId, ...(opts.farmerId ? { farmerId: opts.farmerId } : {}) },
  });

  const settled = [];
  for (const order of orders) {
    // Mark paid + record the order.placed event atomically: a paid order can
    // never miss its supplier notification, even if Kafka is down.
    const paid = await prisma.$transaction(async (tx: any) => {
      const res = await tx.order.updateMany({
        where: { id: order.id, paymentStatus: 'PENDING' },
        data: {
          paymentStatus: 'PAID',
          razorpayPaymentId: rzpPaymentId,
          razorpaySignature: opts.signature ?? null,
          paidAt: new Date(),
          orderStatus: 'CONFIRMED',
        },
      });
      if (res.count !== 1) return null;
      const p = { ...order, paymentStatus: 'PAID', orderStatus: 'CONFIRMED' };
      await enqueueEvent(tx, 'order.placed', orderPlacedPayload(p, opts.email));
      return p;
    });
    if (paid) settled.push(paid);
  }
  if (settled.length) flushOutbox();
  return { orders, settled };
}

// ── Authenticated payment routes ──────────────────────────────

export async function paymentRoutes(fastify: FastifyInstance) {
  // Webhook lives in its own encapsulated scope: no auth, raw body
  await fastify.register(webhookRoutes);

  await fastify.register(async (app) => {
    app.addHook('preHandler', (fastify as any).authenticate);

    /**
     * POST /marketplace/payment/create-order
     * Body: { orderIds: string[] }  (or legacy { orderId })
     * The amount is ALWAYS the sum of the stored order totals.
     */
    app.post(
      '/create-order',
      { config: { rateLimit: { max: 20, timeWindow: '1m' } } },
      async (req: FastifyRequest, reply: FastifyReply) => {
        const parsed = CreatePaymentOrderSchema.safeParse(req.body);
        if (!parsed.success) {
          return reply.status(400).send({ success: false, error: parsed.error.flatten() });
        }
        const { orderIds } = parsed.data;
        const user = (req as any).user;
        const { prisma } = fastify as any;

        const orders = await prisma.order.findMany({
          where: { id: { in: orderIds }, farmerId: user.sub },
        });
        if (orders.length !== orderIds.length) {
          return reply.status(404).send({ success: false, error: 'Order not found' });
        }
        const notPayable = orders.find((o: any) =>
          o.paymentMethod !== 'RAZORPAY' || o.paymentStatus !== 'PENDING' || o.orderStatus !== 'PLACED');
        if (notPayable) {
          return reply.status(409).send({ success: false, error: `Order ${notPayable.orderNumber} is not awaiting payment` });
        }

        const amount = orders.reduce((sum: number, o: any) => sum + o.totalPaise, 0);

        // Re-use an existing Razorpay order if this exact set was already initialised
        const existing = orders[0].razorpayOrderId;
        if (existing && orders.every((o: any) => o.razorpayOrderId === existing)) {
          return reply.send({
            success: true,
            data: { razorpayOrderId: existing, amount, currency: 'INR', keyId: process.env.RAZORPAY_KEY_ID },
          });
        }

        try {
          const rzpOrder = await razorpay().orders.create({
            amount,
            currency: 'INR',
            receipt: orders[0].orderNumber,
            notes: {
              platform: 'agrilink',
              farmerId: user.sub,
              orderNumbers: orders.map((o: any) => o.orderNumber).join(',').slice(0, 250),
            },
          });

          await prisma.order.updateMany({
            where: { id: { in: orderIds }, farmerId: user.sub, paymentStatus: 'PENDING' },
            data: { razorpayOrderId: rzpOrder.id },
          });

          return reply.send({
            success: true,
            data: {
              razorpayOrderId: rzpOrder.id,
              amount: rzpOrder.amount,
              currency: rzpOrder.currency,
              keyId: process.env.RAZORPAY_KEY_ID,
            },
          });
        } catch (err: any) {
          fastify.log.error({ err }, 'Razorpay create order failed');
          return reply.status(err.statusCode === 503 ? 503 : 502).send({
            success: false,
            error: err.statusCode === 503 ? err.message : 'Payment initialization failed',
          });
        }
      },
    );

    /**
     * POST /marketplace/payment/verify
     * Verifies the checkout signature and settles every order linked to that
     * Razorpay order — but only orders that belong to the caller.
     */
    app.post(
      '/verify',
      { config: { rateLimit: { max: 20, timeWindow: '1m' } } },
      async (req: FastifyRequest, reply: FastifyReply) => {
        const parsed = VerifyPaymentSchema.safeParse(req.body);
        if (!parsed.success) {
          return reply.status(400).send({ success: false, error: parsed.error.flatten() });
        }
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = parsed.data;
        const user = (req as any).user;

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) return reply.status(503).send({ success: false, error: 'Online payments are not configured' });

        if (!isValidCheckoutSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature, secret)) {
          fastify.log.warn({ razorpayOrderId, razorpayPaymentId, userId: user.sub }, 'Payment signature verification FAILED');
          return reply.status(400).send({ success: false, error: 'Payment verification failed — invalid signature' });
        }

        const { orders } = await settleRazorpayOrder(fastify, razorpayOrderId, razorpayPaymentId, {
          farmerId: user.sub,
          signature: razorpaySignature,
          email: user.email,
        });
        if (orders.length === 0) {
          return reply.status(404).send({ success: false, error: 'No orders found for this payment' });
        }

        return reply.send({
          success: true,
          data: {
            orders: orders.map((o: any) => ({ orderId: o.id, orderNumber: o.orderNumber })),
            paymentStatus: 'PAID',
          },
        });
      },
    );

    /**
     * POST /marketplace/payment/refund  (admin only)
     */
    app.post(
      '/refund',
      {
        preHandler: [(fastify as any).requireRole('admin')],
        config: { rateLimit: { max: 5, timeWindow: '1m' } },
      },
      async (req: FastifyRequest, reply: FastifyReply) => {
        const { orderId } = z.object({ orderId: z.string().uuid() }).parse(req.body);
        const { prisma } = fastify as any;

        const order = await prisma.order.findUnique({ where: { id: orderId } });
        if (!order) return reply.status(404).send({ success: false, error: 'Order not found' });
        if (order.paymentStatus !== 'PAID') return reply.status(400).send({ success: false, error: 'Order is not paid' });
        if (!order.razorpayPaymentId) return reply.status(400).send({ success: false, error: 'No payment to refund' });

        try {
          const refund = await razorpay().payments.refund(order.razorpayPaymentId, {
            amount: order.totalPaise,
            speed: 'normal',
            notes: { orderId, reason: 'customer_requested' },
          });

          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'REFUNDED', orderStatus: 'RETURNED' },
          });
          await publishEvent('order.status.updated', {
            orderId: order.id,
            orderNumber: order.orderNumber,
            farmerId: order.farmerId,
            newStatus: 'RETURNED',
          });

          return reply.send({ success: true, data: { refundId: refund.id, status: refund.status } });
        } catch (err: any) {
          fastify.log.error({ err }, 'Refund failed');
          return reply.status(502).send({ success: false, error: 'Refund failed' });
        }
      },
    );
  });
}

// ── Razorpay webhook (server-to-server, free in test + live mode) ──
// Settles payments even if the farmer closes the browser before /verify runs.
// Configure in Razorpay Dashboard → Webhooks:
//   URL: https://<your-domain>/marketplace/payment/webhook
//   Events: payment.captured, order.paid     Secret: RAZORPAY_WEBHOOK_SECRET

async function webhookRoutes(app: FastifyInstance) {
  app.addContentTypeParser('application/json', { parseAs: 'buffer' }, (_req, body, done) => done(null, body));

  app.post('/webhook', { config: { rateLimit: { max: 300, timeWindow: '1m' } } }, async (req, reply) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) return reply.status(503).send({ success: false, error: 'Webhook not configured' });

    const raw = req.body as Buffer;
    const signature = req.headers['x-razorpay-signature'];
    if (typeof signature !== 'string' || !Buffer.isBuffer(raw) || !safeEqual(hmacHex(secret, raw), signature)) {
      return reply.status(400).send({ success: false, error: 'Invalid signature' });
    }

    let event: any;
    try { event = JSON.parse(raw.toString('utf8')); } catch { return reply.status(400).send({ success: false }); }

    if (event.event === 'payment.captured' || event.event === 'order.paid') {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id && payment?.id) {
        const { settled } = await settleRazorpayOrder(app, payment.order_id, payment.id);
        app.log.info({ rzpOrderId: payment.order_id, settled: settled.length }, 'Razorpay webhook settled orders');
      }
    }
    // Always 200 for valid signatures so Razorpay doesn't retry forever
    return reply.send({ success: true });
  });
}
