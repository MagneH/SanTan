# Multi-stage build for Sanity Studio
# Build context should be repository root: docker build -f apps/studio/Dockerfile .
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package files (from repository root)
COPY package.json package-lock.json* ./

# Copy workspace package.json files
COPY apps/studio/package.json ./apps/studio/
COPY packages/shared/package.json ./packages/shared/

# Install all dependencies (using npm install instead of npm ci to workaround optional dependencies bug)
# See: https://github.com/npm/cli/issues/4828
RUN npm install

# Build shared package first
FROM base AS shared-builder
WORKDIR /app

# Copy root node_modules (npm workspaces installs everything here)
COPY --from=deps /app/node_modules ./node_modules
# Copy shared package source
COPY packages/shared ./packages/shared

WORKDIR /app/packages/shared
RUN npm run build

# Build the studio
FROM base AS builder
WORKDIR /app

# Copy root node_modules (npm workspaces installs everything here)
COPY --from=deps /app/node_modules ./node_modules

# Copy shared package build
COPY --from=shared-builder /app/packages/shared ./packages/shared

# Copy studio source
COPY apps/studio ./apps/studio

# Build studio
WORKDIR /app/apps/studio
RUN npm run build

# Production image - serve with simple http server
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install serve
RUN npm install -g serve

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built studio
COPY --from=builder --chown=nodejs:nodejs /app/apps/studio/dist /app/dist

USER nodejs

EXPOSE 8080

# Serve the static files
CMD ["serve", "-s", "dist", "-l", "8080"]

