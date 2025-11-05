# Multi-stage build for optimal image size
# Build context should be repository root: docker build -f apps/frontend/Dockerfile .
FROM node:22-alpine AS base

# Build the application
FROM base AS builder
WORKDIR /app

# Copy package files first
COPY package.json package-lock.json* ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/shared/package.json ./packages/shared/

# Copy source code
COPY . .

# Install ALL dependencies (including optional) in builder stage
# This ensures proper hoisting for ESM imports like @tailwindcss/vite
RUN npm install

# Build shared package first (required by frontend)
WORKDIR /app/packages/shared
RUN npm run build

# Build the frontend application
WORKDIR /app/apps/frontend
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/apps/frontend/.output /app/.output
COPY --from=builder --chown=nodejs:nodejs /app/apps/frontend/package.json /app/package.json

USER nodejs

EXPOSE 8080

# Cloud Run expects the container to listen on PORT env variable
CMD ["node", ".output/server/index.mjs"]

