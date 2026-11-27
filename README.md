# 🌾 AgriLink

A platform for Karnataka farmers and agri-input suppliers:

- **Farmers** verify identity and land (Aadhaar + RTC via OCR / Bhoomi), map their parcel, discover eligible government schemes, see crop price forecasts and weather, buy inputs, and pool land with neighbours under **agreements recorded on a public blockchain**.
- **Suppliers** pass KYC, list products, manage stock and fulfil orders.
- **Admins** run the KYC queue, users, schemes, broadcasts and audit logs.

Everything runs on **free tiers or self-hosted open-source software** — no paid services required.

---

## Architecture

```
Browser ──HTTPS──► Caddy (free Let's Encrypt TLS)
                     ├─► Next.js web (:3000)
                     └─► Nginx API gateway (:8080)  rate limits · blocks /*/internal/* · WebSockets
                           ├─ /auth          Auth (4001)          users, OTP, JWT, admin, audit
                           ├─ /farmer        Farmer (4002)        KYC docs, land, schemes, weather
                           ├─ /supplier      Supplier (4003)      catalogue, stock, supplier orders
                           ├─ /marketplace   Marketplace (4004)   cart, orders, Razorpay, reviews
                           ├─ /notification  Notification (4005)  Kafka → Socket.IO / email / SMS
                           ├─ /ml            ML (4006, FastAPI)   OCR, Bhoomi, schemes, forecasts
                           └─ /blockchain    Blockchain (4007)    relayer → LandAgreementRegistry
         Kafka (KRaft) — domain events      Valkey — revocation, rate limits, cache, Socket.IO fan-out
         Postgres (Neon free or self-hosted) — one database per service
```

| Concern | Free component |
|---|---|
| Databases | Neon free tier, or self-hosted Postgres (`--profile localdb`) |
| Cache / sessions / pub-sub | Valkey (BSD Redis fork) |
| Events | Apache Kafka in KRaft mode (no ZooKeeper) |
| Files | Cloudinary free — KYC docs stored **private**, served via 15-min signed links |
| OCR / extraction | Google Vision free quota + Groq free tier, Tesseract fallback |
| Payments | Razorpay test mode (+ webhook) |
| Blockchain | Polygon **Amoy** testnet (faucet-funded), Pinata free IPFS |
| TLS | Caddy + Let's Encrypt |
| Hosting | Any free VM (e.g. Oracle Cloud Always Free ARM, 4 vCPU / 24 GB) |

### Reliability

- **No lost events.** Every service that publishes domain events uses an outbox (`@agrilink/platform`): if Kafka is unavailable the event is stored in that service's database and delivered when Kafka recovers. Paid-order and COD `order.placed` events are written in the *same database transaction* as the order change. Consumers are idempotent and supervised (auto-restart after broker failures).
- **Revocation everywhere.** Logout / password change / suspension invalidate sessions immediately in all Node services and the ML service (Valkey-backed).

### Key flows

- **Auth**: 15-minute access token + 7-day refresh token in HttpOnly cookies. The web app refreshes transparently on 401 (`apps/web/lib/authRefresh.ts`). The auth service mirrors each user's `tokenVersion` / suspension into Valkey, and **every service** checks it (`@agrilink/auth-middleware`), so logout, password change and suspension take effect immediately platform-wide.
- **Checkout**: the browser sends only product IDs + quantities. The marketplace re-prices everything from the supplier catalogue (`POST /supplier/products/public/quote`), checks stock, applies the supplier's GST config and creates one order per supplier. One Razorpay payment covers the whole checkout; the amount is always computed server-side. Payment is confirmed by checkout signature **and** a signed webhook, idempotently, and `order.placed` is published exactly once per order.
- **KYC**: Aadhaar + RTC are OCR'd; names are matched. Only an **exact** full-name match may auto-approve (`KYC_AUTO_APPROVE`); anything else goes to the admin queue.
- **Land agreements (blockchain)**: see below.

