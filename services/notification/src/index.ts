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
 *
 * Topics consumed:
 *   order.placed, order.status.updated
 *   kyc.submitted, kyc.approved, kyc.rejected
 *   land.agreement.created, land.agreement.signed
 *   notification.send  (generic, any channel)
 *   user.registered    (welcome email)
 */

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyJwt from '@fastify/jwt';
import FastifyCookie from '@fastify/cookie';
import { makeAuthMiddleware, requireRole } from '@agrilink/auth-middleware';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import nodemailer, { Transporter } from 'nodemailer';
import { withRetry } from './utils/retry.js';

import { getTemplate } from './templates/email.templates.js';
import { getSmsText } from './templates/sms.templates.js';
import { NotificationLog } from './models/NotificationLog.js';
import { getUsersForBroadcast } from './services/auth.js';
import fastifyIO from 'fastify-socket.io';
import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';

// ── WebSockets ────────────────────────────────────────────────


// ── Config ────────────────────────────────────────────────────

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    transport: process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
});

// JWT & Cookie for Auth Middleware
await fastify.register(FastifyCookie, {
  secret: process.env.COOKIE_SECRET ?? process.env.JWT_ACCESS_SECRET ?? 'cookie-secret-dev',
  hook: 'onRequest',
});

await fastify.register(FastifyJwt, {
  secret: process.env.JWT_ACCESS_SECRET!,
});

// Register the standard auth decorator
fastify.decorate('authenticate', makeAuthMiddleware(fastify));

await fastify.register(fastifyIO as any, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// [Removed fastify.ready() block here, will move to bootstrap]

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
] as const;

const FROM_EMAIL = process.env.SMTP_FROM ?? 'AgriLink <noreply@agrilink.app>';
const MAX_RETRIES = 3;

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
      // BUG-006 fix: validate TLS in production
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
    pool: true,        // Keep connections alive
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

  // BUG-005 fix: correct Fast2SMS transactional route
  try {
    const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        route: 'q',            // Transactional (not promotional)
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

// ── Retry Helper ──────────────────────────────────────────────



// ── Core Dispatcher ───────────────────────────────────────────

async function dispatch(
  topic: string,
  eventData: any
): Promise<void> {
  const { userId, email, phone, channels } = eventData;

  // Determine which channels to dispatch based on topic + explicit channels field
  const sendEmail = email && (channels === undefined || (channels as string[]).includes('email'));
  const sendSMS = phone && (channels === undefined || (channels as string[]).includes('sms'));
  const sendWeb = userId && (channels === undefined || (channels as string[]).includes('web') || true); // Default to web if userId present

  // For pure metadata events (login tracking etc.), skip
  if (!sendEmail && !sendSMS && !sendWeb) return;

  // Render templates
  const emailTemplate = sendEmail ? getTemplate(topic, eventData) : null;
  const smsText = sendSMS ? getSmsText(topic, eventData) : null;

  // ── Web/Socket Dispatch ─────────────────────────────────────
  if (sendWeb) {
    const payload = {
      topic,
      id: Math.random().toString(36).slice(2, 11),
      timestamp: new Date().toISOString(),
      subject: emailTemplate?.subject || eventData.subject || 'AgriLink Update',
      body: eventData.body || smsText || emailTemplate?.text || 'New update available',
      data: eventData.data || eventData,
    };
    (fastify as any).io.to(`user:${userId}`).emit('notification', payload);
    fastify.log.info({ topic, userId }, '[ws] Real-time notification emitted');
  }

  // Skip if both templates are empty
  if (!emailTemplate && !smsText) {
    fastify.log.debug(`[notify] No template for topic: ${topic}`);
    return;
  }

  // ── Dispatch in parallel ─────────────────────────────────────
  const jobs: Promise<void>[] = [];

  // Email
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

      if (result) {
        fastify.log.info({ topic, to: email, messageId: result.messageId }, '[email] Sent ✓');
      } else {
        fastify.log.error({ topic, to: email, error }, '[email] Failed after retries ✗');
      }
    })());
  }

  // SMS
  if (smsText && phone) {
    jobs.push((async () => {
      const { result, error, attempts } = await withRetry(() => {
        const p = sendSms(phone, smsText);
        return p.then(r => {
          if (!r.success) throw new Error(r.error ?? 'SMS failed');
          return r;
        });
      });

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

      if (result) {
        fastify.log.info({ topic, phone }, '[sms] Sent ✓');
      } else {
        fastify.log.error({ topic, phone, error }, '[sms] Failed after retries ✗');
      }
    })());
  }

  await Promise.allSettled(jobs);
}

// ── Kafka Setup ───────────────────────────────────────────────

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
  connectionTimeout: 3000,
  requestTimeout: 5000,
  retry: {
    initialRetryTime: 300,
    retries: 2, // Fast fail — don't block startup
  },
});

