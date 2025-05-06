# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /e-sihha

# Install build dependencies if needed (e.g., for prisma generate if used here)
# RUN apk add --no-cache --virtual .build-deps openssl python3 make g++

COPY package*.json ./

# Use npm ci for cleaner installs
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

# Generate Prisma client (ensure schema is copied)
COPY apps/appointments/prisma ./apps/appointments/prisma
RUN npx prisma generate --schema=./apps/appointments/prisma/schema.prisma

# Explicitly build only the api-gateway application
RUN npm run build api-gateway

# Remove development dependencies
RUN npm prune --production

# Stage 2: Create the production image
FROM node:22-alpine AS production

WORKDIR /e-sihha

# Install only production dependencies and necessary runtime tools
RUN apk add --no-cache tini curl
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

CMD ["node", "dist/apps/api-gateway/main"]

# Health check for the API Gateway
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api-docs || exit 1
