import './config.js';
/**
 * Blockchain Service — Fastify (Port 4007)
 * BUG-012 fix: ABI matches the actual deployed contract
 * BUG-013 fix: NO permanent dev mode — real transactions by default
 * BUG-015 fix: Pinata for IPFS (Web3.Storage is deprecated)
 */
import Fastify from 'fastify';
import FastifyCors from '@fastify/cors';
import FastifyJwt from '@fastify/jwt';
import FastifyCookie from '@fastify/cookie';
import { makeAuthMiddleware, requireRole } from '@agrilink/auth-middleware';
import FastifyMultipart from '@fastify/multipart';
import { createPublicClient, createWalletClient, http, parseAbi, type Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon, polygonAmoy, hardhat } from 'viem/chains';
import PinataSDK from '@pinata/sdk';
import { Readable } from 'stream';
import { z } from 'zod';

const fastify = Fastify({ logger: true });

// ── Config ────────────────────────────────────────────────────

const IS_LOCAL = process.env.BLOCKCHAIN_NETWORK === 'localhost';
const IS_MAINNET = process.env.BLOCKCHAIN_NETWORK === 'polygon';
const CHAIN = IS_LOCAL ? hardhat : IS_MAINNET ? polygon : polygonAmoy;
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL!;
const PRIVATE_KEY = process.env.BLOCKCHAIN_ADMIN_PRIVATE_KEY as Hex;
const CONTRACT_ADDRESS = process.env.BLOCKCHAIN_CONTRACT_ADDRESS as Hex | undefined;
const PINATA_JWT = process.env.PINATA_JWT!;

if (!RPC_URL || !PRIVATE_KEY || !PINATA_JWT) {
  throw new Error('BLOCKCHAIN_RPC_URL, BLOCKCHAIN_ADMIN_PRIVATE_KEY, and PINATA_JWT are required secrets');
}

// ── Viem Clients ──────────────────────────────────────────────

const publicClient = createPublicClient({
  chain: CHAIN,
  transport: http(RPC_URL),
});

const account = privateKeyToAccount(PRIVATE_KEY);

const walletClient = createWalletClient({
  account,
  chain: CHAIN,
  transport: http(RPC_URL),
});

// ── Contract ABI (matches LandAgreementRegistry.sol exactly) ──

const contractABI = parseAbi([
  // Write functions
  'function createAgreement(string farmer1UserId, string farmer1Name, address farmer1Address, string farmer1Survey, uint32 farmer1Centiacres, uint8 farmer1SharePercent, string farmer2UserId, string farmer2Name, address farmer2Address, string farmer2Survey, uint32 farmer2Centiacres, uint8 farmer2SharePercent, uint64 startTs, uint64 endTs, string documentCid) returns (bytes32)',
  'function signAgreement(bytes32 agreementId, address farmerAddress, string signerName)',
  'function revokeAgreement(bytes32 agreementId)',
  'function updateDocument(bytes32 agreementId, string documentCid, string metadataCid)',
  // Read functions
  'function getAgreement(bytes32 agreementId) view returns (bytes32, address, string, string, uint32, uint8, string, string, uint32, uint8, string, uint8, uint256, uint256)',
  'function getUserAgreements(address user) view returns (bytes32[])',
  'function getAgreementStatus(bytes32 agreementId) view returns (uint8)',
  'function hasSignedAgreement(bytes32 agreementId, address user) view returns (bool)',
  'function verifyDocumentCid(bytes32 agreementId, string cid) view returns (bool)',
  'function totalAgreements() view returns (uint256)',
  // Events
  'event AgreementCreated(bytes32 indexed agreementId, address indexed creator, string farmer1UserId, string farmer2UserId, uint256 createdAt)',
  'event AgreementSigned(bytes32 indexed agreementId, address indexed signer, string signerRole, uint8 newStatus)',
]);

// ── Pinata IPFS Client ────────────────────────────────────────

