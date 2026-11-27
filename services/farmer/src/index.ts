import './config.js';

import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyJwt from '@fastify/jwt';
import FastifyCookie from '@fastify/cookie';
import FastifyMultipart from '@fastify/multipart';
import FastifyRateLimit from '@fastify/rate-limit';
import { makeAuthMiddleware, requireRole, requireInternalKey } from '@agrilink/auth-middleware';
import { v2 as cloudinary } from 'cloudinary';
import { Kafka } from 'kafkajs';
import { createOutbox, registerMetrics, superviseConsumer } from '@agrilink/platform';
import { z } from 'zod';
import { PrismaClient, Prisma } from '../prisma/client/index.js';
import { Redis } from 'ioredis';
import { presentProfile, toPrivateRef, uploadPrivate } from './utils/documents.js';
import FastifySwagger from '@fastify/swagger';
import FastifySwaggerUI from '@fastify/swagger-ui';
import type { JwtPayload, KafkaEvent, LandAgreementCreatedEvent } from '@agrilink/types';
import { computeNameMatchConfidence, parseExtentToAcres, bestOwnerMatch, AUTO_APPROVE_THRESHOLD, MATCH_THRESHOLD } from './utils/logic.js';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_FARMER
    }
  }
});

// ── Bootstrap ─────────────────────────────────────────────────

const fastify = Fastify({ logger: true, trustProxy: true });

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', { maxRetriesPerRequest: 2 });
redis.on('error', () => {});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const kafka = new Kafka({ brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',') });
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'farmer-service-group' });

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
const outbox = createOutbox({ service: 'farmer', prisma, send: sendRaw });
outbox.start();
superviseConsumer(consumer, () => startKafkaConsumer(), console);
async function publishViaOutbox(args: { topic: string; messages: { value: string | Buffer | null }[] }) {
  for (const m of args.messages) if (m.value != null) await outbox.publish(args.topic, String(m.value));
}

// Kafka Startup Engine
async function startKafka() {
  await Promise.all([producer.connect(), consumer.connect()]);
  fastify.log.info('✅ Kafka Connected (Farmer)');
}

async function startKafkaConsumer() {
  await consumer.subscribe({ 
    topics: ['user.registered', 'kyc.approved', 'kyc.rejected'], 
    fromBeginning: false 
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const payload = message.value?.toString();
      if (!payload) return;
      const event = JSON.parse(payload);
      
      // 1. Sync: Identity Creation
      if (topic === 'user.registered' && (event.role === 'farmer' || event.data?.role === 'farmer')) {
        const data = event.data || event;
        fastify.log.info({ userId: data.userId }, 'Syncing new farmer identity');
        await prisma.farmerProfile.upsert({
          where: { userId: data.userId },
          update: {},
          create: {
            userId: data.userId,
            nameDisplay: data.displayName || 'Unnamed Farmer',
            kycStatus: 'not_started',
            village: 'Pending entry'
          }
        });
      }

      // 2. Sync: Governance Status
      if ((topic === 'kyc.approved' || topic === 'kyc.rejected') && (event.role === 'farmer' || event.data?.role === 'farmer')) {
        const data = event.data || event;
        fastify.log.info({ userId: data.userId, status: topic }, 'Syncing KYC decision from Auth');
        await prisma.farmerProfile.updateMany({
          where: { userId: data.userId },
          data: {
            kycStatus: topic === 'kyc.approved' ? 'approved' : 'rejected',
            kycApprovedAt: topic === 'kyc.approved' ? new Date() : undefined
          }
        });
      }
    }
  });
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
  limits: { fileSize: 25 * 1024 * 1024, files: 2 }, // Aadhaar + RTC PDFs
});

await fastify.register(FastifyRateLimit, { global: true, max: 200, timeWindow: '1m', redis, skipOnError: true });

