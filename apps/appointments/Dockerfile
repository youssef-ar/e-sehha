# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /e-sihha

# Install build dependencies (openssl for Prisma, python/make/g++ might be needed for some native modules)
RUN apk add --no-cache --virtual .build-deps openssl python3 make g++

COPY package*.json ./

# Use npm ci for cleaner installs
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

# Generate Prisma client (ensure schema is copied)
COPY apps/appointments/prisma ./apps/appointments/prisma
RUN npx prisma generate --schema=./apps/appointments/prisma/schema.prisma

# Explicitly build only the appointments application
RUN npm run build appointments

# Remove development dependencies
RUN npm prune --production

# Clean up build dependencies
RUN apk del .build-deps

# Stage 2: Create the production image
FROM node:22-alpine AS production

WORKDIR /e-sihha

# Install runtime dependencies (openssl for Prisma, tini for signal handling, curl for healthcheck)
RUN apk add --no-cache openssl tini curl

COPY --from=builder /e-sihha/dist ./dist
COPY --from=builder /e-sihha/node_modules ./node_modules
COPY --from=builder /e-sihha/package.json ./package.json
# Copy prisma schema and generated client for runtime
COPY --from=builder /e-sihha/apps/appointments/prisma ./apps/appointments/prisma
COPY --from=builder /e-sihha/node_modules/.prisma ./node_modules/.prisma


ENV NODE_ENV=production

EXPOSE 3000

# Use tini to handle signals properly
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/apps/appointments/main"]

# Health check using the /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
