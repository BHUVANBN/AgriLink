# AgriLink v2 🌾

> **Agricultural Intelligence Platform** — A production-grade microservices application for Karnataka's farmers.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![Fastify](https://img.shields.io/badge/Fastify-5.3-green)](https://fastify.dev)
[![Polygon](https://img.shields.io/badge/Blockchain-Polygon_Amoy-purple)](https://polygon.technology)

---

## Architecture Overview

```
                        ┌─────────────────────────────────┐
                        │         Nginx API Gateway         │
                        │         (Port 8080)               │
                        └──────────────┬──────────────────┘
                                       │
         ┌─────────────────────────────┼──────────────────────────────┐
         │                             │                              │
    /auth/*                       /farmer/*                     /supplier/*
         │                             │                              │
   ┌─────▼──────┐             ┌────────▼───────┐           ┌────────▼───────┐
   │  Auth Svc  │             │  Farmer Svc    │           │  Supplier Svc  │
   │  Port 4001 │             │  Port 4002     │           │  Port 4003     │
   │  MongoDB   │             │  MongoDB       │           │  PostgreSQL    │
   └────────────┘             └────────────────┘           └────────────────┘
         │                             │
    /marketplace/*               /ml/*  /blockchain/*
         │                             │
   ┌─────▼──────┐             ┌────────▼───────┐
   │ Market Svc │             │  ML Service    │  ┌──────────────────┐
   │  Port 4004 │             │  Port 4006     │  │ Blockchain Svc   │
   │ PostgreSQL │             │  FastAPI/Python │  │  Port 4007       │
   │  Razorpay  │             │  Vision AI     │  │  Viem + Pinata   │
   └─────┬──────┘             │  Selenium      │  │  Polygon Amoy    │
         │                    └────────────────┘  └──────────────────┘
         │                  Kafka Events
         ▼
   ┌─────────────┐
   │ Notif. Svc  │  → Email (Nodemailer) + SMS (Fast2SMS)
   │  Port 4005  │
   └─────────────┘
```

## Fixed Bugs (40 total from audit)

| # | Bug | Fix |
|---|-----|-----|
| BUG-002 | Two conflicting `User` models | Single canonical model in auth service |
| BUG-003 | OTP stored as plain text | bcrypt hashed before storage |
| BUG-004 | No OTP resend endpoint | `/auth/resend-otp` with 60s cooldown |
| BUG-005 | SMS never actually sent | `sendOtpSms()` called in parallel with email |
| BUG-006 | TLS disabled in production | `rejectUnauthorized: NODE_ENV === 'production'` |
| BUG-008 | JWT never expires | 1h access + 7d refresh token architecture |
| BUG-009 | Supplier auto-verified | `kycStatus: 'not_started'` — admin must approve |
| BUG-010 | Email verification bypassable | Login always enforces `emailVerified` check |
| BUG-011 | No payment system | Full Razorpay integration with HMAC verification |
| BUG-012 | Multiple contract versions | Single `LandAgreementRegistry.sol` |
| BUG-013 | Permanent dev mode | Real transactions by default |
| BUG-015 | Web3.Storage deprecated | Pinata IPFS integration |
| BUG-016 | No deployment script | `services/blockchain/scripts/deploy.ts` |
| BUG-017 | Float acres in Solidity | `uint32 centiacres` (1 acre = 100 centiacres) |
| BUG-018 | pdftotext for OCR | pdf2image + Google Vision AI |
| BUG-019 | Fragile regex extraction | Gemini AI prompts for structured extraction |
| BUG-020 | `normalizeName` corrupts display | Separate `nameDisplay` vs `nameNormalized` |
| BUG-022 | Schemes from static Excel | MongoDB + Selenium scrapers for live data |
| BUG-023 | Manual RTC PDF only | Bhoomi Selenium scraper with CAPTCHA OCR |
| BUG-025 | Duplicate Product models | Single Prisma model in supplier service |
| BUG-026 | Legacy FarmerProfile fields | Clean schema — removed all deprecated fields |
| BUG-027 | OCR text stored inline | IPFS CID + Cloudinary URL stored instead |
| BUG-028 | Hardcoded dashboard stats | Real API: `/farmer/stats` endpoint |
| BUG-036 | OTP logged in plain text | Never log OTP value in any environment |
| BUG-039 | No Hardhat config | Polygon Amoy + Mainnet configured |
| BUG-040 | ML not accessible via HTTP | FastAPI wrapper at port 4006 |
| BUG-041 | Prisma client collisions | Isolated `./prisma/client` per service |
| BUG-042 | Shared DB pool risk | Service-specific `DATABASE_URL_...` isolation |
| BUG-043 | No predictive monitoring | ML-driven price volatility alerts via Kafka |
| BUG-044 | Unsecured payment verify | Mandatory JWT + HMAC signature verification |

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, Framer Motion, SWR |
| CSS | Tailwind CSS 4, Custom design system |
| Auth Service | Fastify 5, MongoDB, bcryptjs, JWT |
| Farmer Service | Fastify 5, MongoDB, Cloudinary |
| Supplier Service | Fastify 5, PostgreSQL, Prisma |
| Marketplace Service | Fastify 5, PostgreSQL, Prisma, Razorpay |
| Notification Service | Fastify 5, Kafka, Nodemailer, Fast2SMS |
| ML Service | FastAPI, Google Vision AI, Gemini, Tesseract, Selenium |
| Blockchain Service | Fastify 5, Viem, Pinata, Hardhat, Polygon |
| Message Bus | Apache Kafka |
| Cache | Redis (Valkey) |
| API Gateway | Nginx |
| Monitoring | Prometheus + Grafana |
| Infrastructure | Docker, Docker Compose |

## Quick Start

### 1. Prerequisites

```bash
# Install required tools
node --version   # v20+ required
pnpm --version   # v9+ required (npm install -g pnpm)
docker --version # Docker + Compose required
```

### 2. Environment Setup

```bash
cd /home/batman/AgriLink_v2
cp .env.example .env
# Edit .env and fill in all CHANGE_ME values
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Development (all services locally)

```bash
# Start infrastructure only (DB, Kafka, Redis)
docker compose -f infrastructure/docker-compose.yml up mongodb-auth mongodb-farmer mongodb-ml postgres redis kafka zookeeper -d

# Run all services in dev mode
pnpm dev

# Or run a single service
pnpm --filter @agrilink/auth dev
pnpm --filter @agrilink/farmer dev
```

### 5. Full Docker Build

```bash
docker compose -f infrastructure/docker-compose.yml --env-file .env up --build
```

### 6. Deploy Blockchain Contract

```bash
# Fund your admin wallet from: https://faucet.polygon.technology/
pnpm --filter @agrilink/blockchain deploy:amoy

# Copy the contract address from output and add to .env:
# BLOCKCHAIN_CONTRACT_ADDRESS=0x...

# Verify on PolygonScan:
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

## Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API Gateway | http://localhost:8080 |
| Auth Service | http://localhost:4001 |
| Farmer Service | http://localhost:4002 |
| Supplier Service | http://localhost:4003 |
| Marketplace Service | http://localhost:4004 |
| ML Service | http://localhost:4006 |
| Blockchain Service | http://localhost:4007 |
| Kafka UI | http://localhost:8090 (dev profile) |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 |

## Project Structure

```
AgriLink_v2/
├── apps/
│   └── web/                    # Next.js 15 Frontend
├── services/
│   ├── auth/                   # Auth, OTP, JWT (Port 4001)
│   ├── farmer/                 # Farmer profile, KYC, OCR (Port 4002)
│   ├── supplier/               # Supplier, Products, KYC (Port 4003)
│   ├── marketplace/            # Orders, Razorpay, Cart (Port 4004)
│   ├── notification/           # Kafka consumer, Email+SMS (Port 4005)
│   ├── blockchain/             # Viem, Pinata, Polygon (Port 4007)
│   └── ml_service/             # FastAPI, Vision AI, Selenium (Port 4006)
├── packages/
│   ├── types/                  # Shared TypeScript interfaces
│   └── tsconfig/               # Shared TypeScript configs
├── infrastructure/
│   ├── docker-compose.yml      # 15-container orchestration
│   ├── nginx/nginx.conf        # API Gateway routing
│   ├── postgres/               # Multi-DB init script
│   └── prometheus/             # Metrics config
├── .env.example                # Template for all env vars
├── package.json                # Turborepo root
├── pnpm-workspace.yaml         # pnpm workspaces
└── turbo.json                  # Build pipeline
```

## Security Checklist

- [x] OTPs hashed with bcrypt before storage
- [x] JWT: short-lived access (1h) + long refresh (7d) with revocation
- [x] Passwords: bcrypt with cost factor 12
- [x] Rate limiting on all auth endpoints
- [x] File upload: type + size validation
- [x] Razorpay: HMAC signature verification
- [x] CORS: whitelist-based
- [x] Helmet.js security headers
- [x] Non-root Docker users
- [x] No secrets committed (all in .env)

---

Built for **1.2 crore Karnataka farmers** 🌾