const consumer: Consumer = kafka.consumer({
  groupId: 'notification-group-v2',
  sessionTimeout: 30_000,
  heartbeatInterval: 3_000,
});

let kafkaConnected = false;

async function startKafkaConsumer(): Promise<void> {
  try {
    await consumer.connect();
    kafkaConnected = true;
    fastify.log.info('[kafka] Consumer connected ✓');

    await consumer.subscribe({ topics: [...TOPICS], fromBeginning: false });

    await consumer.run({
      autoCommit: true,
      autoCommitInterval: 5000,
      eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
        const raw = message.value?.toString();
        if (!raw) return;

        let event: any;
        try {
          event = JSON.parse(raw);
        } catch (err) {
          fastify.log.error({ topic, err }, '[kafka] Failed to parse message');
          return;
        }

        fastify.log.info(
          { topic, partition, eventId: event.eventId, offset: message.offset },
          '[kafka] Processing event'
        );

        if (topic === 'system.broadcast') {
          const { targetRole, subject, body, priority } = event.data;
          const users = await getUsersForBroadcast(targetRole);
          fastify.log.info({ targetRole, userCount: users.length }, '[broadcast] Resolved target segment');
          
          await Promise.allSettled(users.map(u => 
            dispatch('notification.send', {
               userId: u.id,
               email: u.email,
               phone: u.phone,
               subject,
               body,
               channels: ['email', 'web'], // Standard broadcast channels
               priority
            })
          ));
        } else {
          await dispatch(topic, event.data ?? event).catch((err: any) => {
            fastify.log.error({ topic, err: err.message }, '[kafka] dispatch error');
          });
        }
      },
    });

    fastify.log.info(`[kafka] Subscribed to topics: ${TOPICS.join(', ')}`);
  } catch (err: any) {
    kafkaConnected = false;
    fastify.log.warn({ err: err.message }, '[kafka] Consumer failed to connect (non-fatal) — will not receive events');
  }
}

// ── HTTP Server (health + admin + streaming) ──────────────────────────────

await fastify.register(FastifyCors, { origin: false }); // Internal only

// Health
fastify.get('/notification/health', async () => ({
  status: 'ok',
  service: 'notification',
  version: '2.0.0',
  kafka: kafkaConnected ? 'connected' : 'disconnected',
  topics: TOPICS,
  timestamp: new Date().toISOString(),
}));

// Get recent notification logs (Admin only)
fastify.get(
  '/notification/logs', 
  { preHandler: [(fastify as any).authenticate, requireRole('admin')] },
  async (req, reply) => {
  const { topic, status, limit = 50 } = req.query as any;
  const filter: Record<string, any> = {};
  if (topic) filter.topic = topic;
  if (status) filter.status = status;

  const logs = await NotificationLog.findMany({
    where: filter,
    orderBy: { createdAt: 'desc' },
    take: Number(limit)
  });

  const stats = await NotificationLog.groupBy({
    by: ['channel', 'status'],
    _count: true
  });

  return reply.send({ success: true, data: { logs, stats } });
});

// Get failed notifications (Admin only)
fastify.get(
  '/notification/failed', 
  { preHandler: [(fastify as any).authenticate, requireRole('admin')] },
  async (_req, reply) => {
  const failed = await NotificationLog.findMany({
    where: { status: 'failed' },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
  return reply.send({ success: true, data: { count: failed.length, items: failed } });
});

// ── Graceful Shutdown ─────────────────────────────────────────

const gracefulShutdown = async (signal: string) => {
  fastify.log.info(`[shutdown] ${signal} received`);
  if (kafkaConnected) await consumer.disconnect();
  await fastify.close();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ── Bootstrap ─────────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  // Init email transporter
  transporter = createTransporter();

  // Verify SMTP connection
  try {
    await transporter.verify();
    fastify.log.info('[smtp] Email transporter verified ✓');
  } catch (err: any) {
    fastify.log.warn({ err: err.message }, '[smtp] SMTP verify failed — emails may not send');
  }

  // Start HTTP server FIRST so health checks work
  const PORT = Number(process.env.NOTIFICATION_PORT ?? 4005);
  fastify.log.info({ port: PORT }, '[boot] Starting Fastify listen...');
  
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  
  // Set up WebSocket handlers after listen
  (fastify as any).io.on('connection', (socket: any) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      socket.join(`user:${userId}`);
      fastify.log.info({ userId, socketId: socket.id }, '[ws] User joined room');
    }
    socket.on('disconnect', () => {
      fastify.log.info({ socketId: socket.id }, '[ws] Disconnected');
    });
  });

  fastify.log.info(`📬 Notification service running on http://0.0.0.0:${PORT}`);

  // Then try Kafka (non-fatal)
  await startKafkaConsumer();
}

bootstrap().catch((err) => {
  console.error('[boot] Fatal:', err);
  process.exit(1);
});