---

## 🔗 Land agreements on-chain

`services/blockchain/contracts/LandAgreementRegistry.sol` (v2) is a tamper-evident registry:

- **Gasless for farmers.** The backend relayer wallet pays gas (free Amoy POL from the faucet). Farmers never need a wallet.
- **Identity bound on-chain.** Each party is `keccak256(userId)`, computed by the contract itself, so a record can't be re-pointed at someone else.
- **Server-built document.** The blockchain service fetches both farmers' KYC-verified names, survey numbers and land extents from the farmer service, generates the agreement text, pins it to IPFS, and stores the CID on-chain. `verifyDocumentCid` proves a PDF/text is the signed one.
- **Re-authentication.** Proposing, signing and revoking all require the farmer's password again. The proposer can only create agreements where they are party 1. Both parties must have approved KYC, and the partner must have opted in.
- **Immutable terms.** Records can be signed, expire or be revoked, but never edited.
- **Operational safety.** Multiple relayers with rotation (`setRelayer`) to retire a leaked key, an emergency `setPaused`, and two-step ownership transfer.

Note: agreement records and the IPFS document are **public and permanent**. They contain names, survey numbers and land extents (which are public in RTCs anyway), never Aadhaar data.

### Deploy the contract (free)

```bash
# 1. Create a dedicated wallet, put its key in .env → BLOCKCHAIN_ADMIN_PRIVATE_KEY
# 2. Fund it with free test POL: https://faucet.polygon.technology  (network: Amoy)
make contract-compile
make contract-test          # or: pnpm test:contracts
make contract-deploy-amoy   # prints the address and writes services/blockchain/deployments/amoy.json
# 3. .env → BLOCKCHAIN_CONTRACT_ADDRESS=<printed address>
# 4. (optional, free) verify source: cd services/blockchain && npx hardhat verify --network amoy <address>
```

Local chain for development: `cd services/blockchain && npx hardhat node`, then `make contract-deploy-local` and set `BLOCKCHAIN_NETWORK=localhost`.

`GET /blockchain/health` shows the relayer balance. Top it up from the faucet when it runs low.

---

## Local development

Requires Node 20+, pnpm 9 (`corepack enable`), Docker and Python 3.12 for the ML service tests.

```bash
cp .env.example .env          # fill in values (make secrets prints random ones)
make setup                    # install, build shared packages, generate Prisma clients, compile contract
make db-migrate               # create/sync tables in the databases from .env
make infra                    # Valkey, Kafka, ML service, gateway on :8080 (Docker)
make dev                      # all Node services + web (http://localhost:3000)
```

Swagger UIs: `make docs` (direct service ports, local only).

### Tests

```bash
make test            # unit tests: auth middleware, auth, farmer, supplier, marketplace, notification
make test-contracts  # Hardhat tests for LandAgreementRegistry
make test-ml         # forecasting + Aadhaar checksum/parser tests
make lint            # TypeScript typecheck of every service
make ci              # all of the above
```

---

## 🚀 Deploy for free (single VM)

1. **Get a free VM.** Oracle Cloud *Always Free* Ampere A1 (4 OCPU / 24 GB) is plenty. Open ports 80/443. Install Docker.
2. **DNS.** Point two names at the VM, e.g. `app.example.com` (web) and `api.example.com` (API). A free domain or a free DuckDNS subdomain works.
3. **Configure.**
   ```bash
   git clone <repo> agrilink && cd agrilink
   cp .env.example .env && make secrets >> .env   # then edit .env
   ```
   For production set:
   - `NODE_ENV=production`
   - `WEB_DOMAIN`, `API_DOMAIN`, `ACME_EMAIL`
   - `NEXT_PUBLIC_API_URL=https://api.example.com`
   - `CORS_ORIGINS=https://app.example.com`
   - the database URLs (Neon) or `--profile localdb`
   - Razorpay keys plus the webhook secret
   - Cloudinary, Pinata and the blockchain settings