// Swagger Documentation Engine
await fastify.register(FastifySwagger, {
  openapi: {
    info: {
      title: 'AgriLink Farmer Service API',
      description: 'Handles farmer profiles, verified land records (RTC), KYC processing, and weather data.',
      version: '2.0.0',
    },
    servers: [{ url: 'http://localhost:8080/farmer' }],
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

// Register standard auth decorator
fastify.decorate('authenticate', makeAuthMiddleware(fastify, { redis }));
registerMetrics(fastify, 'farmer');

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

// ── Helper: Propagate Auth Token (Header or Cookie) ───────────

function getAuthToken(req: any) {
  let token = req.headers.authorization;
  if (!token && req.cookies?.agrilink_access) {
    token = `Bearer ${req.cookies.agrilink_access}`;
  }
  return token;
}

// ── Helper: Call ML OCR Service ────────────────────────────────

async function callOcrService(req: any, endpoint: string, buffer: Buffer, filename: string, contentType: string) {
  const ML_URL = process.env.ML_SERVICE_URL ?? 'http://localhost:4006';
  
  const token = getAuthToken(req);

  console.log(`[OCR] Calling ML service at ${ML_URL}/ml/ocr/${endpoint}...`);
  try {
    const form = new FormData();
    // Using blob/file structure for FastAPI UploadFile compatibility
    const fileBlob = new Blob([buffer], { type: contentType });
    form.append('file', fileBlob, filename);

    const res = await fetch(`${ML_URL}/ml/ocr/${endpoint}`, { 
      method: 'POST', 
      headers: token ? { 'Authorization': token } : {},
      body: form 
    });

    const result = await res.json();
    return result;
  } catch (err: any) {
    console.error(`[OCR] ML service call failed:`, err.message);
    throw new Error(`OCR service unavailable: ${err.message}`);
  }
}

// ── Helper: Upload sensitive documents (private, signed access only) ──
async function uploadToCloudinary(buffer: Buffer, folder: string, filename: string): Promise<string> {
  const result = await uploadPrivate(buffer, folder, filename);
  return toPrivateRef(result);
}

const ALLOWED_DOC_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

// ── Routes ────────────────────────────────────────────────────

await fastify.register(async (app) => {
  app.get('/health', async () => ({ status: 'ok', service: 'farmer' }));

  // ─ Profile ────────────────────────────────────────────────

  // BUG-028 fix: returns real data, no hardcoded stats
  app.get('/profile', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
    // Upsert on read to handle any missed Kafka events (Lazy Init)
    const profile = await prisma.farmerProfile.upsert({
       where: { userId: req.user.sub },
       update: {},
       create: {
          userId: req.user.sub,
          nameDisplay: req.user.name ?? 'Farmer',
          kycStatus: 'not_started'
       }
    });
    return reply.send({ success: true, data: presentProfile(profile) });
  });

  app.get('/weather', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
    const profile = await prisma.farmerProfile.findUnique({
      where: { userId: req.user.sub },
      select: { centerLat: true, centerLng: true, village: true }
    });

    const isMapped = !!(profile?.centerLat && profile?.centerLng);
    // Default to a central location in Karnataka (e.g., Dharwad) if no land is mapped
    const lat = profile?.centerLat ?? 15.4589;
    const lng = profile?.centerLng ?? 75.0078;

    // Cache per ~1 km grid cell for 30 min: keeps us well inside Open-Meteo's
    // free limits no matter how many farmers open the dashboard.
    const cacheKey = `weather:${lat.toFixed(2)}:${lng.toFixed(2)}`;
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return reply.send({ success: true, data: { ...JSON.parse(cached), location: profile?.village || 'Region Default', isMapped } });
      }
    } catch { /* cache miss on Redis error */ }

    try {
      // Calculate dates for history (past 7 days)
      const now = new Date();
      const endHistory = new Date(now);
      endHistory.setDate(now.getDate() - 1);
      const startHistory = new Date(now);
      startHistory.setDate(now.getDate() - 7);

      const fmt = (d: Date) => d.toISOString().split('T')[0];

      let forecastData: any = {};
      let historyData: any = {};

      // 1. Fetch Forecast (Next 7 days) with fallback
      try {
        const forecastRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,et0_fao_evapotranspiration&timezone=auto`, { signal: AbortSignal.timeout(8000) });
        if (forecastRes.ok) {
           forecastData = await forecastRes.json();
        }
      } catch (e) {
        console.error('Forecast fetch failed:', e);
      }

      // 2. Fetch History (Past 7 days) with fallback
      try {
        const historyRes = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${fmt(startHistory)}&end_date=${fmt(endHistory)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata`, { signal: AbortSignal.timeout(8000) });
        if (historyRes.ok) {
           historyData = await historyRes.json();
        }
      } catch (e) {
        console.error('History fetch failed:', e);
      }

      const payload = {
        current: forecastData.current || { temperature_2m: 28, relative_humidity_2m: 65, weather_code: 0 },
        forecast: forecastData.daily || { time: [], weather_code: [0], temperature_2m_max: [30], temperature_2m_min: [20] },
        history: historyData.daily || { time: [], temperature_2m_max: [29], temperature_2m_min: [19] },
        live: Boolean(forecastData.daily),
      };
      if (payload.live) redis.setex(cacheKey, 1800, JSON.stringify(payload)).catch(() => {});
      return reply.send({
        success: true,
        data: {
          ...payload,

          location: profile?.village || 'Region Default',
          isMapped
        }
      });
    } catch (err: any) {
      return reply.send({
         success: true,
         data: {
           current: { temperature_2m: 28, relative_humidity_2m: 65, weather_code: 0 },
           forecast: { time: [], weather_code: [0], temperature_2m_max: [30], temperature_2m_min: [20] },
           history: { time: [], temperature_2m_max: [29], temperature_2m_min: [19] },
           live: false,
           location: profile?.village || 'Central Karnataka',
           isMapped
         }
      });
    }
  });

  app.put('/profile', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
    const ProfileUpdateSchema = z.object({
      fullName: z.string().min(1).max(200).optional(),
      phone: z.string().max(15).optional(),
      district: z.string().max(100).optional(),
      taluk: z.string().max(100).optional(),
      village: z.string().max(100).optional(),
      bankAccountNumber: z.string().max(30).optional(),
      bankIfsc: z.string().max(20).optional(),
      bankName: z.string().max(100).optional(),
      ethAddress: z.string().regex(/^0x[0-9a-fA-F]{40}$/, 'Invalid ETH address').optional(),
      annualIncomeINR: z.number().nonnegative().optional(),
      landOwnershipType: z.string().optional(),
      casteCategory: z.string().optional(),
      isIncomeTaxPayer: z.boolean().optional(),
      isGovtEmployee: z.boolean().optional(),
      hasKCC: z.boolean().optional(),
      hasAadhaarLinkedBank: z.boolean().optional(),
      hasLivestock: z.boolean().optional(),
      farmingType: z.string().optional(),
      cropsGrown: z.array(z.string()).optional(),
    });
    const result = ProfileUpdateSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: result.error.flatten() });
    }
    const profile = await prisma.farmerProfile.upsert({
      where: { userId: req.user.sub },
      update: result.data,
      create: { userId: req.user.sub, ...result.data }
    });
    return reply.send({ success: true, data: presentProfile(profile) });
  });

  // ─ Real Stats Endpoint (BUG-028 fix) ──────────────────────

  app.get('/stats', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
    const profile = await prisma.farmerProfile.findUnique({ where: { userId: req.user.sub } });
    return reply.send({
      success: true,
      data: {
        totalLandAcres: profile?.totalExtentAcres ?? 0,
        kycStatus: profile?.kycStatus ?? 'not_started',
        rtcVerified: profile?.rtcVerified ?? false,
        aadhaarVerified: profile?.aadhaarVerified ?? false,
        readyToIntegrate: profile?.readyToIntegrate ?? false,
        nameMatchStatus: profile?.nameMatchStatus ?? 'pending',
      },
    });
  });

  // ─ Document Upload + OCR ──────────────────────────────────

  app.post(
    '/documents/aadhaar',
    { preHandler: [(fastify as any).authenticate] },
    async (req: any, reply) => {
      const file = await req.file();
      if (!file) return reply.status(400).send({ success: false, error: 'No file uploaded' });

      // BUG-035 fix: validate type
      if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.mimetype)) {
        return reply.status(400).send({ success: false, error: 'Only PDF/JPEG/PNG allowed' });
      }

      console.log(`[Aadhaar] Received file: ${file.filename} (${file.mimetype})`);
      const chunks: Buffer[] = [];
      for await (const chunk of file.file) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);
      console.log(`[Aadhaar] Buffer created, size: ${buffer.length} bytes`);

      if (buffer.length > 10 * 1024 * 1024) {
        return reply.status(400).send({ success: false, error: 'File too large (max 10MB)' });
      }

      // Extract extension for Cloudinary to correctly identify type
      const ext = file.filename.split('.').pop() || (file.mimetype === 'application/pdf' ? 'pdf' : 'jpg');
      const cloudUrl = await uploadToCloudinary(buffer, `farmers/${req.user.sub}/aadhaar`, `aadhaar.${ext}`);

      // BUG-018/019 fix: OCR via ML service (Google Vision + Gemini)
      const ocrResult: any = await callOcrService(req, 'extract-aadhaar', buffer, file.filename, file.mimetype);

      let updateData: any = {
        aadhaarCloudUrl: cloudUrl,
        kycStatus: 'partially_uploaded',
      };

      if (ocrResult.success) {
        updateData = {
          ...updateData,
          aadhaarDataJson: ocrResult,
          nameEnglish: ocrResult.nameEnglish,
          nameKannada: ocrResult.nameKannada,
          nameDisplay: ocrResult.nameDisplay,
          nameNormalized: ocrResult.nameNormalized,
          dob: ocrResult.dob,
          gender: ocrResult.gender,
          aadhaarAddress: ocrResult.address,
          aadhaarVerified: true,
        };
      }

      const profile = await prisma.farmerProfile.upsert({
        where: { userId: req.user.sub },
        update: updateData,
        create: { userId: req.user.sub, ...updateData }
      });

      // Unified Name Discovery & Match Check (Triggered from both routes)
      if (profile.aadhaarVerified && profile.rtcVerified) {
        const aName = profile.nameEnglish || profile.nameNormalized;
        const rName = profile.rtcOwnerName;
        if (aName && rName) {
           const confidence = computeNameMatchConfidence(aName, rName);
           await prisma.farmerProfile.update({
             where: { userId: req.user.sub },
             data: {
               nameMatchConfidence: confidence,
               nameMatchStatus: confidence >= MATCH_THRESHOLD ? 'matched' : 'mismatched',
             }
           });
        }
      }

      if (!ocrResult.success) {
        // Upload is kept, but the farmer must re-upload a readable copy
        return reply.status(422).send({ success: false, error: ocrResult.error ?? 'We could not read this document. Please upload a clearer copy.' });
      }
      return reply.send({ success: true, data: { uploaded: true, extracted: ocrResult } });
    }
  );

  app.post(
    '/documents/rtc',
    { preHandler: [(fastify as any).authenticate] },
    async (req: any, reply) => {
      const file = await req.file();
      if (!file) return reply.status(400).send({ success: false, error: 'No file uploaded' });
      if (!ALLOWED_DOC_TYPES.includes(file.mimetype)) {
        return reply.status(400).send({ success: false, error: 'Only PDF/JPEG/PNG allowed' });
      }

      const chunks: Buffer[] = [];
      for await (const chunk of file.file) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);

      const ext = file.filename.split('.').pop() || (file.mimetype === 'application/pdf' ? 'pdf' : 'jpg');
      const cloudUrl = await uploadToCloudinary(buffer, `farmers/${req.user.sub}/rtc`, `rtc.${ext}`);
      const ocrResult: any = await callOcrService(req, 'extract-rtc', buffer, file.filename, file.mimetype);

      let updateData: any = {
        rtcCloudUrl: cloudUrl,
        kycStatus: 'partially_uploaded',
      };

      if (ocrResult.success) {
        const loc = ocrResult.location ?? {};
        const land = ocrResult.landDetails ?? {};
        const own = ocrResult.ownership ?? {};

        // Parse totalExtentRaw (e.g. "2.5 acres" or "1.012 Ha") to numeric acres
        let totalExtentAcres: number | undefined;
        const rawExtent = land.total_extent ?? '';
        const numMatch = String(rawExtent).match(/([\d.]+)/);
        if (numMatch) {
          const num = parseFloat(numMatch[1]);
          totalExtentAcres = String(rawExtent).toLowerCase().includes('ha')
            ? parseFloat((num * 2.471).toFixed(3))  // hectares → acres
            : parseFloat(num.toFixed(3));
        }

        updateData = {
          ...updateData,
          rtcDataJson: ocrResult,
          district: loc.district,
          taluk: loc.taluk,
          hobli: loc.hobli,
          village: loc.village,
          surveyNumber: ocrResult.landIdentification?.survey_number,
          hissaNumber: ocrResult.landIdentification?.hissa_number,
          totalExtentRaw: land.total_extent,
          totalExtentAcres,
          soilType: land.soil_type,
          rtcOwnerName: bestOwnerMatch(own.owners ?? [], (await prisma.farmerProfile.findUnique({ where: { userId: req.user.sub }, select: { nameEnglish: true } }))?.nameEnglish),
          rtcVerified: true,
        };
      }

      const profile = await prisma.farmerProfile.upsert({
        where: { userId: req.user.sub },
        update: updateData,
        create: { userId: req.user.sub, ...updateData }
      });

      // Unified Name Discovery & Match Check (Triggered from both routes)
      if (profile.aadhaarVerified && profile.rtcVerified) {
        const aName = profile.nameEnglish || profile.nameNormalized;
        const rName = profile.rtcOwnerName;
        if (aName && rName) {
           const confidence = computeNameMatchConfidence(aName, rName);
           await prisma.farmerProfile.update({
             where: { userId: req.user.sub },
             data: {
               nameMatchConfidence: confidence,
               nameMatchStatus: confidence >= MATCH_THRESHOLD ? 'matched' : 'mismatched',
             }
           });
        }
      }

      if (!ocrResult.success) {
        // Upload is kept, but the farmer must re-upload a readable copy
        return reply.status(422).send({ success: false, error: ocrResult.error ?? 'We could not read this document. Please upload a clearer copy.' });
      }
      return reply.send({ success: true, data: { uploaded: true, extracted: ocrResult } });
    }
  );

  // ── Upload Land Sketch (Hand-drawn / Map Scan) ───────────────
  app.post('/documents/sketch', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
    try {
      const file = await req.file();
      if (!file) return reply.status(400).send({ success: false, error: 'File is required' });
      if (!ALLOWED_DOC_TYPES.includes(file.mimetype)) {
        return reply.status(400).send({ success: false, error: 'Only PDF/JPEG/PNG allowed' });
      }
      
      const chunks: Buffer[] = [];
      for await (const chunk of file.file) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);
      
      // Auto-extract boundary from sketch
      const ocrResult: any = await callOcrService(req, 'extract-land-sketch', buffer, file.filename, file.mimetype);
      
      if (!ocrResult.success) {
        return reply.status(400).send({ success: false, error: ocrResult.error || 'Failed to analyze sketch' });
      }

      // Fetch user profile to verify survey number
      const profile = await prisma.farmerProfile.findUnique({ where: { userId: req.user.sub } });
      if (!profile) return reply.status(404).send({ success: false, error: 'Profile not found' });

      // Verification Step
      const extractedSurvey = ocrResult.surveyNumber?.toString().trim().toLowerCase();
      const registeredSurvey = profile.surveyNumber?.toString().trim().toLowerCase();

      if (extractedSurvey && registeredSurvey && !registeredSurvey.includes(extractedSurvey) && !extractedSurvey.includes(registeredSurvey)) {
        return reply.status(400).send({ 
          success: false, 
          error: `Survey Number Mismatch: Sketch shows '${ocrResult.surveyNumber}' but your profile is registered with '${profile.surveyNumber}'.`
        });
      }

      const cloudUrl = await uploadToCloudinary(buffer, `farmers/${req.user.sub}/sketch`, 'sketch');
      
      let updateData: any = { 
        landSketchUrl: cloudUrl,
        landBoundary: ocrResult.boundary || null,
        centerLat: ocrResult.center?.lat,
        centerLng: ocrResult.center?.lng,
        totalExtentAcres: ocrResult.area_sq_mtrs ? parseFloat((ocrResult.area_sq_mtrs / 4046.86).toFixed(3)) : profile.totalExtentAcres,
        landMappingDataJson: ocrResult,
        // Visibility to other farmers still requires approved KYC + explicit opt-in
        readyToIntegrate: !!ocrResult.boundary && profile.kycStatus === 'approved' && profile.readyToIntegrate,
      };

      // Sync survey number if profile is missing it
      if (!profile.surveyNumber && ocrResult.surveyNumber) {
        updateData.surveyNumber = ocrResult.surveyNumber.toString();
      }

      const updated = await prisma.farmerProfile.update({
        where: { userId: req.user.sub },
        data: updateData
      });
      
      return reply.send({ success: true, data: { profile: presentProfile(updated), extracted: ocrResult } });
    } catch (err: any) {
      fastify.log.error({ err }, 'Sketch processing failed');
      return reply.status(400).send({ success: false, error: 'Failed to process sketch' });
    }
  });

  // ── Save Land Boundary (GeoJSON Polygon) ────────────────────
  app.post('/land/boundary', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
    try {
      const BoundarySchema = z.object({
        boundary: z.any().refine((b) => b != null && JSON.stringify(b).length < 200_000, 'Invalid boundary'),
        // Karnataka bounding box (with margin) — rejects junk coordinates
        centerLat: z.coerce.number().min(11).max(19),
        centerLng: z.coerce.number().min(73).max(79),
      });
      const parsed = BoundarySchema.safeParse(req.body);
      if (!parsed.success) return reply.status(400).send({ success: false, error: parsed.error.flatten() });
      const { boundary, centerLat, centerLng } = parsed.data;
      const updated = await prisma.farmerProfile.update({
        where: { userId: req.user.sub },
        data: { landBoundary: boundary, centerLat, centerLng }
      });
      return reply.send({ success: true, data: presentProfile(updated) });
    } catch (err: any) {
      return reply.status(400).send({ success: false, error: 'Could not save boundary' });
    }
  });

  // ─ Submit KYC ─────────────────────────────────────────────

  app.post('/kyc/submit', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
    const profile = await prisma.farmerProfile.findUnique({ where: { userId: req.user.sub } });
    if (!profile) return reply.status(404).send({ success: false, error: 'Profile not found' });

    if (!profile.aadhaarVerified || !profile.rtcVerified) {
      return reply.status(400).send({
        success: false,
        error: 'Both Aadhaar and RTC documents must be uploaded before KYC submission',
      });
    }

    // ── Optimized Name Discovery Logic ───────────────────────
    // 1. First attempt English Match
    let confidence = 0;
    if (profile.nameEnglish && profile.rtcOwnerName) {
      confidence = computeNameMatchConfidence(profile.nameEnglish, profile.rtcOwnerName);
    }

    // 2. If English fails, attempt Kannada Prefix Match (User specified requirement)
    if (confidence < 0.95 && profile.nameKannada && profile.rtcOwnerName) {
      const kanConfidence = computeNameMatchConfidence(profile.nameKannada, profile.rtcOwnerName);
      if (kanConfidence > confidence) confidence = kanConfidence;
    }

    const nameMatchStatus = confidence >= MATCH_THRESHOLD ? 'matched' : 'mismatched';

    // Auto-approve only on an exact full-name match between Aadhaar and RTC,
    // and only if enabled. Anything else goes to the admin KYC queue.
    const autoApprove = process.env.KYC_AUTO_APPROVE !== 'false' && confidence >= AUTO_APPROVE_THRESHOLD;
    const kycStatus = autoApprove ? 'approved' : 'submitted';
    const eventTopic = autoApprove ? 'kyc.approved' : 'kyc.submitted';

    const updated = await prisma.farmerProfile.update({
      where: { userId: req.user.sub },
      data: {
        kycStatus,
        kycSubmittedAt: new Date(),
        kycApprovedAt: autoApprove ? new Date() : undefined,
        nameMatchStatus,
        nameMatchConfidence: confidence,
      }
    });

    // Publish event so Auth service can update roles and Notification service can alert user
    try {
      await publishViaOutbox({
        topic: eventTopic,
        messages: [{
          value: JSON.stringify({
            eventId: `${Date.now()}`,
            topic: eventTopic,
            source: 'farmer-service',
            timestamp: new Date().toISOString(),
            data: {
              userId: req.user.sub,
              email: req.user.email,
              displayName: profile.nameDisplay || profile.nameEnglish,
              role: 'farmer',
              status: kycStatus,
              reason: autoApprove ? 'Verified via intelligent name-matching' : undefined,
              submittedAt: new Date().toISOString(),
              district: profile.district,
              nameMatchStatus,
              nameMatchConfidence: confidence,
            },
          }),
        }],
      });
    } catch (err: any) {
      fastify.log.warn(`[kafka] ${eventTopic} event failed (non-fatal):`, err.message);
    }

    return reply.send({
      success: true,
      data: {
        kycStatus: updated.kycStatus,
        confidence: confidence,
        message: autoApprove
          ? '🎉 Instant Verification Successful! Your KYC is approved.'
          : 'KYC submitted for review. Admin will verify within 2–3 business days.'
      },
    });
  });

  // Admin/Internal: Fetch specific farmer KYC manifest
  app.get('/:userId/kyc', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
    const { userId } = req.params as { userId: string };
    
    // Authorization: Admin or the user themselves
    if (req.user.role !== 'admin' && req.user.sub !== userId) {
      return reply.status(403).send({ success: false, error: 'Unauthorized manifest access' });
    }

    const profile = await prisma.farmerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return reply.status(404).send({ success: false, error: 'Farmer node not found' });
    }

    return reply.send({ success: true, data: presentProfile(profile) });
  });

  // ─ Land Integration ───────────────────────────────────────

  app.post('/land/ready-to-integrate', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
    const { ready } = req.body || {};
    const profile = await prisma.farmerProfile.findUnique({ where: { userId: req.user.sub } });
    if (!profile) return reply.status(404).send({ success: false, error: 'Profile not found' });
    if (profile.kycStatus !== 'approved') {
      return reply.status(403).send({ success: false, error: 'KYC must be approved first' });
    }
    
    // If 'ready' is provided, use it; otherwise, default to true (legacy / existing behavior)
    const nextStatus = typeof ready === 'boolean' ? ready : true;

    await prisma.farmerProfile.update({ 
      where: { userId: req.user.sub }, 
      data: { readyToIntegrate: nextStatus } 
    });
    return reply.send({ 
      success: true, 
      data: { 
        readyToIntegrate: nextStatus,
        message: nextStatus ? 'You are now visible to other farmers' : 'Profile hidden from integration partners' 
      } 
    });
  });

  // Find other eligible farmers for integration
  app.get('/land/eligible-partners', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
    const profile = await prisma.farmerProfile.findUnique({ where: { userId: req.user.sub } });
    if (!profile) return reply.status(404).send({ success: false, error: 'Profile not found' });
    
    if (profile.kycStatus !== 'approved') {
      return reply.status(403).send({ success: false, error: 'KYC must be approved first' });
    }

    const partners = await prisma.farmerProfile.findMany({
      where: {
        userId: { not: req.user.sub },
        readyToIntegrate: true,
        kycStatus: 'approved',
        district: profile.district,
      },
      select: {
        userId: true,
        nameDisplay: true,
        village: true,
        surveyNumber: true,
        landBoundary: true,
        centerLat: true,
        centerLng: true,
        totalExtentAcres: true,
      },
      take: 50
    });

    // Advanced Ranking: If current farmer has a center, sort partners by spatial distance
    if (profile.centerLat && profile.centerLng) {
      const pLat = profile.centerLat as number;
      const pLng = profile.centerLng as number;

      partners.sort((a, b) => {
        if (!a.centerLat || !b.centerLat) return 0;
        const distA = Math.sqrt(Math.pow(a.centerLat - pLat, 2) + Math.pow((a.centerLng as number) - pLng, 2));
        const distB = Math.sqrt(Math.pow(b.centerLat - pLat, 2) + Math.pow((b.centerLng as number) - pLng, 2));
        return distA - distB;
      });
    }

    return reply.send({ success: true, data: partners });
  });

  // GET /land/all-boundaries — Cross-profile discovery for the dashboard map
  app.get('/land/all-boundaries', { preHandler: [(fastify as any).authenticate, requireRole('farmer', 'admin')] }, async (req: any, reply) => {
    const isAdmin = req.user.role === 'admin';
    // Farmers only see parcels of verified farmers who opted in to integration
    // (plus their own). Admins see everything.
    const allFarmerLands = await prisma.farmerProfile.findMany({
      where: {
        NOT: { landBoundary: { equals: Prisma.AnyNull } },
        ...(isAdmin ? {} : {
          OR: [
            { userId: req.user.sub },
            { readyToIntegrate: true, kycStatus: 'approved' },
          ],
        }),
      },
      select: {
        userId: true,
        nameDisplay: true,
        village: true,
        surveyNumber: isAdmin,
        landBoundary: true,
        centerLat: true,
        centerLng: true,
        totalExtentAcres: true,
      },
      take: isAdmin ? 5000 : 1000,
    });
    return reply.send({ success: true, data: allFarmerLands });
  });

  // ─ Schemes Matching ───────────────────────────────────────

  app.get('/schemes/eligible', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
    const profile = await prisma.farmerProfile.findUnique({ where: { userId: req.user.sub } });
    if (!profile) return reply.status(404).send({ success: false, error: 'Profile not found' });

    // Map land holding to category
    let farmCategory = 'marginal';
    const acres = profile.totalExtentAcres ?? 0;
    if (acres > 10) farmCategory = 'large';
    else if (acres > 5) farmCategory = 'medium';
    else if (acres > 2.5) farmCategory = 'small';

    const searchReq = {
      state: profile.district ? 'Karnataka' : undefined,
      farmCategory,
      landHoldingAcres: acres,
      annualIncomeINR: profile.annualIncomeINR,
      gender: profile.gender,
      castCategory: profile.casteCategory,
      isIncomeTaxPayer: profile.isIncomeTaxPayer,
      isGovtEmployee: profile.isGovtEmployee,
      hasLivestock: profile.hasLivestock,
      farmingType: profile.farmingType,
      hasKCC: profile.hasKCC,
      hasAadhaarLinkedBank: profile.hasAadhaarLinkedBank,
    };

    try {
      const ML_URL = process.env.ML_SERVICE_URL ?? 'http://localhost:4006';
      const token = getAuthToken(req);
      const res = await fetch(`${ML_URL}/ml/schemes/search`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': token } : {})
        },
        body: JSON.stringify(searchReq),
      });
      const json: any = await res.json();
      return reply.send({ success: true, data: json.data });
    } catch (err: any) {
      fastify.log.error({ err }, 'ML scheme search failed');
      return reply.status(500).send({ success: false, error: 'Failed to fetch schemes' });
    }
  });

  // ─ Bhoomi Digital Land Integration ───────────────────────────

  app.post('/land/fetch-bhoomi', { preHandler: [(fastify as any).authenticate] }, async (req: any, reply) => {
    const { district, taluk, hobli, village, surveyNumber, hissaNumber } = req.body ?? {};

    if (!district || !taluk || !hobli || !village || !surveyNumber) {
      return reply.status(400).send({ success: false, error: 'Missing survey details' });
    }

    try {
      const ML_URL = process.env.ML_SERVICE_URL ?? 'http://localhost:4006';
      const token = getAuthToken(req);
      const res = await fetch(`${ML_URL}/ml/bhoomi/fetch-rtc`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': token } : {})
        },
        body: JSON.stringify({ district, taluk, hobli, village, surveyNumber, hissaNumber }),
      });

      const json: any = await res.json();
      if (!res.ok || !json.success) {
        return reply.status(500).send({ success: false, error: json.error ?? 'Bhoomi fetch failed' });
      }

      const rtc = json.data;
      const extentStr = rtc.land_details?.total_extent ?? '0.0.0.0';
      const acres = parseExtentToAcres(extentStr);

      const current = await prisma.farmerProfile.findUnique({ where: { userId: req.user.sub } });
      const owners: string[] = (rtc.ownership ?? []).map((o: any) => o?.name).filter(Boolean);
      // Pick the RTC owner that best matches the farmer's Aadhaar name; the
      // match is re-scored at KYC submission so a stranger's survey number
      // can never auto-approve.
      const ownerName = bestOwnerMatch(owners, current?.nameEnglish ?? current?.nameNormalized);

      // Update farmer profile
      const profile = await prisma.farmerProfile.update({
        where: { userId: req.user.sub },
        data: {
          district,
          taluk,
          hobli,
          village,
          surveyNumber,
          hissaNumber,
          rtcVerified: true,
          totalExtentAcres: acres,
          totalExtentRaw: extentStr,
          rtcOwnerName: ownerName,
          rtcDataJson: rtc,
          kycStatus: 'partially_uploaded',
          // Land changed → must re-verify before being visible for integration
          readyToIntegrate: false,
        }
      });

      return reply.send({ success: true, data: { profile: presentProfile(profile), extracted: rtc } });
    } catch (err: any) {
      fastify.log.error({ err }, 'Bhoomi fetch error');
      return reply.status(500).send({ success: false, error: 'Bhoomi integration service unavailable' });
    }
  });

  // ─ Internal: verified profile data for other services (blocked at Nginx) ──
  app.get('/internal/profiles', { preHandler: [requireInternalKey()] }, async (req: any, reply) => {
    const ids = String(req.query?.ids ?? '').split(',').map((s: string) => s.trim()).filter(Boolean).slice(0, 50);
    if (!ids.length) return reply.status(400).send({ success: false, error: 'ids required' });
    const profiles = await prisma.farmerProfile.findMany({
      where: { userId: { in: ids } },
      select: {
        userId: true, nameDisplay: true, nameEnglish: true, surveyNumber: true, hissaNumber: true,
        village: true, taluk: true, district: true, totalExtentAcres: true, kycStatus: true, readyToIntegrate: true,
      },
    });
    return reply.send({ success: true, data: profiles });
  });

  // ─ Admin: Schemes Management ──────────────────────────────

  app.get('/admin/schemes', { preHandler: [(fastify as any).authenticate, requireRole('admin')] }, async (req: any, reply) => {
    try {
      const ML_URL = process.env.ML_SERVICE_URL ?? 'http://ml-service:4006';
      const token = req.headers.authorization ?? (req.cookies?.agrilink_access ? `Bearer ${req.cookies.agrilink_access}` : undefined);
      const res = await fetch(`${ML_URL}/ml/schemes/all?limit=100`, {
        headers: token ? { 'Authorization': token } : {}
      });
      const json = await res.json();
      return reply.send(json);
    } catch (err: any) {
      fastify.log.error({ err }, 'ML schemes proxy failed');
      return reply.status(503).send({ success: false, error: 'Schemes service is unavailable, please retry shortly' });
    }
  });

  // GET /farmer/admin/stats (Admin only)
  app.get(
    '/admin/stats',
    { preHandler: [(fastify as any).authenticate, requireRole('admin')] },
    async (req, reply) => {
      try {
        const [total, kycApproved, kycPending, rtcVerified] = await Promise.all([
          prisma.farmerProfile.count(),
          prisma.farmerProfile.count({ where: { kycStatus: 'approved' } }),
          prisma.farmerProfile.count({ where: { kycStatus: 'submitted' } }),
          prisma.farmerProfile.count({ where: { rtcVerified: true } }),
        ]);

        return reply.send({
          success: true,
          data: {
            counts: { total, kycApproved, kycPending, rtcVerified },
            timestamp: new Date().toISOString()
          }
        });
      } catch (err: any) {
        return reply.status(500).send({ success: false, error: err.message });
      }
    });

  app.post('/admin/schemes', { preHandler: [(fastify as any).authenticate, requireRole('admin')] }, async (req: any, reply) => {
    try {
      const ML_URL = process.env.ML_SERVICE_URL ?? 'http://ml-service:4006';
      const token = req.headers.authorization ?? (req.cookies?.agrilink_access ? `Bearer ${req.cookies.agrilink_access}` : undefined);
      const res = await fetch(`${ML_URL}/ml/schemes/add`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': token } : {})
        },
        body: JSON.stringify(req.body),
      });
      const json = await res.json();
      return reply.send(json);
    } catch (err: any) {
      fastify.log.error({ err }, 'ML schemes proxy failed');
      return reply.status(503).send({ success: false, error: 'Schemes service is unavailable, please retry shortly' });
    }
  });

  app.delete('/admin/schemes', { preHandler: [(fastify as any).authenticate, requireRole('admin')] }, async (req: any, reply) => {
    try {
       const { name } = req.query as any;
       const ML_URL = process.env.ML_SERVICE_URL ?? 'http://ml-service:4006';
       const res = await fetch(`${ML_URL}/ml/schemes/delete?name=${encodeURIComponent(name)}`, { 
         method: 'DELETE',
         headers: { 'Authorization': getAuthToken(req) ?? '' }
       });
       const json = await res.json();
       return reply.send(json);
    } catch (err: any) {
       fastify.log.error({ err }, 'ML schemes proxy failed');
       return reply.status(503).send({ success: false, error: 'Schemes service is unavailable, please retry shortly' });
    }
  });

}, { prefix: '/farmer' });



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

// ── DB + Start ─────────────────────────────────────────────────

async function bootstrap() {
  try {
    await prisma.$connect();
    fastify.log.info('[db] Connected to PostgreSQL Farmer');
    
    // Start Kafka in the background with retries (non-fatal for HTTP)
    void runKafka();

    const PORT = Number(process.env.FARMER_PORT ?? 4002);
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🌾 Farmer service running on http://0.0.0.0:${PORT}`);
  } catch (err: any) {
    fastify.log.error('[boot] Failed to connect to PostgreSQL:', err.message || err);
    process.exit(1);
  }
}

bootstrap();

// ── Shutdown ──────────────────────────────────────────────────
const shutdown = async () => {
  await producer.disconnect();
  await consumer.disconnect();
  await prisma.$disconnect();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
