import './config.js';
/**
 * Blockchain Service — Fastify (Port 4007)
 *
 * Gasless relayer for LandAgreementRegistry (v2) on Polygon Amoy (free testnet)
 * or any EVM chain. Farmers never hold keys or pay gas: this service
 * re-authenticates them (password), builds the agreement document from
 * VERIFIED profile data, pins it to IPFS (Pinata free tier) and writes the
 * record on-chain from the relayer wallet.
 *
 * Security properties:
 *  - Callers can only create agreements where THEY are farmer 1.
 *  - Names / survey numbers / land extent come from the farmer service
 *    (KYC-verified), never from the browser.
 *  - Both parties must be KYC-approved; the partner must have opted in.
 *  - On-chain identity = keccak256(userId), computed by the contract.
 *  - Writes are serialised through one queue so the relayer nonce never collides.
 */
import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyJwt from '@fastify/jwt';
import FastifyCookie from '@fastify/cookie';
import { makeAuthMiddleware, requireRole } from '@agrilink/auth-middleware';
import { createPublicClient, createWalletClient, http, decodeEventLog, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon, polygonAmoy, hardhat } from 'viem/chains';
import PinataSDK from '@pinata/sdk';
import { Readable } from 'stream';
import { createHash } from 'crypto';
import { z } from 'zod';
import { Kafka } from 'kafkajs';
import { Redis } from 'ioredis';
import { landAgreementRegistryAbi as abi } from './abi.js';
import { registerMetrics, gauge } from '@agrilink/platform';

const fastify = Fastify({ logger: true, trustProxy: true });

// ── Config ────────────────────────────────────────────────────

const NETWORK = process.env.BLOCKCHAIN_NETWORK ?? 'amoy';
const CHAIN = NETWORK === 'localhost' ? hardhat : NETWORK === 'polygon' ? polygon : polygonAmoy;
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL ?? (NETWORK === 'localhost' ? 'http://127.0.0.1:8545' : 'https://rpc-amoy.polygon.technology');
const PRIVATE_KEY = process.env.BLOCKCHAIN_ADMIN_PRIVATE_KEY as Hex | undefined;
const CONTRACT_ADDRESS = (process.env.BLOCKCHAIN_CONTRACT_ADDRESS || undefined) as Hex | undefined;
const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_GATEWAY = process.env.PINATA_GATEWAY ?? 'https://gateway.pinata.cloud';
const AUTH_URL = process.env.AUTH_SERVICE_URL ?? 'http://localhost:4001';
const FARMER_URL = process.env.FARMER_SERVICE_URL ?? 'http://localhost:4002';
const INTERNAL_KEY = process.env.INTERNAL_API_KEY ?? '';

if (!PRIVATE_KEY || !/^0x[0-9a-fA-F]{64}$/.test(PRIVATE_KEY)) {
  throw new Error('BLOCKCHAIN_ADMIN_PRIVATE_KEY must be a 0x-prefixed 32-byte hex key');
}

const STATUS = ['Draft', 'PendingSignature', 'Active', 'Expired', 'Revoked'] as const;

// ── Clients ───────────────────────────────────────────────────

const publicClient = createPublicClient({ chain: CHAIN, transport: http(RPC_URL, { retryCount: 3, timeout: 20_000 }) });
const account = privateKeyToAccount(PRIVATE_KEY);
const walletClient = createWalletClient({ account, chain: CHAIN, transport: http(RPC_URL, { retryCount: 3, timeout: 20_000 }) });
const pinata = PINATA_JWT ? new PinataSDK({ pinataJWTKey: PINATA_JWT }) : null;

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', { maxRetriesPerRequest: 2 });
redis.on('error', () => {});

const kafka = new Kafka({ clientId: 'blockchain-service', brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',') });
const producer = kafka.producer();
let kafkaReady = false;
producer.connect().then(() => { kafkaReady = true; }).catch((err) => fastify.log.warn({ err: err.message }, '[kafka] not connected (notifications disabled)'));

