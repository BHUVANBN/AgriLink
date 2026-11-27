import './config.js';
/**
 * AgriLink Auth Service — Main Entry Point
 * Port: 4001
 *
 * Routes:
 *   POST   /auth/register/farmer
 *   POST   /auth/register/supplier
 *   POST   /auth/verify-otp
 *   POST   /auth/resend-otp
 *   POST   /auth/login
 *   POST   /auth/refresh
 *   POST   /auth/logout
 *   POST   /auth/forgot-password
 *   POST   /auth/reset-password
 *   POST   /auth/change-password        (auth)
 *   GET    /auth/me                     (auth)
 *   PUT    /auth/me                     (auth)
 *   GET    /auth/introspect             (auth) — service-to-service
 *   DELETE /auth/sessions/all           (auth)
 *   GET    /auth/admin/users            (admin)
 *   GET    /auth/admin/users/:id        (admin)
 *   GET    /auth/admin/kyc-queue        (admin)
 *   POST   /auth/admin/kyc/:id/decide   (admin)
 *   POST   /auth/admin/users/:id/suspend (admin)
 *   POST   /auth/admin/users/:id/reactivate (admin)
 *   GET    /auth/admin/stats            (admin)
 *   GET    /auth/health
 */

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyJwt from '@fastify/jwt';
import FastifyCookie from '@fastify/cookie';
import FastifyHelmet from '@fastify/helmet';
import FastifyRateLimit from '@fastify/rate-limit';
import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';

import { registerRoutes } from './routes/register.js';
import { otpRoutes } from './routes/otp.js';
import { loginRoutes } from './routes/login.js';
import { refreshRoutes } from './routes/refresh.js';
import { passwordRoutes } from './routes/password.js';
import { profileRoutes } from './routes/profile.js';
import { adminRoutes } from './routes/admin.js';
import { connectKafka, disconnectKafka, initOutbox } from './services/kafka.producer.js';
import { registerMetrics } from '@agrilink/platform';
import { prisma } from './models/User.js';
import { connectKafkaConsumer, disconnectKafkaConsumer } from './services/kafka.consumer.js';
import { getRedis } from './services/redis.service.js';
import { makeAuthMiddleware } from '@agrilink/auth-middleware';
import { internalRoutes } from './routes/internal.js';

// ── Fastify Instance ──────────────────────────────────────────

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    transport: process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
      : undefined,
  },
  trustProxy: true,            // Nginx sits in front
  requestTimeout: 30_000,
});

// ── Global Error Handler ─────────────────────────────────────

fastify.setErrorHandler(async (error: any, _req, reply) => {
  fastify.log.error({ err: error }, 'Unhandled error');

  // zod .parse() failures are client errors, not server errors
  if (error?.name === 'ZodError') {
    return reply.status(400).send({ success: false, error: 'Validation error', details: error.flatten?.() ?? error.issues });
  }
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
      retryAfter: error.message,
    });
  }
  return reply.status(error.statusCode ?? 500).send({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message,
  });
});

fastify.setNotFoundHandler((_req, reply) => {
  reply.status(404).send({ success: false, error: 'Route not found' });
});

// ── Plugins ───────────────────────────────────────────────────

// Security headers
await fastify.register(FastifyHelmet, {
  contentSecurityPolicy: false, // Managed by Nginx
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

// CORS
await fastify.register(FastifyCors, {
  origin: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
});

// Cookies (HttpOnly, Secure, SameSite)
await fastify.register(FastifyCookie, {
  secret: process.env.COOKIE_SECRET!,
  hook: 'onRequest',
});

// Global rate limit (per client IP; Nginx forwards the real IP, trustProxy=true).
// Backed by Redis so limits are shared across replicas.
await fastify.register(FastifyRateLimit, {
  max: Number(process.env.AUTH_RATE_LIMIT_PER_MIN ?? 300),
  timeWindow: '1m',
  redis: getRedis(),
  skipOnError: true,
  keyGenerator: (req) => req.ip,
});

// Swagger Documentation Engine
await fastify.register(FastifySwagger, {
  openapi: {
    info: {
      title: 'AgriLink Auth Service API',
      description: 'Centralized authentication, role management, and audit tracking for the AgriLink platform.',
      version: '2.0.0',
    },
    servers: [{ url: 'http://localhost:8080/auth' }],
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

// ── JWT & Cookie Setup ─────────────────────────────────────────

// JWT
await fastify.register(FastifyJwt, {
  secret: process.env.JWT_ACCESS_SECRET!,
  cookie: {
    cookieName: 'agrilink_access',
    signed: false,
  },
});

// ── Auth Decorator ─────────────────────────────────────────────
// Shared middleware: signature + expiry + Redis-backed revocation check.
fastify.decorate('authenticate', makeAuthMiddleware(fastify, { redis: getRedis() }));

// ── Metrics (GET /metrics, internal network only) ─────────────
registerMetrics(fastify, 'auth');

// ── Routes ────────────────────────────────────────────────────

await fastify.register(async (app) => {
  // Health
  app.get('/health', async () => ({
    status: 'ok',
    service: 'auth',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  }));

  // ── Auth routes ────────────────────────────────────────────
  await app.register(registerRoutes);
  await app.register(otpRoutes);
  await app.register(loginRoutes);
  await app.register(refreshRoutes);
  await app.register(passwordRoutes);
  await app.register(profileRoutes);

  // ── Admin routes (prefixed + role-guarded) ────────────────
  await app.register(adminRoutes, { prefix: '/admin' });

  // ── Internal service-to-service routes (blocked at Nginx) ─
  await app.register(internalRoutes, { prefix: '/internal' });

}, { prefix: '/auth' });

// ── Shutdown ──────────────────────────────────────────────────

const gracefulShutdown = async (signal: string) => {
  fastify.log.info(`[shutdown] Received ${signal}`);
  await fastify.close();

  await disconnectKafka();
  await disconnectKafkaConsumer();
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ── Bootstrap ─────────────────────────────────────────────────

async function bootstrap() {
  // Map specific env vars to globals for components/Prisma
  if (process.env.DATABASE_URL_AUTH) {
    process.env.DATABASE_URL = process.env.DATABASE_URL_AUTH;
  }

  // Validate required env vars
  const required = [
    'JWT_ACCESS_SECRET', 
    'JWT_REFRESH_SECRET', 
    'DATABASE_URL_AUTH', 
    'REDIS_URL', 
    'COOKIE_SECRET',
    'KAFKA_BROKERS',
    'INTERNAL_API_KEY'
  ];
  const missing = required.filter(k => !process.env[k]);
  if (missing.length > 0) {
    console.error(`[boot] Missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
  }



  // Durable events: anything Kafka can't take right now is retried from the DB
  initOutbox(prisma);
  // Connect Kafka (non-fatal)
  await connectKafka();
  await connectKafkaConsumer();

  // Start server
  const PORT = Number(process.env.AUTH_PORT ?? 4001);
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  fastify.log.info(`🔐 Auth service running on http://0.0.0.0:${PORT}`);
}

bootstrap().catch((err) => {
  console.error('[boot] Fatal error:', err);
  process.exit(1);
});
