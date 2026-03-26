import './config.js';
/**
 * Marketplace Service - Main Entry point
 * Handles Orders, Cart, Payments (Razorpay), Reviews
 */

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import { paymentRoutes } from './routes/payment.js';
import { orderRoutes } from './routes/orders.js';
import { cartRoutes } from './routes/cart.js';
import { productRoutes } from './routes/products.js';
import FastifyJwt from '@fastify/jwt';
import FastifyCookie from '@fastify/cookie';
import { makeAuthMiddleware } from '@agrilink/auth-middleware';
import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';
import FastifyRateLimit from '@fastify/rate-limit';

import { PrismaClient } from '../prisma/client/index.js';

const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    transport: process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
});

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_MARKETPLACE
    }
  }
});
fastify.decorate('prisma', prisma);

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

await fastify.register(FastifyCors, {
  origin: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(','),
  credentials: true,
});

await fastify.register(FastifyRateLimit, {
  global: true,
  max: 100,
  timeWindow: '1m',
});

// Setup cookies & jwt
await fastify.register(FastifyCookie, {
  secret: process.env.COOKIE_SECRET ?? process.env.JWT_ACCESS_SECRET ?? 'cookie-secret-dev',
  hook: 'onRequest',
});

await fastify.register(FastifyJwt, {
  secret: process.env.JWT_ACCESS_SECRET!,
});

// Setup auth middleware
fastify.decorate('authenticate', makeAuthMiddleware(fastify));

// Swagger Documentation Engine
await fastify.register(FastifySwagger, {
  openapi: {
    info: {
      title: 'AgriLink Marketplace Service API',
      description: 'Handles orders, products, carts, and payment processing for the AgriLink platform.',
      version: '2.0.0',
    },
    servers: [{ url: 'http://localhost:8080/marketplace' }],
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

await fastify.register(async (app) => {
  app.get('/health', async () => ({ status: 'ok', service: 'marketplace' }));

  await app.register(productRoutes, { prefix: '/products' });
  await app.register(paymentRoutes, { prefix: '/payment' });
  await app.register(orderRoutes, { prefix: '/orders' });
  await app.register(cartRoutes, { prefix: '/cart' });
}, { prefix: '/marketplace' });

const PORT = Number(process.env.MARKETPLACE_PORT ?? 4004);
await fastify.listen({ port: PORT, host: '0.0.0.0' });
fastify.log.info(`🛒 Marketplace service running on http://0.0.0.0:${PORT}`);