async function publish(topic: string, data: Record<string, unknown>) {
  if (!kafkaReady) return;
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify({ topic, source: 'blockchain-service', timestamp: new Date().toISOString(), data }) }],
  }).catch(() => {});
}

// ── Relayer write queue (one tx at a time → no nonce races) ──

let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

async function writeAndWait(functionName: 'createAgreement' | 'signAgreement' | 'revokeAgreement', args: readonly unknown[]) {
  return enqueue(async () => {
    const { request } = await publicClient.simulateContract({
      address: CONTRACT_ADDRESS!, abi, functionName, args: args as any, account,
    });
    const hash = await walletClient.writeContract(request);
    const receipt = await publicClient.waitForTransactionReceipt({ hash, timeout: 120_000 });
    if (receipt.status !== 'success') throw new Error('Transaction reverted');
    return receipt;
  });
}

/** Turn viem/contract errors into a short message (custom error name if any). */
function chainError(err: any): string {
  const name = err?.cause?.data?.errorName ?? err?.data?.errorName ?? err?.cause?.cause?.data?.errorName;
  if (name) return `Contract rejected: ${name}`;
  return err?.shortMessage ?? 'Blockchain transaction failed';
}

// ── Helpers ───────────────────────────────────────────────────

function bearer(req: any): string | undefined {
  if (req.headers.authorization) return req.headers.authorization;
  const c = req.cookies?.agrilink_access;
  return c ? `Bearer ${c}` : undefined;
}

