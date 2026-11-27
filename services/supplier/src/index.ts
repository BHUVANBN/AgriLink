import './config.js';

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyJwt from '@fastify/jwt';
import FastifyMultipart from '@fastify/multipart';
import FastifyRateLimit from '@fastify/rate-limit';
import FastifyCookie from '@fastify/cookie';
import { makeAuthMiddleware, requireRole } from '@agrilink/auth-middleware';
import { PrismaClient } from '../prisma/client/index.js';
import { Kafka } from 'kafkajs';
import { createOutbox, registerMetrics, superviseConsumer } from '@agrilink/platform';
import { Redis } from 'ioredis';
import { z } from 'zod';
import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';
import { v2 as cloudinary } from 'cloudinary';
import type { ProductDto, ProductCategory } from '@agrilink/types';
import { presentProfile, toPrivateRef, uploadPrivate, signedUrlFor } from './utils/documents.js';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: any;
  }
}
// ── Bootstrap ─────────────────────────────────────────────────

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
      url: process.env.DATABASE_URL_SUPPLIER
    }
  }
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ── Kafka Configuration ──────────────────────────────────────

const kafka = new Kafka({
  clientId: 'supplier-service',
  brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'supplier-group' });

// ── Durable event publishing (outbox: retried from the DB if Kafka is down) ──
let producerReady = false;
async function sendRaw(topic: string, value: string) {
  if (!producerReady) { await producer.connect(); producerReady = true; }
  try {
    await producer.send({ topic, messages: [{ value }] });
  } catch (err) {
    producerReady = false;
    throw err;
  }
}
const outbox = createOutbox({ service: 'supplier', prisma, send: sendRaw });
outbox.start();
superviseConsumer(consumer, () => startKafkaConsumer(), console);
async function publishViaOutbox(args: { topic: string; messages: { value: string | Buffer | null }[] }) {
  for (const m of args.messages) if (m.value != null) await outbox.publish(args.topic, String(m.value));
}

async function startKafka() {
  await Promise.all([producer.connect(), consumer.connect()]);
  console.log('✅ Kafka Connected');
}

// ── Plugins ───────────────────────────────────────────────────

await fastify.register(FastifyCors, {
  origin: process.env.CORS_ORIGINS?.split(',') ?? ['http://localhost:3000'],
  credentials: true,
});

await fastify.register(FastifyCookie, {
  secret: process.env.COOKIE_SECRET ?? process.env.JWT_ACCESS_SECRET ?? 'cookie-secret-dev',
  hook: 'onRequest',
});

await fastify.register(FastifyJwt, {
  secret: process.env.JWT_ACCESS_SECRET!,
});

await fastify.register(FastifyMultipart, {
  limits: { fileSize: 20 * 1024 * 1024, files: 5 }, // 20MB per file
});

await fastify.register(FastifyRateLimit, {
  global: true, max: 200, timeWindow: '1m',
});