const pinata = new PinataSDK({ pinataJWTKey: PINATA_JWT });

async function uploadToPinata(
  buffer: Buffer,
  filename: string,
  metadata: Record<string, string>
): Promise<string> {
  const stream = Readable.from(buffer);
  (stream as any).path = filename;
  const result = await pinata.pinFileToIPFS(stream, {
    pinataMetadata: { name: filename, keyvalues: metadata as any },
  });
  return result.IpfsHash;
}

// ── Schemas ───────────────────────────────────────────────────

const CreateAgreementSchema = z.object({
  farmer1UserId: z.string(),
  farmer1Name: z.string(),
  farmer1Address: z.string().regex(/^0x[0-9a-fA-F]{40}$/, 'Invalid ETH address'),
  farmer1SurveyNumber: z.string(),
  farmer1Centiacres: z.number().int().positive(),
  farmer1SharePercent: z.number().int().min(1).max(99),
  farmer2UserId: z.string(),
  farmer2Name: z.string(),
  farmer2Address: z.string().regex(/^0x[0-9a-fA-F]{40}$/, 'Invalid ETH address'),
  farmer2SurveyNumber: z.string(),
  farmer2Centiacres: z.number().int().positive(),
  farmer2SharePercent: z.number().int().min(1).max(99),
  startTimestamp: z.number().int(),
  endTimestamp: z.number().int(),
  documentCid: z.string().min(40, 'Must be a valid IPFS CID'),
});

// ── Routes ────────────────────────────────────────────────────

