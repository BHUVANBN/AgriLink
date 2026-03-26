FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY services/supplier/package.json ./services/supplier/
RUN corepack enable pnpm && pnpm install --frozen-lockfile --filter @agrilink/supplier...

FROM deps AS build
COPY packages/types ./packages/types
COPY services/supplier ./services/supplier
RUN pnpm --filter @agrilink/supplier run db:generate
RUN pnpm --filter @agrilink/supplier build

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S agrilink && adduser -S agrilink -G agrilink
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/services/supplier/dist ./dist
COPY --from=build /app/services/supplier/prisma ./prisma
ENV NODE_ENV=production
USER agrilink
EXPOSE 4003
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:4003/supplier/health || exit 1
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/index.js"]