// Swagger Documentation Engine
await fastify.register(FastifySwagger, {
  openapi: {
    info: {
      title: 'AgriLink Supplier Service API',
      description: 'Handles supplier profiles, inventory management, and warehouse stock tracking.',
      version: '2.0.0',
    },
    servers: [{ url: 'http://localhost:8080/supplier' }],
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

// Register shared auth middleware
const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', { maxRetriesPerRequest: 2 });
redis.on('error', () => {});
fastify.decorate('authenticate', makeAuthMiddleware(fastify, { redis }));
registerMetrics(fastify, 'supplier');

fastify.setErrorHandler(async (error: any, _req, reply) => {
  fastify.log.error({ err: error }, 'Unhandled error');

  if (error instanceof z.ZodError) {
    return reply.status(422).send({
      success: false,
      error: 'Validation error',
      details: error.flatten().fieldErrors,
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

// ── Schemas ───────────────────────────────────────────────────


export const PRODUCT_CATEGORIES = ['seeds', 'fertilizers', 'pesticides', 'tools', 'equipment', 'feed', 'other'] as const;

const CreateProductSchema = z.object({
  name: z.string().min(2).max(200),
  // Fixed set so marketplace category filters always match
  category: z.preprocess((v) => (typeof v === 'string' ? v.trim().toLowerCase() : v), z.enum(PRODUCT_CATEGORIES)),
  description: z.string().min(10),
  price: z.number().int().positive(),   // paise
  mrp: z.number().int().positive(),
  unit: z.string(),
  stockQuantity: z.number().int().min(0).default(0),
  reorderThreshold: z.number().int().min(0).default(5),
  tags: z.array(z.string()).default([]),
  specifications: z.record(z.any()).optional(),
  weight: z.number().optional(),
});

const UpdateProductSchema = CreateProductSchema.partial().extend({
  // Previously missing → zod stripped it and products could never go live
  status: z.enum(['active', 'inactive', 'draft']).optional(),
  stockNote: z.string().max(200).optional(),
});

const DocRef = z.string().max(2048).refine(
  (v) => v.startsWith('cloudinary-private://') || /^https:\/\//.test(v),
  'Must be an uploaded document',
);
const KycSubmitSchema = z.object({
  businessCertUrl: DocRef.optional(),
  tradeLicenseUrl: DocRef.optional(),
  ownerIdProofUrl: DocRef.optional(),
  gstCertUrl: DocRef.optional(),
  businessType: z.string().optional(),
  yearsInOperation: z.string().optional(),
  gstNumber: z.string().optional(),
});

// ── Helper ─────────────────────────────────────────────────────

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 100);
}

// ── Routes ────────────────────────────────────────────────────

await fastify.register(async (app) => {

  // Health
  app.get('/health', async () => ({ status: 'ok', service: 'supplier' }));

  // ─ Profile ────────────────────────────────────────────────

  app.get('/profile', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const supplier = await prisma.supplier.findUnique({
      where: { userId: req.user.sub },
    });
    return reply.send({ 
      success: true, 
      data: presentProfile(supplier) ?? { userId: req.user.sub, kycStatus: 'NOT_STARTED', companyName: req.user.name ?? 'New Supplier' } 
    });
  });

  app.put('/profile', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const ProfileUpdateSchema = z.object({
      companyName: z.string().min(1).max(200).optional(),
      phone: z.string().max(15).optional(),
      upiId: z.string().max(50).optional(),
      gstNumber: z.string().max(20).optional(),
      address: z.string().max(500).optional(),
      businessType: z.string().max(100).optional(),
      yearsInOperation: z.string().max(10).optional(),
      productCategories: z.array(z.string()).optional(),
      taxRate: z.number().min(0).max(1).optional(),
      taxInclusive: z.boolean().optional(),
    });
    const result = ProfileUpdateSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: result.error.flatten() });
    }
    const updated = await prisma.supplier.update({
      where: { userId: req.user.sub },
      // Only fields actually sent are changed (previously every profile edit
      // silently reset the supplier's GST config to 18% inclusive)
      data: result.data,
    });
    return reply.send({ success: true, data: presentProfile(updated) });
  });

  // ─ KYC ────────────────────────────────────────────────────

  // BUG-009 fix: KYC must be submitted explicitly; never auto-approved
  app.post('/kyc/submit', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const result = KycSubmitSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: result.error.flatten() });
    }

    // Lazy initialization of supplier profile if Kafka was slow or failed
    const supplier = await prisma.supplier.upsert({
      where: { userId: req.user.sub },
      update: {},
      create: {
        userId: req.user.sub,
        companyName: req.user.name ?? result.data.businessType ?? 'New Supplier',
        email: req.user.email ?? `${req.user.sub.slice(0, 8)}@agrilink.internal`,
        phone: req.user.phone ?? '0000000000',
        address: { text: "Pending full entry" },
        kycStatus: 'NOT_STARTED'
      }
    });

    if (supplier.kycStatus === 'APPROVED') {
      return reply.status(400).send({ success: false, error: 'KYC already approved' });
    }

    // A re-submitted form may echo back the short-lived signed link we showed
    // it; keep the stored private reference in that case.
    const docs: Record<string, string | undefined> = {};
    for (const f of ['businessCertUrl', 'tradeLicenseUrl', 'ownerIdProofUrl', 'gstCertUrl'] as const) {
      const incoming = result.data[f];
      const stored = (supplier as any)[f] as string | null;
      docs[f] = incoming && !incoming.startsWith('cloudinary-private://') && stored?.startsWith('cloudinary-private://')
        ? stored
        : incoming;
    }
    const updated = await prisma.supplier.update({
      where: { userId: req.user.sub },
      data: {
        ...result.data,
        ...docs,
        kycStatus: 'PENDING',
        kycSubmittedAt: new Date(),
      },
    });

    // Publish event so Auth service can update roles and Admin can see manifest
    try {
      await publishViaOutbox({
        topic: 'kyc.submitted',
        messages: [{
          value: JSON.stringify({
            eventId: `${Date.now()}`,
            topic: 'kyc.submitted',
            source: 'supplier-service',
            timestamp: new Date().toISOString(),
            data: {
              userId: req.user.sub,
              email: req.user.email,
              role: 'supplier',
              status: 'pending',
              submittedAt: new Date().toISOString(),
            },
          }),
        }],
      });
    } catch (err: any) {
      fastify.log.warn(`[kafka] kyc.submitted event failed (non-fatal):`, err.message);
    }

    return reply.send({
      success: true,
      data: {
        kycStatus: updated.kycStatus,
        message: 'KYC documents submitted successfully. Admin review pending.',
      },
    });
  });

  // Admin/Internal: Fetch specific user KYC details
  app.get('/:userId/kyc', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const { userId } = req.params as { userId: string };
    
    // Authorization: Admin or the user themselves
    if (req.user.role !== 'admin' && req.user.sub !== userId) {
      return reply.status(403).send({ success: false, error: 'Unauthorized manifest access' });
    }

    const supplier = await prisma.supplier.findUnique({
      where: { userId },
    });

    if (!supplier) {
      return reply.status(404).send({ success: false, error: 'Supplier node not found' });
    }

    return reply.send({ success: true, data: supplier });
  });

  // ─ Public Product Catalog (no auth required) ─────────────
  // Used by the marketplace service to browse active products

  // ─ Price quote (used by Marketplace at checkout) ──────────
  // The marketplace NEVER trusts prices from the browser — it asks here.
  // Read-only and public: it only exposes data the catalogue already shows.
  const QuoteSchema = z.object({
    items: z.array(z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1).max(10_000),
    })).min(1).max(100),
  });

  app.post('/products/public/quote', async (req: any, reply) => {
    const parsed = QuoteSchema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ success: false, error: parsed.error.flatten() });

    const ids = [...new Set(parsed.data.items.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: ids } },
      include: {
        supplier: { select: { id: true, userId: true, companyName: true, kycStatus: true, taxRate: true, taxInclusive: true } },
      },
    });
    const byId = new Map(products.map((p) => [p.id, p]));

    const lines = parsed.data.items.map(({ productId, quantity }) => {
      const p = byId.get(productId);
      if (!p) return { productId, quantity, ok: false, reason: 'NOT_FOUND' as const };
      if (p.status !== 'active') return { productId, quantity, ok: false, reason: 'UNAVAILABLE' as const, name: p.name };
      if (p.supplier.kycStatus !== 'APPROVED') return { productId, quantity, ok: false, reason: 'SUPPLIER_UNVERIFIED' as const, name: p.name };
      if (p.stockQuantity < quantity) {
        return { productId, quantity, ok: false, reason: 'OUT_OF_STOCK' as const, name: p.name, available: p.stockQuantity };
      }
      return {
        productId,
        quantity,
        ok: true,
        name: p.name,
        unit: p.unit,
        image: p.images?.[0] ?? null,
        supplierId: p.supplierId,
        pricePaise: p.price,
        totalPaise: p.price * quantity,
      };
    });

    const suppliers = Object.fromEntries(products.map((p) => [p.supplierId, {
      id: p.supplier.id,
      userId: p.supplier.userId,
      companyName: p.supplier.companyName,
      taxRate: p.supplier.taxRate ?? 0.18,
      taxInclusive: p.supplier.taxInclusive ?? true,
    }]));

    return reply.send({ success: true, data: { lines, suppliers } });
  });

  app.get('/products/public', async (req: any, reply) => {
    const { page = 1, limit = 12, category, search, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const where: any = { status: 'active' };
    if (category) where.category = category;
    if (minPrice) where.price = { ...where.price, gte: Number(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: Number(maxPrice) };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    const validSortFields: Record<string, boolean> = { createdAt: true, price: true, name: true };
    const orderByField = validSortFields[sortBy] ? sortBy : 'createdAt';

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { [orderByField]: sortOrder === 'asc' ? 'asc' : 'desc' },
      }),
      prisma.product.count({ where }),
    ]);
    return reply.send({
      success: true,
      data: {
        items,
        pagination: {
          page: Number(page), limit: Number(limit), total,
          pages: Math.ceil(total / Number(limit)),
          hasNext: Number(page) * Number(limit) < total,
          hasPrev: Number(page) > 1,
        },
      },
    });
  });

  app.get('/products/public/:id', async (req: any, reply) => {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where: { OR: [{ id }, { slug: id }], status: 'active' },
    });
    if (!product) return reply.status(404).send({ success: false, error: 'Product not found' });
    const supplierInfo = await prisma.supplier.findUnique({
      where: { id: product.supplierId },
      select: { 
        id: true, userId: true, companyName: true, kycStatus: true, address: true, 
        businessType: true, taxRate: true, taxInclusive: true 
      },
    });
    return reply.send({ success: true, data: { ...product, supplier: supplierInfo } });
  });

  app.get('/public/supplier/:id', async (req: any, reply) => {
     const supplier = await prisma.supplier.findUnique({
        where: { id: req.params.id },
        select: { 
          id: true, companyName: true, kycStatus: true, address: true, 
          businessType: true, taxRate: true, taxInclusive: true 
        },
     });
     if (!supplier) return reply.status(404).send({ success: false, error: 'Supplier not found' });
     return reply.send({ success: true, data: supplier });
  });

  // ─ Products ───────────────────────────────────────────────

  app.get('/products', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const { page = 1, limit = 20, status, category } = req.query as any;
    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const where: any = { supplierId: supplier.id };
    if (status) where.status = status;
    if (category) where.category = category;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return reply.send({
      success: true,
      data: {
        items: products,
        pagination: {
          page: Number(page), limit: Number(limit), total,
          pages: Math.ceil(total / Number(limit)),
          hasNext: Number(page) * Number(limit) < total,
          hasPrev: Number(page) > 1,
        },
      },
    });
  });

  app.post('/products', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const result = CreateProductSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: result.error.flatten() });
    }

    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });

    if (supplier.kycStatus !== 'APPROVED') {
      return reply.status(403).send({
        success: false,
        error: 'KYC must be approved before listing products',
      });
    }

    const data = result.data;
    if (data.price > data.mrp) {
      return reply.status(400).send({ success: false, error: 'Price cannot be higher than MRP' });
    }
    const baseSlug = slugify(data.name);
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const sku = `${supplier.id.slice(0, 8).toUpperCase()}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        ...data,
        supplierId: supplier.id,
        slug,
        sku,
        images: [],
        tags: data.tags,
        status: 'draft',
      },
    });

    // Log inventory entry
    await prisma.inventoryLog.create({
      data: {
        productId: product.id,
        supplierId: supplier.id,
        change: data.stockQuantity,
        reason: 'manual',
        previousStock: 0,
        newStock: data.stockQuantity,
        notes: 'Initial stock on product creation',
      },
    });

    return reply.status(201).send({ success: true, data: product });
  });

  // ─ Bulk import (CSV parsed in the browser, validated here per row) ──
  // Creates products as drafts so the supplier can review before going live.
  app.post('/products/bulk', { preHandler: [fastify.authenticate], config: { rateLimit: { max: 5, timeWindow: '1m' } } }, async (req: any, reply) => {
    const rows = Array.isArray(req.body?.rows) ? req.body.rows : null;
    if (!rows || rows.length === 0) return reply.status(400).send({ success: false, error: 'No rows to import' });
    if (rows.length > 500) return reply.status(400).send({ success: false, error: 'Maximum 500 rows per import' });

    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });
    if (supplier.kycStatus !== 'APPROVED') {
      return reply.status(403).send({ success: false, error: 'KYC must be approved before listing products' });
    }

    const created: { row: number; id: string; name: string }[] = [];
    const errors: { row: number; error: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i] ?? {};
      const rupees = (v: unknown) => (v === undefined || v === '' ? undefined : Math.round(Number(v) * 100));
      const parsed = CreateProductSchema.safeParse({
        name: r.name,
        category: r.category,
        description: r.description,
        price: rupees(r.price),
        mrp: rupees(r.mrp ?? r.price),
        unit: r.unit,
        stockQuantity: r.stockQuantity === undefined || r.stockQuantity === '' ? 0 : Number(r.stockQuantity),
        reorderThreshold: r.reorderThreshold === undefined || r.reorderThreshold === '' ? 5 : Number(r.reorderThreshold),
        tags: typeof r.tags === 'string' && r.tags ? r.tags.split(/[;|]/).map((t: string) => t.trim()).filter(Boolean) : [],
      });
      if (!parsed.success) {
        const f = parsed.error.flatten().fieldErrors;
        errors.push({ row: i + 1, error: Object.entries(f).map(([k, v]) => `${k}: ${(v ?? []).join(', ')}`).join('; ') || 'Invalid row' });
        continue;
      }
      const data = parsed.data;
      if (data.price > data.mrp) {
        errors.push({ row: i + 1, error: 'price cannot be higher than mrp' });
        continue;
      }
      try {
        const baseSlug = slugify(data.name) || 'product';
        let slug = baseSlug;
        let n = 1;
        while (await prisma.product.findUnique({ where: { slug } })) slug = `${baseSlug}-${n++}`;
        const product = await prisma.product.create({
          data: {
            ...data,
            supplierId: supplier.id,
            slug,
            sku: `${supplier.id.slice(0, 8).toUpperCase()}-${Date.now()}-${i}`,
            images: [],
            status: 'draft',
          },
        });
        if (data.stockQuantity > 0) {
          await prisma.inventoryLog.create({
            data: {
              productId: product.id, supplierId: supplier.id, change: data.stockQuantity, reason: 'manual',
              previousStock: 0, newStock: data.stockQuantity, notes: 'Initial stock (bulk import)',
            },
          });
        }
        created.push({ row: i + 1, id: product.id, name: product.name });
      } catch (err: any) {
        errors.push({ row: i + 1, error: 'Could not save this row' });
      }
    }

    return reply.send({ success: true, data: { processed: rows.length, created: created.length, errors, products: created } });
  });

  app.patch('/products/:id', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const { id } = req.params;
    const result = UpdateProductSchema.safeParse(req.body);
    if (!result.success) return reply.status(400).send({ success: false, error: result.error.flatten() });

    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const product = await prisma.product.findFirst({ where: { id, supplierId: supplier.id } });
    if (!product) return reply.status(404).send({ success: false, error: 'Product not found' });

    const { stockNote, ...data } = result.data;

    if (data.status === 'active' && supplier.kycStatus !== 'APPROVED') {
      return reply.status(403).send({ success: false, error: 'KYC must be approved before products can go live' });
    }
    const price = data.price ?? product.price;
    const mrp = data.mrp ?? product.mrp;
    if (price > mrp) {
      return reply.status(400).send({ success: false, error: 'Price cannot be higher than MRP' });
    }

    const stockChanged = data.stockQuantity !== undefined && data.stockQuantity !== product.stockQuantity;
    const updated = await prisma.$transaction(async (tx) => {
      const u = await tx.product.update({ where: { id }, data });
      if (stockChanged) {
        // Every manual stock edit leaves an audit trail
        await tx.inventoryLog.create({
          data: {
            productId: id,
            supplierId: supplier.id,
            change: data.stockQuantity! - product.stockQuantity,
            reason: data.stockQuantity! > product.stockQuantity ? 'restock' : 'adjustment',
            previousStock: product.stockQuantity,
            newStock: data.stockQuantity!,
            notes: stockNote ?? 'Manual update from dashboard',
          },
        });
      }
      return u;
    });
    return reply.send({ success: true, data: updated });
  });

  // Owner view of a single product, any status (drafts included)
  app.get('/products/:id', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });
    const product = await prisma.product.findFirst({ where: { id: req.params.id, supplierId: supplier.id } });
    if (!product) return reply.status(404).send({ success: false, error: 'Product not found' });
    return reply.send({ success: true, data: product });
  });

  // ─ Inventory audit log ─────────────────────────────────────
  app.get('/inventory/logs', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });
    const { productId, limit = 100 } = req.query as { productId?: string; limit?: string | number };
    const logs = await prisma.inventoryLog.findMany({
      where: { supplierId: supplier.id, ...(productId ? { productId } : {}) },
      include: { product: { select: { name: true, sku: true, unit: true } } },
      orderBy: { createdAt: 'desc' },
      take: Math.min(Number(limit) || 100, 500),
    });
    return reply.send({ success: true, data: logs });
  });

  app.delete('/products/:id', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const { id } = req.params as { id: string };
    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const product = await prisma.product.findFirst({ where: { id, supplierId: supplier.id } });
    if (!product) return reply.status(404).send({ success: false, error: 'Product not found' });

    // Soft delete: just mark inactive
    await prisma.product.update({ where: { id }, data: { status: 'inactive' } });
    return reply.send({ success: true, data: { message: 'Product deactivated' } });
  });

  // ─ Image Upload ───────────────────────────────────────────

  app.post('/products/:id/images', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const { id } = req.params;
    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const product = await prisma.product.findFirst({ where: { id, supplierId: supplier.id } });
    if (!product) return reply.status(404).send({ success: false, error: 'Product not found' });

    const file = await req.file();
    if (!file) return reply.status(400).send({ success: false, error: 'No file uploaded' });

    // BUG-035 fix: validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) {
      return reply.status(400).send({ success: false, error: 'Only JPEG/PNG/WebP images allowed' });
    }

    const chunks: Buffer[] = [];
    for await (const chunk of file.file) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    if (buffer.length > 5 * 1024 * 1024) {
      return reply.status(400).send({ success: false, error: 'Image too large (max 5MB)' });
    }

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: `agrilink/products/${product.id}`, quality: 'auto', fetch_format: 'auto' },
        (err, result) => err ? reject(err) : resolve(result)
      ).end(buffer);
    });

    const newImages = [...product.images, uploadResult.secure_url];
    await prisma.product.update({ where: { id }, data: { images: newImages } });

    return reply.send({ success: true, data: { url: uploadResult.secure_url, images: newImages } });
  });

  app.delete('/products/:id/images', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const { id } = req.params;
    const { imageUrl } = req.body as { imageUrl: string };
    
    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const product = await prisma.product.findFirst({ where: { id, supplierId: supplier.id } });
    if (!product) return reply.status(404).send({ success: false, error: 'Product not found' });

    const newImages = product.images.filter((url: string) => url !== imageUrl);
    await prisma.product.update({ where: { id }, data: { images: newImages } });

    // Try to delete from Cloudinary if it's our link
    if (imageUrl.includes('cloudinary.com')) {
       try {
          const parts = imageUrl.split('/');
          const filename = parts[parts.length - 1].split('.')[0];
          const folder = parts.slice(parts.indexOf('agrilink'), parts.length - 1).join('/');
          await cloudinary.uploader.destroy(`${folder}/${filename}`);
       } catch (err) { fastify.log.error(err, 'Cloudinary delete failed'); }
    }

    return reply.send({ success: true, data: { images: newImages } });
  });

  // ─ Analytics & Stats ─────────────────────────────────────────

  app.get('/stats', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Fix: Prisma doesn't support comparing two columns directly in 'where' query
    // We fetch and filter or use a more specific count logic
    const activeProducts = await prisma.product.findMany({
      where: { supplierId: supplier.id, status: 'active' }
    });
    const lowStockCount = activeProducts.filter(p => p.stockQuantity <= p.reorderThreshold).length;

    const [analytics, pendingOrdersCount] = await Promise.all([
      prisma.dailyAnalytics.findMany({
        where: { supplierId: supplier.id, date: { gte: thirtyDaysAgo } },
        orderBy: { date: 'desc' },
      }),
      prisma.supplierOrder.count({
        where: { supplierId: supplier.id, orderStatus: 'PLACED' } // Fixed case
      })
    ]);

    const totalRevenue = analytics.reduce((sum, a) => sum + a.revenuePaise, 0);
    const totalOrders = analytics.reduce((sum, a) => sum + a.orderCount, 0);

    return reply.send({
      success: true,
      data: {
        totalRevenue: totalRevenue / 100, // Return In Rupees for frontend
        activeProducts: activeProducts.length,
        pendingOrders: pendingOrdersCount,
        kycStatus: supplier.kycStatus.toLowerCase(),
        lowStockCount: lowStockCount,
        thirtyDayRevenuePaise: totalRevenue,
        thirtyDayOrders: totalOrders,
        dailyAnalytics: analytics,
      },
    });
  });

  // ─ Orders ─────────────────────────────────────────────────

  app.get('/orders', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const orders = await prisma.supplierOrder.findMany({
      where: { supplierId: supplier.id },
      orderBy: { createdAt: 'desc' },
    });

    return reply.send({ success: true, data: orders });
  });

  app.patch('/orders/:id', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const { id } = req.params;
    const parsedStatus = z.object({
      orderStatus: z.enum(['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED']),
    }).safeParse(req.body);
    if (!parsedStatus.success) return reply.status(400).send({ success: false, error: parsedStatus.error.flatten() });
    const { orderStatus } = parsedStatus.data;
    
    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const order = await prisma.supplierOrder.findFirst({
      where: { id, supplierId: supplier.id }
    });
    if (!order) return reply.status(404).send({ success: false, error: 'Order not found' });

    const ALLOWED: Record<string, string[]> = {
      PLACED: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['PROCESSING', 'SHIPPED', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED', 'RETURNED'],
      DELIVERED: ['RETURNED'],
    };
    const from = String(order.orderStatus).toUpperCase();
    if (!(ALLOWED[from] ?? []).includes(orderStatus)) {
      return reply.status(409).send({ success: false, error: `Cannot move order from ${from} to ${orderStatus}` });
    }

    const updated = await prisma.supplierOrder.update({
      where: { id },
      data: { orderStatus }
    });
    if (orderStatus === 'CANCELLED' && !['CANCELLED', 'SHIPPED', 'DELIVERED', 'RETURNED'].includes(order.orderStatus)) {
      await restockOrder(supplier.id, order.orderNumber, order.items as any[]);
    }

    // ─ Publish Status Update to Kafka (non-fatal) ─────────────
    await publishViaOutbox({
      topic: 'order.status.updated',
      messages: [{ 
        value: JSON.stringify({
          topic: 'order.status.updated',
          source: 'supplier-service',
          data: {
            orderId: updated.orderNumber,
            orderNumber: updated.orderNumber,
            farmerId: updated.farmerId,
            newStatus: orderStatus,
            supplierId: supplier.id,
            updatedAt: updated.updatedAt,
          }
        })
      }]
    }).catch((err) => fastify.log.warn({ err: err.message }, '[kafka] order.status.updated publish failed'));

    return reply.send({ success: true, data: updated });
  });

  // ─ KYC Document Upload ───────────────────────────────────
  // Allows suppliers to upload documents (business cert, trade license, etc.) to Cloudinary
  // and get back a URL to pass to POST /kyc/submit

  app.post('/documents/upload', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const file = await req.file();
    if (!file) return reply.status(400).send({ success: false, error: 'No file uploaded' });

    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.mimetype)) {
      return reply.status(400).send({ success: false, error: 'Only PDF, JPEG, PNG allowed' });
    }

    const chunks: Buffer[] = [];
    for await (const chunk of file.file) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    if (buffer.length > 10 * 1024 * 1024) {
      return reply.status(400).send({ success: false, error: 'File too large (max 10MB)' });
    }

    try {
      // KYC documents (incl. owner ID proof) are stored PRIVATE; the client
      // gets an opaque reference to submit plus a short-lived preview link.
      const safeName = file.filename.split('.')[0].replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
      const result = await uploadPrivate(buffer, `kyc/suppliers/${req.user.sub}`, `${safeName}_${Date.now()}`);
      const ref = toPrivateRef(result);
      return reply.send({
        success: true,
        data: { ref, url: ref, previewUrl: signedUrlFor(ref), format: result.format },
      });
    } catch (err: any) {
      fastify.log.error({ err }, 'Cloudinary upload failed');
      return reply.status(500).send({ success: false, error: 'Upload failed' });
    }
  });


}, { prefix: '/supplier' });

/** Return an order's quantities to stock, with an inventory log entry per line. */
async function restockOrder(supplierId: string, orderNumber: string, items: { productId: string; quantity: number }[] = []) {
  for (const item of items ?? []) {
    try {
      await prisma.$transaction(async (tx) => {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || product.supplierId !== supplierId) return;
        await tx.product.update({ where: { id: product.id }, data: { stockQuantity: { increment: item.quantity } } });
        await tx.inventoryLog.create({
          data: {
            productId: product.id,
            supplierId,
            change: item.quantity,
            reason: 'return',
            referenceId: orderNumber,
            previousStock: product.stockQuantity,
            newStock: product.stockQuantity + item.quantity,
            notes: `Restocked: order ${orderNumber} cancelled`,
          },
        });
      });
    } catch (err) {
      fastify.log.error({ err, productId: item.productId }, 'Restock failed');
    }
  }
}

async function startKafkaConsumer() {
  await consumer.subscribe({
    topics: ['order.placed', 'order.status.updated', 'user.registered', 'kyc.approved', 'kyc.rejected', 'product.rating.updated'],
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const payload = message.value?.toString();
      if (!payload) return;
      let event: any;
      try { event = JSON.parse(payload); } catch { return; }
      const data = event.data || event;

      try {
        // 1. User identity lifecycle
        if (topic === 'user.registered') {
          if (data.role !== 'supplier') return;
          fastify.log.info({ userId: data.userId }, 'Syncing new supplier identity');
          await prisma.supplier.upsert({
            where: { userId: data.userId },
            update: {},
            create: {
              userId: data.userId,
              companyName: data.displayName || 'Unnamed Supplier',
              email: data.email,
              phone: data.phone || '0000000000',
              address: { text: 'Pending profile completion' },
              kycStatus: 'NOT_STARTED'
            }
          });
          return;
        }

        // 2. KYC governance loop
        if (topic === 'kyc.approved' || topic === 'kyc.rejected') {
          if (data.role !== 'supplier') return;
          fastify.log.info({ userId: data.userId, status: topic }, 'Syncing KYC decision from Auth');
          await prisma.supplier.updateMany({
            where: { userId: data.userId },
            data: {
              kycStatus: topic === 'kyc.approved' ? 'APPROVED' : 'REJECTED',
              kycReviewedAt: new Date()
            }
          });
          return;
        }

        // Product rating aggregate computed by the marketplace (idempotent overwrite)
        if (topic === 'product.rating.updated') {
          if (!data.productId) return;
          await prisma.product.updateMany({
            where: { id: data.productId },
            data: { rating: Number(data.rating) || 0, reviewCount: Number(data.reviewCount) || 0 },
          });
          return;
        }

        // 3. Status changes made on the marketplace side (admin / supplier UI there)
        if (topic === 'order.status.updated') {
          if (event.source === 'supplier-service') return; // our own event
          const orderNumber = data.orderNumber;
          if (!orderNumber || !data.newStatus) return;
          const before = await prisma.supplierOrder.findUnique({ where: { orderNumber } });
          await prisma.supplierOrder.updateMany({
            where: { orderNumber },
            data: { orderStatus: data.newStatus },
          });
          // Cancelled before shipping → put the stock back (once)
          if (before && data.newStatus === 'CANCELLED' && !['CANCELLED', 'SHIPPED', 'DELIVERED', 'RETURNED'].includes(before.orderStatus)) {
            await restockOrder(before.supplierId, orderNumber, before.items as any[]);
          }
          return;
        }

        // 4. New paid / COD order → record it, update analytics, take stock
        if (topic === 'order.placed') {
          const { orderNumber, items, supplierId, farmerId, totalAmount, shippingAddress, paymentStatus } = data;
          const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
          if (!supplier) return;

          // Idempotency: Kafka is at-least-once, so a redelivered event must
          // not double-count revenue or double-decrement stock.
          const existing = await prisma.supplierOrder.findUnique({ where: { orderNumber } });
          if (existing) return;

          await prisma.supplierOrder.create({
            data: {
              orderNumber,
              supplierId,
              farmerId,
              items,
              totalPaise: totalAmount,
              paymentStatus: paymentStatus === 'PAID' ? 'PAID' : 'PENDING',
              orderStatus: 'PLACED',
              shippingAddress,
            }
          });

          const today = new Date();
          today.setHours(0, 0, 0, 0);
          await prisma.dailyAnalytics.upsert({
            where: { supplierId_date: { supplierId, date: today } },
            update: { revenuePaise: { increment: totalAmount }, orderCount: { increment: 1 } },
            create: { supplierId, date: today, revenuePaise: totalAmount, orderCount: 1 },
          });

          for (const item of (items ?? []) as { productId: string; quantity: number }[]) {
            try {
              // Atomic, race-free decrement: only succeeds if enough stock remains
              await prisma.$transaction(async (tx) => {
                const product = await tx.product.findUnique({ where: { id: item.productId } });
                if (!product || product.supplierId !== supplierId) return;
                const res = await tx.product.updateMany({
                  where: { id: item.productId, stockQuantity: { gte: item.quantity } },
                  data: { stockQuantity: { decrement: item.quantity } },
                });
                if (res.count === 0) {
                  fastify.log.warn({ productId: item.productId, orderNumber }, 'Oversell: insufficient stock at fulfilment');
                  return;
                }
                await tx.inventoryLog.create({
                  data: {
                    productId: item.productId,
                    supplierId,
                    change: -item.quantity,
                    reason: 'order',
                    previousStock: product.stockQuantity,
                    newStock: product.stockQuantity - item.quantity,
                    notes: `Auto-decremented for order ${orderNumber}`
                  }
                });
              });
            } catch (err) {
              fastify.log.error({ err, productId: item.productId }, 'Failed to decrement inventory');
            }
          }
        }
      } catch (err) {
        fastify.log.error({ err, topic }, 'Kafka message handling failed');
      }
    },
  });
}

async function stopKafka() {
  await Promise.all([producer.disconnect(), consumer.disconnect()]);
}


// ── Start ─────────────────────────────────────────────────────

const PORT = Number(process.env.SUPPLIER_PORT ?? 4003);
await fastify.listen({ port: PORT, host: '0.0.0.0' });
console.log(`🏪 Supplier service running on http://0.0.0.0:${PORT}`);

// Start Kafka
// Kafka may not be ready (or topics may not exist yet on a fresh broker):
// keep retrying in the background instead of leaving the consumer dead.
const runKafka = async (attempt = 1): Promise<void> => {
  try {
    await startKafka();
    await startKafkaConsumer();
  } catch (err) {
    fastify.log.error({ err }, `[kafka] start failed (attempt ${attempt}) — retrying in 10s`);
    await consumer.disconnect().catch(() => {});
    setTimeout(() => { void runKafka(attempt + 1); }, 10_000);
  }
};
void runKafka();

// Graceful shutdown
const shutdown = async () => {
  await stopKafka();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