4. **Create tables:** `make db-migrate`
5. **Start:** `make up-https`. Caddy obtains certificates automatically.
6. **Razorpay webhook:** add `https://api.example.com/marketplace/payment/webhook` with events `payment.captured` and `order.paid`.

### Scaling

- All HTTP services are stateless (sessions live in JWT + Valkey; rate limits are Valkey-backed). Scale one with `make scale S=marketplace-service N=3`. Nginx round-robins across replicas.
- Kafka topics default to 3 partitions, so up to 3 replicas of a consumer share the work. Consumers are idempotent (Kafka is at-least-once).
- Socket.IO uses the Valkey adapter, so a notification reaches the user whichever replica they're connected to. The gateway pins each client to one replica for the long-polling fallback.
- **Blockchain service:** keep one replica per relayer key (one nonce sequence). For more throughput, add relayer wallets with `EXTRA_RELAYERS` at deploy time and run one replica per key.
- When one VM is no longer enough, the same images run on any orchestrator. `infrastructure/terraform` is an AWS EKS reference, and it is **not free**.

### Monitoring (free, self-hosted)

`make monitoring` starts Prometheus, Alertmanager and Grafana (`--profile monitoring`).

- Every service exposes `/metrics` on the internal network only (the gateway returns 404 for it).
- Grafana (`http://localhost:3001`, user `admin` / `GRAFANA_PASSWORD`) ships with an **AgriLink — Platform overview** dashboard: request rate, p95 latency, 5xx by route, outbox backlog, email/SMS delivery, memory, event-loop lag, headless browsers, relayer balance.
- Alerts (emailed via your SMTP to `ALERT_EMAIL`): service down, error rate > 5 %, p95 > 3 s, events stuck in the outbox, relayer wallet < 0.2 POL, email/SMS failures > 20 %.
- On a server, reach the UIs through an SSH tunnel: `ssh -L 3001:localhost:3001 -L 9090:localhost:9090 your-vm`.

### KYC documents & OCR

- Aadhaar numbers are **never stored or returned in full** — only `XXXX XXXX 1234` and whether the Verhoeff checksum passed (which also catches OCR misreads).
- Unreadable documents are rejected with a clear "upload a clearer copy" message instead of being marked verified; for RTCs the farmer can use *Fetch from Bhoomi* instead.
- Measure OCR accuracy on your own labelled samples (keep real scans out of git):
  ```bash
  docker run --rm -v $PWD/samples:/samples --env-file .env agrilink/ml python scripts/eval_ocr.py /samples
  ```
  See `services/ml_service/scripts/eval_ocr.py` for the expected-JSON format.

### Operations

- `make ps`, `make logs S=marketplace-service`, `docker compose … --profile tools up -d kafka-ui` (Kafka UI on 127.0.0.1:8090).
- Backups: Neon has point-in-time restore on the free tier. For `localdb`, schedule `pg_dump` (cron) to another free bucket.
- Free-tier limits to watch:
  - Gmail SMTP: about 500 mails/day. Broadcasts use in-app notifications unless `BROADCAST_EMAIL=true`.
  - Google Vision: 1,000 units/month.
  - Pinata: 1 GB.
  - Neon: compute hours.

---

## Repository layout

```
apps/web                    Next.js 15 frontend
packages/auth-middleware    shared JWT + revocation middleware, internal-key guard
packages/types              shared DTOs / event types
services/auth|farmer|supplier|marketplace|notification   Fastify services (Prisma/Postgres)
services/blockchain         Hardhat contract + relayer service (viem, Pinata)
services/ml_service         FastAPI: OCR, Bhoomi scraper, schemes, forecasting
infrastructure/             docker-compose, Nginx gateway, Caddy, Dockerfiles
```

## License

MIT
