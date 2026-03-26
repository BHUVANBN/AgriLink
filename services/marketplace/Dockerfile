FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY services/marketplace/package.json ./services/marketplace/
RUN corepack enable pnpm && pnpm install --frozen-lockfile --filter @agrilink/marketplace...

FROM deps AS build
COPY packages/types ./packages/types
COPY services/marketplace ./services/marketplace
RUN pnpm --filter @agrilink/marketplace run db:generate
RUN pnpm --filter @agrilink/marketplace build

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S agrilink && adduser -S agrilink -G agrilink
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/services/marketplace/dist ./dist
COPY --from=build /app/services/marketplace/prisma ./prisma
ENV NODE_ENV=production
USER agrilink
EXPOSE 4004
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:4004/marketplace/health || exit 1
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/index.js"]
