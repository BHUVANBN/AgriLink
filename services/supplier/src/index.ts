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
import { z } from 'zod';
import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';
import { v2 as cloudinary } from 'cloudinary';
import type { ProductDto, ProductCategory } from '@agrilink/types';

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
fastify.decorate('authenticate', makeAuthMiddleware(fastify));

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


const CreateProductSchema = z.object({
  name: z.string().min(2).max(200),
  category: z.string(),
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

const UpdateProductSchema = CreateProductSchema.partial();

const KycSubmitSchema = z.object({
  businessCertUrl: z.string().url().optional(),
  tradeLicenseUrl: z.string().url().optional(),
  ownerIdProofUrl: z.string().url().optional(),
  gstCertUrl: z.string().url().optional(),
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
    if (!supplier) return reply.status(404).send({ success: false, error: 'Supplier profile not found' });
    return reply.send({ success: true, data: supplier });
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
      data: {
        ...result.data,
        taxRate: result.data.taxRate ?? 0.18, // Default 18% GST if not set
        taxInclusive: result.data.taxInclusive ?? true,
      },
    });
    return reply.send({ success: true, data: updated });
  });

  // ─ KYC ────────────────────────────────────────────────────

  // BUG-009 fix: KYC must be submitted explicitly; never auto-approved
  app.post('/kyc/submit', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const result = KycSubmitSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: result.error.flatten() });
    }

    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });

    if (supplier.kycStatus === 'APPROVED') {
      return reply.status(400).send({ success: false, error: 'KYC already approved' });
    }

    const updated = await prisma.supplier.update({
      where: { userId: req.user.sub },
      data: {
        ...result.data,
        kycStatus: 'PENDING',
        kycSubmittedAt: new Date(),
      },
    });

    return reply.send({
      success: true,
      data: {
        kycStatus: updated.kycStatus,
        message: 'KYC documents submitted. Admin will review within 2-3 business days.',
      },
    });
  });

  // ─ Public Product Catalog (no auth required) ─────────────
  // Used by the marketplace service to browse active products

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
        id: true, companyName: true, kycStatus: true, address: true, 
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

  app.patch('/products/:id', { preHandler: [fastify.authenticate] }, async (req: any, reply) => {
    const { id } = req.params;
    const result = UpdateProductSchema.safeParse(req.body);
    if (!result.success) return reply.status(400).send({ success: false, error: result.error.flatten() });

    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const product = await prisma.product.findFirst({ where: { id, supplierId: supplier.id } });
    if (!product) return reply.status(404).send({ success: false, error: 'Product not found' });

    const updated = await prisma.product.update({ where: { id }, data: result.data });
    return reply.send({ success: true, data: updated });
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
    const { orderStatus } = req.body as { orderStatus: string };
    
    const supplier = await prisma.supplier.findUnique({ where: { userId: req.user.sub } });
    if (!supplier) return reply.status(404).send({ success: false, error: 'Profile not found' });

    const order = await prisma.supplierOrder.findFirst({
      where: { id, supplierId: supplier.id }
    });
    if (!order) return reply.status(404).send({ success: false, error: 'Order not found' });

    const updated = await prisma.supplierOrder.update({
      where: { id },
      data: { orderStatus: orderStatus.toUpperCase() } // Force consistency
    });

    // ─ Publish Status Update to Kafka ────────────────────────
    await producer.send({
      topic: 'order.status.updated',
      messages: [{ 
        value: JSON.stringify({
          topic: 'order.status.updated',
          data: {
            orderId: updated.orderNumber, // Use orderNumber for matching
            newStatus: orderStatus,
            supplierId: supplier.id,
            updatedAt: updated.updatedAt,
          }
        })
      }]
    });

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
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: `agrilink/kyc/suppliers/${req.user.sub}`,
            resource_type: file.mimetype === 'application/pdf' ? 'raw' : 'image',
            quality: 'auto',
          },
          (err, result) => err ? reject(err) : resolve(result)
        ).end(buffer);
      });

      return reply.send({
        success: true,
        data: {
          url: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          format: uploadResult.format,
        },
      });
    } catch (err: any) {
      fastify.log.error({ err }, 'Cloudinary upload failed');
      return reply.status(500).send({ success: false, error: 'Upload failed' });
    }
  });

}, { prefix: '/supplier' });

async function startKafkaConsumer() {
  await consumer.subscribe({ topic: 'order.placed', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const event = JSON.parse(message.value?.toString() ?? '{}');
      if (event.topic === 'order.placed') {
        const { id: orderId, orderNumber, items, supplierId, farmerId, totalAmount, shippingAddress } = event.data;
        
        // Find if any products belong to a supplier in this service
        // (In this microservice, we only care about if the supplier matches our records)
        const supplier = await prisma.supplier.findUnique({ where: { id: supplierId } });
        if (!supplier) return;

        // 1. Record the order in our service's DB
        const existingOrder = await prisma.supplierOrder.findUnique({ where: { orderNumber } });
        if (!existingOrder) {
          await prisma.supplierOrder.create({
            data: {
              orderNumber,
              supplierId,
              farmerId,
              items,
              totalPaise: totalAmount,
              paymentStatus: 'PENDING',
              orderStatus: 'PLACED',
              shippingAddress,
            }
          });
        }

        // 2. Update Daily Analytics (Upsert for the current date)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        await prisma.dailyAnalytics.upsert({
          where: {
            supplierId_date: {
              supplierId,
              date: today,
            }
          },
          update: {
            revenuePaise: { increment: totalAmount },
            orderCount: { increment: 1 },
          },
          create: {
            supplierId,
            date: today,
            revenuePaise: totalAmount,
            orderCount: 1,
          }
        });
        
        // 3. Decrement stock
        for (const item of items) {
          try {
            const product = await prisma.product.findUnique({ where: { id: item.productId } });
            if (!product || product.supplierId !== supplierId) continue;

            const newStock = Math.max(0, product.stockQuantity - item.quantity);
            
            await prisma.$transaction([
              prisma.product.update({
                where: { id: item.productId },
                data: { stockQuantity: newStock }
              }),
              prisma.inventoryLog.create({
                data: {
                  productId: item.productId,
                  supplierId: product.supplierId,
                  change: -item.quantity,
                  reason: 'order',
                  previousStock: product.stockQuantity,
                  newStock,
                  notes: `Auto-decremented for order ${orderNumber}`
                }
              })
            ]);

            fastify.log.info({ productId: item.productId, change: -item.quantity }, 'Inventory decremented');
          } catch (err) {
            fastify.log.error({ err, productId: item.productId }, 'Failed to decrement inventory');
          }
        }
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
await startKafka();
startKafkaConsumer().catch(err => fastify.log.error(err, 'Kafka consumer failed'));

// Graceful shutdown
const shutdown = async () => {
  await stopKafka();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
