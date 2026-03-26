FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY services/blockchain/package.json ./services/blockchain/
RUN corepack enable pnpm && pnpm install --frozen-lockfile --filter @agrilink/blockchain...

FROM deps AS build
COPY packages/types ./packages/types
COPY services/blockchain ./services/blockchain
RUN pnpm --filter @agrilink/blockchain build

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S agrilink && adduser -S agrilink -G agrilink
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/services/blockchain/dist ./dist
ENV NODE_ENV=production
USER agrilink
EXPOSE 4007
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s \
  CMD wget -qO- http://localhost:4007/blockchain/health || exit 1
CMD ["node", "dist/index.js"]
