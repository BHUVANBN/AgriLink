# syntax=docker/dockerfile:1.7
# ─────────────────────────────────────────────────────────────
# One Dockerfile for every Fastify service in the monorepo.
#   docker build -f infrastructure/docker/node-service.Dockerfile \
#     --build-arg SERVICE=marketplace -t agrilink/marketplace .
# ─────────────────────────────────────────────────────────────
ARG NODE_IMAGE=node:20-bookworm-slim

FROM ${NODE_IMAGE} AS base
ENV PNPM_HOME=/pnpm PATH=/pnpm:$PATH CI=true
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /repo

# ── Fetch deps using only the lockfile (cached until the lockfile changes) ──
FROM base AS fetch
COPY pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch

# ── Build the selected service + its workspace dependencies ──
FROM fetch AS build
ARG SERVICE
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --offline --frozen-lockfile --filter "@agrilink/${SERVICE}..."
RUN if [ -f "services/${SERVICE}/prisma/schema.prisma" ]; then \
      cd "services/${SERVICE}" && npx prisma generate; \
    fi
RUN pnpm --filter "@agrilink/${SERVICE}..." run build
# Self-contained production bundle (prod deps only, workspace deps inlined)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm --filter "@agrilink/${SERVICE}" deploy --prod /out \
 && cp -r "services/${SERVICE}/dist" /out/ \
 && if [ -d "services/${SERVICE}/prisma" ]; then rm -rf /out/prisma && cp -r "services/${SERVICE}/prisma" /out/prisma; fi

# ── Runtime ──
FROM ${NODE_IMAGE} AS production
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates wget tini \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -g 1001 agrilink && useradd -u 1001 -g agrilink -m agrilink
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build --chown=agrilink:agrilink /out ./
USER agrilink
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "dist/index.js"]
