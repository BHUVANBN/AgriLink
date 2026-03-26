# AgriLink v2 - Platform Operations Unified Console 🌾
# Transforming Indian Agriculture with AI, Blockchain & Real-time Markets

.PHONY: help dev infra rerun stop db-migrate db-generate test test-e2e coverage lint ci docs clean

# ── Development & Services ────────────────────────────────────
dev:
	@echo "Starting all services via Turborepo..."
	pnpm dev

infra:
	@echo "Spinning up Kafka, Postgres, and Redis Core..."
	docker compose -f infrastructure/docker-compose.yml --env-file .env up -d postgres redis zookeeper kafka prometheus grafana kafka-ui ml-service api-gateway

rerun: infra dev

stop:
	@echo "Shutting down infrastructure..."
	docker compose -f infrastructure/docker-compose.yml --env-file .env down

infra-reset:
	@echo "🚨 Full Infrastructure Purge (Purging Docker Volumes)..."
	docker compose -f infrastructure/docker-compose.yml --env-file .env down -v
	@echo "🚀 Restarting Base Infrastructure..."
	docker compose -f infrastructure/docker-compose.yml --env-file .env up -d postgres redis zookeeper kafka prometheus grafana kafka-ui ml-service api-gateway

# ── Data Consistency ──────────────────────────────────────────
db-migrate:
	@echo "Synchronizing all service schemas to Neon..."
	@echo "Migrating Auth..."
	DATABASE_URL="$$(grep DATABASE_URL_AUTH .env | cut -d'=' -f2- | tr -d '\"')" pnpm --filter @agrilink/auth exec prisma db push --skip-generate
	@echo "Migrating Farmer..."
	DATABASE_URL="$$(grep DATABASE_URL_FARMER .env | cut -d'=' -f2- | tr -d '\"')" pnpm --filter @agrilink/farmer exec prisma db push --skip-generate
	@echo "Migrating Marketplace..."
	DATABASE_URL="$$(grep DATABASE_URL_MARKETPLACE .env | cut -d'=' -f2- | tr -d '\"')" pnpm --filter @agrilink/marketplace exec prisma db push --skip-generate
	@echo "Migrating Notification..."
	DATABASE_URL="$$(grep DATABASE_URL_NOTIFICATION .env | cut -d'=' -f2- | tr -d '\"')" pnpm --filter @agrilink/notification exec prisma db push --skip-generate
	@echo "Migrating Supplier..."
	DATABASE_URL="$$(grep DATABASE_URL_SUPPLIER .env | cut -d'=' -f2- | tr -d '\"')" pnpm --filter @agrilink/supplier exec prisma db push --skip-generate

db-generate:
	@echo "Generating Prisma Clients for all 5 services..."
	pnpm recursive exec prisma generate

# ── Quality Assurance (Phase 5: Operational Excellence) ────────
test:
	@echo "Executing service-level unit & integration tests..."
	pnpm recursive run test

test-e2e:
	@echo "Executing Platform-wide E2E Flow Validation (Cross-Service)..."
	pnpm run test:e2e

coverage:
	@echo "Calculating Global Code Coverage..."
	pnpm recursive run test:coverage

lint:
	@echo "Validating code quality and standards..."
	pnpm recursive run lint

# ── Local CI Simulation ───────────────────────────────────────
ci: lint db-generate test test-e2e
	@echo "-----------------------------------------"
	@echo "AgriLink CI Engine: All Checks Passed ✓"
	@echo "-----------------------------------------"

# ── Documentation (DX) ────────────────────────────────────────
docs:
	@echo "--- AgriLink platform API Documentation (Swagger) ---"
	@echo "Auth Service:        http://localhost:8080/auth/docs"
	@echo "Farmer Service:      http://localhost:8080/farmer/docs"
	@echo "Marketplace Service: http://localhost:8080/marketplace/docs"
	@echo "Supplier Service:    http://localhost:8080/supplier/docs"
	@echo "Notification Service: http://localhost:8080/notification/docs"
	@echo "ML Service (OpenAPI): http://localhost:8000/docs"
	@echo "---------------------------------------------"

# ── Utilities ──────────────────────────────────────────────────
clean:
	@echo "Purging build artifacts and dependencies..."
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	find . -name "dist" -type d -prune -exec rm -rf '{}' +

help:
	@echo "AgriLink v2 - Unified Command Center"
	@echo "------------------------------------"
	@echo "make rerun         - Restart infrastructure AND start services"
	@echo "make dev           - Start all services locally (Turborepo)"
	@echo "make infra         - Start core infrastructure containers"
	@echo "make db-migrate   - Sync and migrate all databases"
	@echo "make db-generate  - Build service-specific Prisma clients"
	@echo "make test         - Run internal service tests"
	@echo "make test-e2e     - Run platform-level integration flows"
	@echo "make ci           - Complete local pipeline validation"
	@echo "make docs         - View all API documentation"
	@echo "make clean        - Reset environment (deep purge)"
