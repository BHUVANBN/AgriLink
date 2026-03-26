# ── Stage 1: Dependencies ─────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app

# Copy workspace manifests for caching
COPY package.json pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY services/auth/package.json ./services/auth/

RUN corepack enable pnpm && pnpm install --frozen-lockfile --filter @agrilink/auth...

# ── Stage 2: Build ────────────────────────────────────────────
FROM deps AS build
COPY packages/types ./packages/types
COPY services/auth ./services/auth
RUN pnpm --filter @agrilink/auth build

# ── Stage 3: Production ────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

RUN addgroup -g 1001 -S agrilink && adduser -S agrilink -G agrilink
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/services/auth/dist ./dist

ENV NODE_ENV=production
USER agrilink

EXPOSE 4001
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:4001/auth/health || exit 1

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/index.js"]