async function verifyPassword(req: any, password: string): Promise<string | null> {
  const token = bearer(req);
  if (!token) return 'Not authenticated';
  const res = await fetch(`${AUTH_URL}/auth/verify-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body: JSON.stringify({ password }),
    signal: AbortSignal.timeout(10_000),
  }).catch(() => null);
  if (!res) return 'Auth service unavailable';
  if (res.ok) return null;
  const json: any = await res.json().catch(() => ({}));
  return json.error ?? 'Authentication failed';
}

interface FarmerProfile {
  userId: string;
  nameDisplay?: string | null;
  nameEnglish?: string | null;
  surveyNumber?: string | null;
  hissaNumber?: string | null;
  village?: string | null;
  taluk?: string | null;
  district?: string | null;
  totalExtentAcres?: number | null;
  kycStatus: string;
  readyToIntegrate: boolean;
}

async function getProfiles(ids: string[]): Promise<Map<string, FarmerProfile>> {
  const res = await fetch(`${FARMER_URL}/farmer/internal/profiles?ids=${ids.map(encodeURIComponent).join(',')}`, {
    headers: { 'x-internal-key': INTERNAL_KEY },
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`farmer service responded ${res.status}`);
  const json = (await res.json()) as { data: FarmerProfile[] };
  return new Map(json.data.map((p) => [p.userId, p]));
}

const displayName = (p: FarmerProfile) => p.nameEnglish || p.nameDisplay || 'Farmer';
const toCentiacres = (acres?: number | null) => Math.round((acres ?? 0) * 100);

function buildAgreementDocument(p1: FarmerProfile, p2: FarmerProfile, terms: { share1: number; start: number; end: number }) {
  const fmt = (ts: number) => new Date(ts * 1000).toISOString().slice(0, 10);
  const land = (p: FarmerProfile) =>
    `Survey No. ${p.surveyNumber}${p.hissaNumber ? `/${p.hissaNumber}` : ''}, ${[p.village, p.taluk, p.district].filter(Boolean).join(', ')} — ${(p.totalExtentAcres ?? 0).toFixed(2)} acres`;
  return [
    'LAND INTEGRATION & PROFIT SHARING AGREEMENT',
    '',
    `Generated by AgriLink on ${new Date().toISOString()}`,
    '',
    'PARTY 1',
    `  Name: ${displayName(p1)}`,
    `  AgriLink ID: ${p1.userId}`,
    `  Land: ${land(p1)}`,
    '',
    'PARTY 2',
    `  Name: ${displayName(p2)}`,
    `  AgriLink ID: ${p2.userId}`,
    `  Land: ${land(p2)}`,
    '',
    'TERMS',
    `  1. Period: ${fmt(terms.start)} to ${fmt(terms.end)}.`,
    `  2. Profit share: Party 1 ${terms.share1}% / Party 2 ${100 - terms.share1}% of net proceeds.`,
    '  3. Crop selection and inputs are decided jointly.',
    '  4. Either party may revoke before expiry; revocation is recorded on-chain.',
    '',
    'VERIFICATION',
    '  This document is pinned to IPFS. Its content identifier (CID) is stored in the',
    '  LandAgreementRegistry smart contract on Polygon together with both parties\' signatures.',
    '  Party details above are taken from KYC-verified Aadhaar and RTC records.',
    '',
  ].join('\n');
}

async function pinDocument(text: string, agreementKey: string): Promise<string> {
  if (!pinata) throw Object.assign(new Error('IPFS (PINATA_JWT) is not configured'), { statusCode: 503 });
  const stream = Readable.from(Buffer.from(text, 'utf8'));
  (stream as any).path = `agrilink-agreement-${agreementKey}.txt`;
  const result = await pinata.pinFileToIPFS(stream, {
    pinataMetadata: { name: `agrilink-agreement-${agreementKey}`, keyvalues: { platform: 'agrilink' } as any },
  });
  return result.IpfsHash;
}

function shapeAgreement(v: any) {
  const signatureCount = (v.farmer1SignedAt > 0n ? 1 : 0) + (v.farmer2SignedAt > 0n ? 1 : 0);
  return {
    agreementId: v.agreementId,
    relayer: v.relayer,
    farmer1UserId: v.farmer1UserId,
    farmer1Name: v.farmer1Name,
    farmer1Survey: v.farmer1Survey,
    farmer1Centiacres: Number(v.farmer1Centiacres),
    farmer1SharePercent: Number(v.farmer1SharePercent),
    farmer1SignedAt: Number(v.farmer1SignedAt),
    farmer2UserId: v.farmer2UserId,
    farmer2Name: v.farmer2Name,
    farmer2Survey: v.farmer2Survey,
    farmer2Centiacres: Number(v.farmer2Centiacres),
    farmer2SharePercent: Number(v.farmer2SharePercent),
    farmer2SignedAt: Number(v.farmer2SignedAt),
    startTimestamp: Number(v.startTimestamp),
    endTimestamp: Number(v.endTimestamp),
    documentCid: v.documentCid,
    documentUrl: `${PINATA_GATEWAY}/ipfs/${v.documentCid}`,
    status: Number(v.status),
    statusLabel: STATUS[Number(v.status)] ?? 'Unknown',
    signatureCount,
    createdAt: Number(v.createdAt),
    updatedAt: Number(v.updatedAt),
  };
}

async function readAgreement(id: Hex) {
  const v = await publicClient.readContract({ address: CONTRACT_ADDRESS!, abi, functionName: 'getAgreement', args: [id] });
  return shapeAgreement(v);
}

// ── Schemas ───────────────────────────────────────────────────

const AgreementId = z.string().regex(/^0x[0-9a-fA-F]{64}$/, 'Invalid agreement id');

const CreateAgreementSchema = z.object({
  farmer2UserId: z.string().min(1),
  farmer1SharePercent: z.number().int().min(1).max(99),
  durationMonths: z.number().int().min(1).max(120).optional(),
  startTimestamp: z.number().int().optional(),
  endTimestamp: z.number().int().optional(),
  password: z.string().min(1),
}).passthrough();

// ── Server ────────────────────────────────────────────────────

async function start() {
  await fastify.register(FastifyCors, {
    origin: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(','),
    credentials: true,
  });
  await fastify.register(FastifyCookie, { hook: 'onRequest' });
  await fastify.register(FastifyJwt, { secret: process.env.JWT_ACCESS_SECRET! });
  fastify.decorate('authenticate', makeAuthMiddleware(fastify, { redis }));
  const auth = (fastify as any).authenticate;
  registerMetrics(fastify, 'blockchain');

  // Relayer wallet balance — alert before it runs out of gas
  const balanceGauge = gauge('relayer_balance_native', 'Relayer wallet balance (POL / ETH)');
  const refreshBalance = async () => {
    try {
      balanceGauge.set(Number(await publicClient.getBalance({ address: account.address })) / 1e18);
    } catch { /* RPC hiccup */ }
  };
  void refreshBalance();
  setInterval(refreshBalance, 60_000).unref();

  fastify.setErrorHandler(async (error: any, _req, reply) => {
    fastify.log.error({ err: error }, 'Unhandled error');
    return reply.status(error.statusCode ?? 500).send({
      success: false,
      error: process.env.NODE_ENV === 'production' && !error.statusCode ? 'Internal server error' : error.message,
    });
  });

  const requireContract = async (_req: any, reply: any) => {
    if (!CONTRACT_ADDRESS) return reply.status(503).send({ success: false, error: 'Contract not deployed yet' });
  };

  fastify.get('/blockchain/health', async () => {
    let balance: string | undefined;
    try {
      balance = (Number(await publicClient.getBalance({ address: account.address })) / 1e18).toFixed(4);
    } catch { /* RPC down */ }
    return {
      status: 'ok',
      service: 'blockchain',
      network: CHAIN.name,
      contractDeployed: !!CONTRACT_ADDRESS,
      relayer: account.address,
      relayerBalance: balance,   // top up from the free Amoy faucet when low
      ipfs: !!pinata,
    };
  });

  // POST /blockchain/agreements — caller proposes an agreement with a partner
  fastify.post('/blockchain/agreements', {
    preHandler: [auth, requireRole('farmer', 'admin'), requireContract],
    config: { rateLimit: { max: 5, timeWindow: '1m' } },
  }, async (req: any, reply) => {
    const parsed = CreateAgreementSchema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ success: false, error: parsed.error.flatten() });
    const d = parsed.data;

    // Admins may file on behalf of a farmer; farmers only for themselves
    const farmer1UserId = req.user.role === 'admin' && typeof (d as any).farmer1UserId === 'string'
      ? (d as any).farmer1UserId
      : req.user.sub;
    if (farmer1UserId === d.farmer2UserId) {
      return reply.status(400).send({ success: false, error: 'Cannot create an agreement with yourself' });
    }

    const pwErr = await verifyPassword(req, d.password);
    if (pwErr) return reply.status(401).send({ success: false, error: pwErr });

    let profiles: Map<string, FarmerProfile>;
    try {
      profiles = await getProfiles([farmer1UserId, d.farmer2UserId]);
    } catch (err: any) {
      fastify.log.error({ err }, 'farmer service lookup failed');
      return reply.status(503).send({ success: false, error: 'Farmer service unavailable' });
    }
    const p1 = profiles.get(farmer1UserId);
    const p2 = profiles.get(d.farmer2UserId);
    if (!p1 || !p2) return reply.status(404).send({ success: false, error: 'Farmer profile not found' });
    if (p1.kycStatus !== 'approved' || p2.kycStatus !== 'approved') {
      return reply.status(403).send({ success: false, error: 'Both farmers must have approved KYC' });
    }
    if (!p2.readyToIntegrate) {
      return reply.status(403).send({ success: false, error: 'Partner is not accepting integration proposals' });
    }
    if (!p1.surveyNumber || !p2.surveyNumber || toCentiacres(p1.totalExtentAcres) <= 0 || toCentiacres(p2.totalExtentAcres) <= 0) {
      return reply.status(400).send({ success: false, error: 'Both farmers need verified land records (survey number and extent)' });
    }

    const now = Math.floor(Date.now() / 1000);
    const start = Math.max(d.startTimestamp ?? now, now - 3600);
    const end = d.durationMonths ? start + d.durationMonths * 30 * 86400 : (d.endTimestamp ?? 0);
    if (end <= start) return reply.status(400).send({ success: false, error: 'Invalid agreement period' });

    const terms = { share1: d.farmer1SharePercent, start, end };
    const docText = buildAgreementDocument(p1, p2, terms);
    const docHash = createHash('sha256').update(docText).digest('hex');

    try {
      const cid = await pinDocument(docText, docHash.slice(0, 16));

      const createReceipt = await writeAndWait('createAgreement', [{
        farmer1UserId: p1.userId,
        farmer1Name: displayName(p1),
        farmer1Survey: p1.surveyNumber,
        farmer1Centiacres: toCentiacres(p1.totalExtentAcres),
        farmer1SharePercent: terms.share1,
        farmer2UserId: p2.userId,
        farmer2Name: displayName(p2),
        farmer2Survey: p2.surveyNumber,
        farmer2Centiacres: toCentiacres(p2.totalExtentAcres),
        farmer2SharePercent: 100 - terms.share1,
        startTimestamp: BigInt(start),
        endTimestamp: BigInt(end),
        documentCid: cid,
      }]);

      let agreementId: Hex | undefined;
      for (const log of createReceipt.logs) {
        try {
          const ev = decodeEventLog({ abi, data: log.data, topics: log.topics });
          if (ev.eventName === 'AgreementCreated') { agreementId = (ev.args as any).agreementId; break; }
        } catch { /* other contract's log */ }
      }
      if (!agreementId) throw new Error('AgreementCreated event not found');

      // The proposer has just re-authenticated → record their signature too
      await writeAndWait('signAgreement', [agreementId, p1.userId]);

      await publish('land.agreement.created', {
        userId: p2.userId,
        agreementId,
        proposerName: displayName(p1),
        subject: 'New land integration proposal',
        body: `${displayName(p1)} proposed a land integration agreement. Review and sign it in AgriLink.`,
      });

      return reply.status(201).send({
        success: true,
        data: {
          agreementId,
          txHash: createReceipt.transactionHash,
          blockNumber: createReceipt.blockNumber.toString(),
          network: CHAIN.name,
          documentCid: cid,
          documentUrl: `${PINATA_GATEWAY}/ipfs/${cid}`,
        },
      });
    } catch (err: any) {
      fastify.log.error({ err }, 'createAgreement failed');
      return reply.status(err.statusCode ?? 502).send({ success: false, error: err.statusCode ? err.message : chainError(err) });
    }
  });

  // POST /blockchain/agreements/:id/sign — counter-sign as the logged-in farmer
  fastify.post('/blockchain/agreements/:id/sign', {
    preHandler: [auth, requireRole('farmer'), requireContract],
    config: { rateLimit: { max: 10, timeWindow: '1m' } },
  }, async (req: any, reply) => {
    const id = AgreementId.safeParse(req.params.id);
    if (!id.success) return reply.status(400).send({ success: false, error: 'Invalid agreement id' });
    const { password } = (req.body ?? {}) as { password?: string };
    if (!password) return reply.status(400).send({ success: false, error: 'Password is required for signing' });

    const pwErr = await verifyPassword(req, password);
    if (pwErr) return reply.status(401).send({ success: false, error: pwErr });

    try {
      const receipt = await writeAndWait('signAgreement', [id.data as Hex, req.user.sub]);
      const agreement = await readAgreement(id.data as Hex);
      const other = agreement.farmer1UserId === req.user.sub ? agreement.farmer2UserId : agreement.farmer1UserId;
      await publish('land.agreement.signed', {
        userId: other,
        agreementId: id.data,
        subject: agreement.status === 2 ? 'Land agreement is now active' : 'Land agreement signed',
        body: agreement.status === 2
          ? 'Both parties have signed. Your land integration agreement is active on-chain.'
          : 'Your partner signed the land integration agreement.',
      });
      return reply.send({
        success: true,
        data: { txHash: receipt.transactionHash, blockNumber: receipt.blockNumber.toString(), status: agreement.status },
      });
    } catch (err: any) {
      fastify.log.error({ err }, 'signAgreement failed');
      return reply.status(400).send({ success: false, error: chainError(err) });
    }
  });

  // POST /blockchain/agreements/:id/revoke — either party
  fastify.post('/blockchain/agreements/:id/revoke', {
    preHandler: [auth, requireRole('farmer'), requireContract],
    config: { rateLimit: { max: 5, timeWindow: '1m' } },
  }, async (req: any, reply) => {
    const id = AgreementId.safeParse(req.params.id);
    if (!id.success) return reply.status(400).send({ success: false, error: 'Invalid agreement id' });
    const { password, reason } = (req.body ?? {}) as { password?: string; reason?: string };
    if (!password) return reply.status(400).send({ success: false, error: 'Password is required' });

    const pwErr = await verifyPassword(req, password);
    if (pwErr) return reply.status(401).send({ success: false, error: pwErr });

    try {
      const receipt = await writeAndWait('revokeAgreement', [id.data as Hex, req.user.sub, String(reason ?? '').slice(0, 200)]);
      return reply.send({ success: true, data: { txHash: receipt.transactionHash } });
    } catch (err: any) {
      return reply.status(400).send({ success: false, error: chainError(err) });
    }
  });

  // GET /blockchain/agreements/me — agreements where the caller is a party
  const listFor = async (userId: string) => {
    const ids = await publicClient.readContract({
      address: CONTRACT_ADDRESS!, abi, functionName: 'getPartyAgreements', args: [userId],
    }) as readonly Hex[];
    const results = await Promise.allSettled(ids.map((id) => readAgreement(id)));
    return results.flatMap((r) => (r.status === 'fulfilled' ? [r.value] : [])).sort((a, b) => b.createdAt - a.createdAt);
  };

  fastify.get('/blockchain/agreements/me', { preHandler: [auth, requireContract] }, async (req: any, reply) => {
    try {
      return reply.send({ success: true, data: { agreements: await listFor(req.user.sub) } });
    } catch (err: any) {
      return reply.status(502).send({ success: false, error: chainError(err) });
    }
  });

  // GET /blockchain/agreements/user/:userId — admin, or the user themselves
  fastify.get('/blockchain/agreements/user/:userId', { preHandler: [auth, requireContract] }, async (req: any, reply) => {
    const { userId } = req.params as { userId: string };
    if (req.user.role !== 'admin' && req.user.sub !== userId) {
      return reply.status(403).send({ success: false, error: 'Access denied' });
    }
    try {
      return reply.send({ success: true, data: { agreements: await listFor(userId) } });
    } catch (err: any) {
      return reply.status(502).send({ success: false, error: chainError(err) });
    }
  });

  // GET /blockchain/agreements/:id — public on-chain data, shown to parties/admin
  fastify.get('/blockchain/agreements/:id', { preHandler: [auth, requireContract] }, async (req: any, reply) => {
    const id = AgreementId.safeParse(req.params.id);
    if (!id.success) return reply.status(400).send({ success: false, error: 'Invalid agreement id' });
    try {
      const agreement = await readAgreement(id.data as Hex);
      if (req.user.role !== 'admin' && ![agreement.farmer1UserId, agreement.farmer2UserId].includes(req.user.sub)) {
        return reply.status(404).send({ success: false, error: 'Agreement not found' });
      }
      return reply.send({ success: true, data: agreement });
    } catch (err: any) {
      return reply.status(404).send({ success: false, error: chainError(err) });
    }
  });
}

// ── Start ─────────────────────────────────────────────────────

async function main() {
  await start();
  const PORT = Number(process.env.BLOCKCHAIN_PORT ?? 4007);
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  fastify.log.info(`⛓️  Blockchain service on :${PORT} [${CHAIN.name}] relayer=${account.address}`);
}

const shutdown = async () => {
  await fastify.close();
  await producer.disconnect().catch(() => {});
  redis.disconnect();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
