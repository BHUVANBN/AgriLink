# AgriLink — operations console 🌾
# Everything here uses free / open-source tooling.

COMPOSE := docker compose -f infrastructure/docker-compose.yml --env-file .env
SERVICES_WITH_DB := auth farmer supplier marketplace notification

.PHONY: help setup dev infra rerun stop infra-reset db-generate db-migrate test test-contracts contract-test test-ml lint ci \
        contract-compile contract-deploy-local contract-deploy-amoy up up-https monitoring down logs ps scale clean secrets docs

help:
	@echo "AgriLink — make targets"
	@echo ""
	@echo "  Local development (hybrid: infra in Docker, services on host)"
	@echo "    make setup              install deps, build shared packages, generate Prisma clients"
	@echo "    make infra              start Valkey, Kafka, ML service, gateway (:8080)"
	@echo "    make dev                run all Node services + web with hot reload"
	@echo "    make rerun              infra + dev"
	@echo "    make stop               stop infra"
	@echo ""
	@echo "  Database"
	@echo "    make db-generate        generate Prisma clients"
	@echo "    make db-migrate         sync schemas to the databases in .env (non-destructive)"
	@echo ""
	@echo "  Blockchain"
	@echo "    make contract-compile   compile + export ABI"
	@echo "    make contract-deploy-amoy   deploy to Polygon Amoy testnet (free)"
	@echo ""
	@echo "  Quality"
	@echo "    make test | test-contracts | test-ml | lint | ci"
	@echo ""
	@echo "  Production (single VM)"
	@echo "    make secrets            print fresh random secrets for .env"
	@echo "    make up                 build + start full stack (gateway :8080, web :3000)"
	@echo "    make up-https           full stack behind Caddy with automatic HTTPS"
	@echo "    make monitoring         Prometheus + Grafana dashboards + email alerts"
	@echo "    make scale S=marketplace-service N=3"
	@echo "    make logs [S=service]   follow logs"

# ── Development ───────────────────────────────────────────────
setup:
	pnpm install
	pnpm build:packages
	pnpm -r --filter './services/*' --if-present run db:generate
	cd services/blockchain && pnpm run compile

dev:
	pnpm dev

infra:
	$(COMPOSE) --profile dev up -d

rerun: infra dev

stop:
	$(COMPOSE) --profile dev --profile app --profile https --profile tools --profile monitoring down

infra-reset:
	@echo "🚨 Removing Docker volumes (Kafka/Valkey data)…"
	$(COMPOSE) --profile dev --profile app --profile https --profile tools --profile monitoring down -v
	$(COMPOSE) --profile dev up -d

# ── Database ──────────────────────────────────────────────────
db-generate:
	pnpm -r --filter './services/*' --if-present run db:generate

# `prisma db push` WITHOUT --accept-data-loss: refuses destructive changes.
db-migrate:
	@set -e; for s in $(SERVICES_WITH_DB); do \
	  var=DATABASE_URL_$$(echo $$s | tr a-z A-Z); \
	  url=$$(grep -E "^$$var=" .env | cut -d'=' -f2- | tr -d '"'); \
	  if [ -z "$$url" ]; then echo "⚠️  $$var not set — skipping $$s"; continue; fi; \
	  echo "→ $$s"; DATABASE_URL="$$url" pnpm --filter @agrilink/$$s exec prisma db push --skip-generate; \
	done

# ── Blockchain ────────────────────────────────────────────────
contract-compile:
	pnpm --filter @agrilink/blockchain run compile

contract-deploy-local:
	pnpm --filter @agrilink/blockchain run deploy:local

contract-deploy-amoy:
	pnpm --filter @agrilink/blockchain run deploy:amoy

# ── Quality ───────────────────────────────────────────────────
test:
	pnpm build:packages
	pnpm -r --filter './packages/*' --filter './services/*' --filter '!@agrilink/blockchain' --filter '!@agrilink/ml-service' --if-present run test

test-contracts contract-test:
	pnpm test:contracts

test-ml:
	pnpm test:ml

lint:
	pnpm build:packages
	pnpm -r --filter './services/*' --filter '!@agrilink/ml-service' --if-present run lint

ci: lint test test-contracts test-ml
	@echo "✅ AgriLink CI: all checks passed"

# ── Production (single host) ──────────────────────────────────
secrets:
	@for k in JWT_ACCESS_SECRET JWT_REFRESH_SECRET COOKIE_SECRET INTERNAL_API_KEY; do \
	  echo "$$k=$$(openssl rand -hex 32)"; done

up:
	$(COMPOSE) --profile app up -d --build

up-https:
	$(COMPOSE) --profile app --profile https up -d --build

monitoring:
	$(COMPOSE) --profile app --profile monitoring up -d
	@echo "Grafana: http://localhost:3001 (admin / GRAFANA_PASSWORD) · Prometheus: http://localhost:9090"

down:
	$(COMPOSE) --profile app --profile https down

ps:
	$(COMPOSE) --profile app --profile https ps

logs:
	$(COMPOSE) --profile app --profile https logs -f --tail=200 $(S)

scale:
	@test -n "$(S)" -a -n "$(N)" || (echo "usage: make scale S=marketplace-service N=3" && exit 1)
	$(COMPOSE) --profile app up -d --no-recreate --scale $(S)=$(N)
	$(COMPOSE) --profile app exec api-gateway nginx -s reload

docs:
	@echo "Swagger UIs (local dev only — blocked by the gateway in production):"
	@echo "  http://localhost:4001/docs  auth"
	@echo "  http://localhost:4002/docs  farmer"
	@echo "  http://localhost:4003/docs  supplier"
	@echo "  http://localhost:4004/docs  marketplace"
	@echo "  http://localhost:4005/docs  notification"
	@echo "  http://localhost:4006/docs  ml (FastAPI)"

clean:
	find . -name node_modules -type d -prune -exec rm -rf '{}' +
	find . -name dist -type d -prune -not -path './node_modules/*' -exec rm -rf '{}' +
