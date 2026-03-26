FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY services/farmer/package.json ./services/farmer/
RUN corepack enable pnpm && pnpm install --frozen-lockfile --filter @agrilink/farmer...

FROM deps AS build
COPY packages/types ./packages/types
COPY services/farmer ./services/farmer
RUN pnpm --filter @agrilink/farmer exec prisma generate
RUN pnpm --filter @agrilink/farmer build

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S agrilink && adduser -S agrilink -G agrilink
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/services/farmer/dist ./dist
COPY --from=build /app/services/farmer/prisma ./prisma
ENV NODE_ENV=production
USER agrilink
EXPOSE 4002
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s \
  CMD wget -qO- http://localhost:4002/farmer/health || exit 1
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/index.js"]
