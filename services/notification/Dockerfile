FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/types/package.json ./packages/types/
COPY services/notification/package.json ./services/notification/
RUN corepack enable pnpm && pnpm install --frozen-lockfile --filter @agrilink/notification...

FROM deps AS build
COPY packages/types ./packages/types
COPY services/notification ./services/notification
RUN pnpm --filter @agrilink/notification build

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S agrilink && adduser -S agrilink -G agrilink
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/services/notification/dist ./dist
ENV NODE_ENV=production
USER agrilink
EXPOSE 4005
CMD ["node", "dist/index.js"]
