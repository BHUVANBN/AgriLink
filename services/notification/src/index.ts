import './config.js';
/**
 * AgriLink Notification Service — Complete Implementation
 *
 * Architecture:
 *   - Pure Kafka consumer (no inbound HTTP from other services)
 *   - Reads events → renders templates → dispatches email + SMS
 *   - Logs every dispatch to MongoDB (NotificationLog)
 *   - Retry logic: up to 3 attempts per channel with exponential back-off
 *   - Dead Letter Queue: failed after 3 retries → logged as 'failed'
 *   - Fastify HTTP server for health check + admin API only
 */

import Fastify from 'fastify';
import { randomUUID } from 'crypto';
import FastifyCors from '@fastify/cors';
import FastifyJwt from '@fastify/jwt';
import FastifyCookie from '@fastify/cookie';
import { makeAuthMiddleware, requireRole } from '@agrilink/auth-middleware';
import { registerMetrics, registry as promRegistry, superviseConsumer } from '@agrilink/platform';
import { Counter } from 'prom-client';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import nodemailer, { Transporter } from 'nodemailer';
import { withRetry } from './utils/retry.js';

import { getTemplate } from './templates/email.templates.js';
import { getSmsText } from './templates/sms.templates.js';
import { NotificationLog, InAppNotification } from './models/NotificationLog.js';
import { getUsersForBroadcast } from './services/auth.js';
import fastifyIO from 'fastify-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';

// ── Config ────────────────────────────────────────────────────

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    transport: process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
});

// CORS for the REST API (the browser calls /notification/me from the web app)
await fastify.register(FastifyCors, {
  origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
});

// JWT & Cookie for Auth Middleware
await fastify.register(FastifyCookie, {
  secret: process.env.COOKIE_SECRET ?? process.env.JWT_ACCESS_SECRET ?? 'cookie-secret-dev',
  hook: 'onRequest',
});

await fastify.register(FastifyJwt, {
  secret: process.env.JWT_ACCESS_SECRET!,
});

// ── Redis (revocation checks + Socket.IO fan-out across replicas) ──
const REDIS_URL = process.env.REDIS_URL ?? 'redis://localhost:6379';
const redis = new Redis(REDIS_URL, { maxRetriesPerRequest: 2 });
redis.on('error', (err) => fastify.log.warn({ err: err.message }, '[redis] error (non-fatal)'));

// Register the standard auth decorator
fastify.decorate('authenticate', makeAuthMiddleware(fastify, { redis }));
registerMetrics(fastify, 'notification');

// Socket.IO is served under /notification/socket.io so it goes through the
// gateway like every other API. The Redis adapter makes `io.to(room).emit()`
// reach sockets connected to ANY replica — required once you scale out,
// because Kafka hands each event to only one replica in the consumer group.
const pubClient = new Redis(REDIS_URL);
const subClient = pubClient.duplicate();
pubClient.on('error', () => {});
subClient.on('error', () => {});

await fastify.register(fastifyIO as any, {
  path: '/notification/socket.io',
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  adapter: createAdapter(pubClient, subClient),
});

// Swagger Documentation Engine
await fastify.register(FastifySwagger, {
  openapi: {
    info: {
      title: 'AgriLink Notification Service API',
      description: 'Handles real-time WebSockets, Email, and SMS dispatches for the AgriLink platform.',
      version: '2.0.0',
    },
    servers: [{ url: 'http://localhost:8080/notification' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
});

await fastify.register(FastifySwaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
  staticCSP: true,
});

fastify.setErrorHandler(async (error: any, _req, reply) => {
  fastify.log.error({ err: error }, 'Unhandled error');

  if (error.validation) {
    return reply.status(422).send({
      success: false,
      error: 'Validation error',
      details: error.validation,
    });
  }
  if (error.statusCode === 429) {
    return reply.status(429).send({
      success: false,
      error: 'Too many requests. Please slow down.',
    });
  }
  return reply.status(error.statusCode ?? 500).send({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message,
  });
});

const TOPICS = [
  'order.placed',
  'order.status.updated',
  'kyc.submitted',
  'kyc.approved',
  'kyc.rejected',
  'land.agreement.created',
  'land.agreement.signed',
  'notification.send',
  'user.registered',
  'system.broadcast',
  'review.created',
] as const;

const deliveries = new Counter({
  name: 'notification_deliveries_total',
  help: 'Email/SMS deliveries',
  labelNames: ['channel', 'status'],
  registers: [promRegistry],
});

const FROM_EMAIL = process.env.SMTP_FROM ?? 'AgriLink <noreply@agrilink.app>';

// ── Email Transporter ─────────────────────────────────────────

function createTransporter(): Transporter {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
  });
}