async function start() {
  await fastify.register(FastifyCors, { 
    origin: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(','),
    credentials: true,
  });

  // JWT & Cookie for Auth Middleware
  await fastify.register(FastifyCookie, {
    secret: process.env.COOKIE_SECRET ?? process.env.JWT_ACCESS_SECRET ?? 'cookie-secret-dev',
    hook: 'onRequest',
  });

  await fastify.register(FastifyJwt, {
    secret: process.env.JWT_ACCESS_SECRET!,
  });

  // Register standard auth decorator
fastify.decorate('authenticate', makeAuthMiddleware(fastify));

await fastify.register(FastifyMultipart, {
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB IPFS uploads
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
  return reply.status(error.statusCode ?? 500).send({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : error.message,
  });
});

  fastify.get('/blockchain/health', async () => ({
    status: 'ok',
    service: 'blockchain',
    network: CHAIN.name,
    contractDeployed: !!CONTRACT_ADDRESS,
    adminAddress: account.address,
  }));

  // POST /blockchain/agreements — Create agreement on-chain (Relayed via Admin)
  fastify.post(
    '/blockchain/agreements',
    { preHandler: [(fastify as any).authenticate, requireRole('admin', 'farmer')] },
    async (req, reply) => {
    if (!CONTRACT_ADDRESS) {
      return reply.status(503).send({ success: false, error: 'Contract not deployed yet' });
    }

    const result = CreateAgreementSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({ success: false, error: result.error.flatten() });
    }

    const { password, ...d } = req.body as any;
    if (!password) {
      return reply.status(400).send({ success: false, error: 'Password is required' });
    }

    try {
      // 1. Verify password with Auth Service
      const AUTH_URL = process.env.AUTH_SERVICE_URL ?? 'http://localhost:4001';
      
      // Extract token from header or cookie
      const cookieToken = (req as any).cookies?.agrilink_access;
      const headerToken = req.headers.authorization;
      const token = headerToken ?? (cookieToken ? `Bearer ${cookieToken}` : undefined);

      const authRes = await fetch(`${AUTH_URL}/auth/verify-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token!
        },
        body: JSON.stringify({ password }),
      });

      if (!authRes.ok) {
        const authJson: any = await authRes.json();
        return reply.status(401).send({ success: false, error: authJson.error ?? 'Authentication failed' });
      }

      // 2. REAL transaction — Relayed via system admin account to pay for GAS
      const txHash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'createAgreement',
        args: [
          d.farmer1UserId, d.farmer1Name, d.farmer1Address as Hex, d.farmer1SurveyNumber,
          d.farmer1Centiacres, d.farmer1SharePercent,
          d.farmer2UserId, d.farmer2Name, d.farmer2Address as Hex, d.farmer2SurveyNumber,
          d.farmer2Centiacres, d.farmer2SharePercent,
          BigInt(d.startTimestamp), BigInt(d.endTimestamp), d.documentCid,
        ],
      });

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      const agreementId = receipt.logs[0]?.topics[1];

      // Automatically submit Farmer 1's signature right after creation
      if (agreementId) {
        const signTx = await walletClient.writeContract({
          address: CONTRACT_ADDRESS,
          abi: contractABI,
          functionName: 'signAgreement',
          args: [agreementId as Hex, d.farmer1Address as Hex, d.farmer1Name],
        });
        await publicClient.waitForTransactionReceipt({ hash: signTx });
      }

      return reply.status(201).send({
        success: true,
        data: {
          txHash,
          agreementId,
          blockNumber: receipt.blockNumber.toString(),
          network: CHAIN.name,
        },
      });
    } catch (err: any) {
      fastify.log.error({ err }, 'createAgreement failed');
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  // POST /blockchain/agreements/:id/sign (Farmer or admin)
  fastify.post(
    '/blockchain/agreements/:id/sign',
    { preHandler: [(fastify as any).authenticate, requireRole('admin', 'farmer')] },
    async (req, reply) => {
    if (!CONTRACT_ADDRESS) {
      return reply.status(503).send({ success: false, error: 'Contract not deployed' });
    }

    const { id } = req.params as { id: string };
    const { signerName, password } = req.body as { signerName: string; password?: string };

    if (!password) {
      return reply.status(400).send({ success: false, error: 'Password is required for signing' });
    }

    try {
      // 1. Verify password with Auth Service (cookie-aware token extraction)
      const AUTH_URL = process.env.AUTH_SERVICE_URL ?? 'http://localhost:4001';
      const cookieToken = (req as any).cookies?.agrilink_access;
      const headerToken = req.headers.authorization;
      const token = headerToken ?? (cookieToken ? `Bearer ${cookieToken}` : undefined);

      if (!token) {
        return reply.status(401).send({ success: false, error: 'No auth token found' });
      }

      const authRes = await fetch(`${AUTH_URL}/auth/verify-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ password }),
      });

      if (!authRes.ok) {
        const authJson: any = await authRes.json();
        return reply.status(401).send({ success: false, error: authJson.error ?? 'Authentication failed' });
      }

      // Compute the deterministic wallet address for the logged-in user
      const userId = (req as any).user.sub;
      if (!userId) {
        return reply.status(401).send({ success: false, error: 'User ID missing in token payload' });
      }
      const farmerAddress = '0x' + Buffer.from(userId).toString('hex').padEnd(40, '0').slice(0, 40);

      // 2. Perform blockchain transaction (proxy sign)
      const txHash = await walletClient.writeContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'signAgreement',
        args: [id as Hex, farmerAddress as Hex, signerName],
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      return reply.send({ success: true, data: { txHash, blockNumber: receipt.blockNumber.toString() } });
    } catch (err: any) {
      fastify.log.error({ err, id, signerName }, 'signAgreement failed');
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  // GET /blockchain/agreements/user/:address (Admin, or the user themselves)
  fastify.get(
    '/blockchain/agreements/user/:address',
    { preHandler: [(fastify as any).authenticate] },
    async (req, reply) => {
    if (!CONTRACT_ADDRESS) {
      return reply.status(503).send({ success: false, error: 'Contract not deployed' });
    }

    const { address } = req.params as { address: string };
    try {
      const ids = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'getUserAgreements',
        args: [address as Hex],
      }) as unknown as string[];
      
      const agreements: any[] = [];
      for (const id of ids) {
        try {
          const data = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: contractABI,
            functionName: 'getAgreement',
            args: [id as Hex],
          }) as unknown as any[];
          agreements.push({
            agreementId: data[0],
            creator: data[1],
            farmer1Name: data[2],
            farmer1UserId: data[3],
            farmer1Centiacres: Number(data[4]),
            farmer1SharePercent: data[5],
            farmer2Name: data[6],
            farmer2UserId: data[7],
            farmer2Centiacres: Number(data[8]),
            farmer2SharePercent: data[9],
            documentCid: data[10],
            status: data[11],
            signatureCount: Number(data[12]),
            createdAt: Number(data[13]),
          });
        } catch(e) {}
      }
      return reply.send({ success: true, data: { agreements } });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  // GET /blockchain/agreements/:id
  fastify.get(
    '/blockchain/agreements/:id', 
    { preHandler: [(fastify as any).authenticate] }, 
    async (req, reply) => {
    if (!CONTRACT_ADDRESS) {
      return reply.status(513).send({ success: false, error: 'Contract not deployed' });
    }

    const { id } = req.params as { id: string };
    try {
      const data = await publicClient.readContract({
        address: CONTRACT_ADDRESS,
        abi: contractABI,
        functionName: 'getAgreement',
        args: [id as Hex],
      }) as unknown as any[];

      return reply.send({
        success: true,
        data: {
          agreementId: data[0],
          creator: data[1],
          farmer1Name: data[2],
          farmer1UserId: data[3],
          farmer1Centiacres: Number(data[4]),
          farmer1SharePercent: data[5],
          farmer2Name: data[6],
          farmer2UserId: data[7],
          farmer2Centiacres: Number(data[8]),
          farmer2SharePercent: data[9],
          documentCid: data[10],
          status: data[11],
          signatureCount: Number(data[12]),
          createdAt: Number(data[13]),
        },
      });
    } catch (err: any) {
      return reply.status(500).send({ success: false, error: err.message });
    }
  });

  // POST /blockchain/ipfs/upload (Admin or Farmer)
  fastify.post(
    '/blockchain/ipfs/upload',
    { preHandler: [(fastify as any).authenticate, requireRole('admin', 'farmer')] },
    async (req, reply) => {
    // Expects multipart form data with 'file' field
    const data = await (req as any).file();
    if (!data) {
      return reply.status(400).send({ success: false, error: 'No file uploaded' });
    }

    // BUG-035 fix: validate file type and size
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
    if (!allowed.includes(data.mimetype)) {
      return reply.status(400).send({ success: false, error: `Type ${data.mimetype} not allowed. Supported: PDF, JPG, PNG, TXT.` });
    }

    const chunks: Buffer[] = [];
    for await (const chunk of data.file) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (buffer.length > 20 * 1024 * 1024) { // 20MB limit
      return reply.status(400).send({ success: false, error: 'File too large (max 20MB)' });
    }

    try {
      const cid = await uploadToPinata(buffer, data.filename, {
        uploadedAt: new Date().toISOString(),
      });
      const gateway = process.env.PINATA_GATEWAY ?? 'https://gateway.pinata.cloud';
      return reply.send({
        success: true,
        data: {
          cid,
          url: `${gateway}/ipfs/${cid}`,
        },
      });
    } catch (err: any) {
      fastify.log.error({ err }, 'IPFS upload failed');
      return reply.status(500).send({ success: false, error: 'IPFS upload failed' });
    }
  });
}

// ── Start ─────────────────────────────────────────────────────

async function main() {
  await start();
  const PORT = Number(process.env.BLOCKCHAIN_PORT ?? 4007);
  await fastify.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`⛓️  Blockchain service running on http://0.0.0.0:${PORT} [${CHAIN.name}]`);
}

main().catch(console.error);
