# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Copy source code
COPY apps/doctor ./apps/doctor
COPY libs ./libs

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build doctor

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist/apps/doctor ./dist/apps/doctor
COPY --from=builder /app/dist/libs ./dist/libs

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/apps/doctor/main"] 