let transporter: Transporter;

// ── SMS Sender ────────────────────────────────────────────────

async function sendSms(phone: string, message: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'FAST2SMS_API_KEY not configured' };
  }

  try {
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'q',
        message: message.slice(0, 160),
        language: 'english',
        flash: 0,
        numbers: phone,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    const data = await res.json() as { return?: boolean; message?: string[] };
    if (data.return !== true) {
      return { success: false, error: data.message?.join(', ') ?? 'Unknown SMS error' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message ?? 'SMS fetch failed' };
  }
}

// ── Core Dispatcher ───────────────────────────────────────────

async function dispatch(
  topic: string,
  eventData: any
): Promise<void> {
  const { email, phone, channels } = eventData;
  // Order events identify the recipient as farmerId rather than userId
  const userId = eventData.userId ?? eventData.farmerId;

  const sendEmail = email && (channels === undefined || (channels as string[]).includes('email'));
  const sendSMS = phone && (channels === undefined || (channels as string[]).includes('sms'));
  // Web (socket) delivery is free, so it's always on for a known user
  const sendWeb = Boolean(userId);

  if (!sendEmail && !sendSMS && !sendWeb) return;

  const emailTemplate = sendEmail ? getTemplate(topic, eventData) : null;
  const smsText = sendSMS ? getSmsText(topic, eventData) : null;

  if (sendWeb) {
    const subject = emailTemplate?.subject || eventData.subject || 'AgriLink update';
    const body = eventData.body || smsText || emailTemplate?.text || 'New update available';
    // Persist first so the user sees it later even if they're offline now
    const saved = await InAppNotification.create({
      data: {
        userId,
        topic,
        subject: String(subject).slice(0, 200),
        body: String(body).slice(0, 2000),
        data: (eventData.data ?? null) as any,
      },
    }).catch((err: any) => {
      fastify.log.warn({ err: err?.message }, '[in-app] persist failed');
      return null;
    });
    (fastify as any).io.to(`user:${userId}`).emit('notification', {
      id: saved?.id ?? randomUUID(),
      topic,
      timestamp: (saved?.createdAt ?? new Date()).toISOString(),
      subject,
      body,
      data: eventData.data || eventData,
    });
  }

  const jobs: Promise<void>[] = [];

  if (emailTemplate && email) {
    jobs.push((async () => {
      const { result, error, attempts } = await withRetry(() =>
        transporter.sendMail({
          from: FROM_EMAIL,
          to: email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        })
      );

      deliveries.inc({ channel: 'email', status: result ? 'sent' : 'failed' });
      await NotificationLog.create({
        data: {
          userId,
          topic,
          channel: 'email',
          recipient: email,
          subject: emailTemplate.subject,
          status: result ? 'sent' : 'failed',
          errorMessage: error,
          retryCount: attempts - 1,
          messageId: result?.messageId,
        }
      });
    })());
  }

  if (smsText && phone) {
    jobs.push((async () => {
      const { result, error, attempts } = await withRetry(() => {
        const p = sendSms(phone, smsText);
        return p.then(r => {
          if (!r.success) throw new Error(r.error ?? 'SMS failed');
          return r;
        });
      });

      deliveries.inc({ channel: 'sms', status: result ? 'sent' : 'failed' });
      await NotificationLog.create({
        data: {
          userId,
          topic,
          channel: 'sms',
          recipient: phone,
          status: result ? 'sent' : 'failed',
          errorMessage: error,
          retryCount: attempts - 1,
        }
      });
    })());
  }

  await Promise.allSettled(jobs);
}

// ── Kafka Setup ───────────────────────────────────────────────

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
});

const consumer: Consumer = kafka.consumer({
  groupId: 'notification-group-v2',
});

let kafkaConnected = false;
superviseConsumer(consumer, () => startKafkaConsumer(), console);

