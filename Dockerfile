# syntax=docker/dockerfile:1
ARG NODE_VERSION=23-bookworm
ARG DEBIAN_CODENAME=slim

ARG SOURCE_DIR=/home/jenkins

FROM node:${NODE_VERSION}-${DEBIAN_CODENAME} AS base

FROM base AS builder

ARG SOURCE_DIR

WORKDIR "$SOURCE_DIR"

ENV NODE_ENV=production

COPY . .

RUN corepack enable && \
  apt-get update -y && \
  apt-get install -y openssl

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm fetch --no-frozen-lockfile && \
  pnpm install --no-frozen-lockfile && \
  pnpm run build

FROM builder AS test

ARG SOURCE_DIR

WORKDIR "$SOURCE_DIR"

RUN pnpm run test

FROM base AS runtime
SHELL [ "/bin/bash", "-euo", "pipefail", "-c" ]

ARG SOURCE_DIR

WORKDIR "$SOURCE_DIR"

ENV NODE_ENV=production

RUN apt-get update -y && \
  apt-get install -y openssl && \
  addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs

COPY --from=builder ["${SOURCE_DIR}/public", "./public"]

# Set the correct permission for prerender cache
RUN mkdir .next && \
  chown nextjs:nodejs .next

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs ["${SOURCE_DIR}/.next/standalone", "./"]
COPY --from=builder --chown=nextjs:nodejs ["${SOURCE_DIR}/.next/static", "./.next/static"]

CMD ["node", "server.js"]