async function startKafkaConsumer(): Promise<void> {
  try {
    await consumer.connect();
    kafkaConnected = true;
    await consumer.subscribe({ topics: [...TOPICS], fromBeginning: false });
    await consumer.run({
      autoCommit: true,
      eachMessage: async ({ topic, message }: EachMessagePayload) => {
        const raw = message.value?.toString();
        if (!raw) return;
        let event: any;
        try {
          event = JSON.parse(raw);
        } catch (err) {
          return;
        }

        if (topic === 'system.broadcast') {
          const { targetRole, subject, body, priority } = event.data;
          // Free SMTP (e.g. Gmail ~500/day) can't take a platform-wide blast,
          // so broadcasts go to the web channel by default; email is opt-in.
          const channels = process.env.BROADCAST_EMAIL === 'true' ? ['email', 'web'] : ['web'];
          for await (const page of getUsersForBroadcast(targetRole)) {
            await mapWithConcurrency(page, 10, (u) =>
              dispatch('notification.send', {
                userId: u.id,
                email: u.email,
                phone: u.phone,
                subject,
                body,
                channels,
                priority,
              }).catch(() => {}),
            );
          }
        } else {
          const data = event.data ?? event;
          await dispatch(topic, data).catch(() => {});
          // Tell the supplier about new orders (in-app only)
          if (topic === 'order.placed' && data.supplierUserId) {
            await dispatch('notification.send', {
              userId: data.supplierUserId,
              channels: ['web'],
              subject: `New order ${data.orderNumber ?? ''}`.trim(),
              body: `You have a new ${data.paymentStatus === 'PAID' ? 'paid' : 'cash-on-delivery'} order to fulfil.`,
              data: { orderNumber: data.orderNumber },
            }).catch(() => {});
          }
        }
      },
    });
  } catch (err: any) {
    kafkaConnected = false;
    fastify.log.error({ err: err?.message }, '[kafka] consumer failed — retrying in 10s');
    setTimeout(() => { startKafkaConsumer().catch(() => {}); }, 10_000);
  }
}

async function mapWithConcurrency<T>(items: T[], limit: number, fn: (item: T) => Promise<unknown>) {
  let i = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) await fn(items[i++]);
  });
  await Promise.all(workers);
}

// ── HTTP Server ──────────────────────────────────────────────

// Health
fastify.get('/notification/health', async () => ({
  status: 'ok',
  kafka: kafkaConnected ? 'connected' : 'disconnected',
  timestamp: new Date().toISOString(),
}));

// Logs
fastify.get(
  '/notification/logs', 
  { preHandler: [(fastify as any).authenticate, requireRole('admin')] },
  async (req, reply) => {
  const logs = await NotificationLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  return reply.send({ success: true, data: { logs } });
});

// ── In-app notifications API (per user) ───────────────────────

fastify.get('/notification/me', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
  const { limit = 30, before } = req.query as { limit?: string | number; before?: string };
  const items = await InAppNotification.findMany({
    where: { userId: req.user.sub, ...(before ? { createdAt: { lt: new Date(before) } } : {}) },
    orderBy: { createdAt: 'desc' },
    take: Math.min(Number(limit) || 30, 100),
  });
  const unread = await InAppNotification.count({ where: { userId: req.user.sub, readAt: null } });
  return reply.send({ success: true, data: { items, unread } });
});

fastify.get('/notification/me/unread-count', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
  const unread = await InAppNotification.count({ where: { userId: req.user.sub, readAt: null } });
  return reply.send({ success: true, data: { unread } });
});

fastify.post('/notification/me/read', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
  const ids = Array.isArray(req.body?.ids) ? (req.body.ids as unknown[]).filter((x): x is string => typeof x === 'string').slice(0, 200) : null;
  const res = await InAppNotification.updateMany({
    where: { userId: req.user.sub, readAt: null, ...(ids ? { id: { in: ids } } : {}) },
    data: { readAt: new Date() },
  });
  return reply.send({ success: true, data: { marked: res.count } });
});

// Housekeeping: keep 90 days of in-app notifications
setInterval(() => {
  InAppNotification.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 90 * 86400_000) } } }).catch(() => {});
}, 24 * 3600_000).unref();

// ── Bootstrap ─────────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  transporter = createTransporter();
  const PORT = Number(process.env.NOTIFICATION_PORT ?? 4005);
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  
  // ── WebSocket Security Fix (JWT Verification) ──────────
  (fastify as any).io.on('connection', async (socket: any) => {
    try {
      const cookieHeader: string = socket.handshake.headers.cookie ?? '';
      const cookies = (fastify as any).parseCookie(cookieHeader) as Record<string, string>;
      // Only cookie / auth payload — never the query string (it ends up in logs)
      const token = cookies.agrilink_access || socket.handshake.auth?.token;

      if (!token) return socket.disconnect(true);

      const decoded: any = fastify.jwt.verify(token);
      const userId = decoded.sub;

      if (!userId || decoded.type === 'refresh') return socket.disconnect(true);

      socket.join(`user:${userId}`);
      fastify.log.info({ userId, socketId: socket.id }, '[ws] Authenticated ✓');

      socket.on('disconnect', () => {
        fastify.log.info({ socketId: socket.id, userId }, '[ws] Disconnected');
      });
    } catch (err: any) {
      socket.disconnect(true);
    }
  });

  fastify.log.info(`📬 Notification service running on port ${PORT}`);
  await startKafkaConsumer();
}

bootstrap().catch((err) => {
  console.error('[boot] Fatal:', err);
  process.exit(1);
});
