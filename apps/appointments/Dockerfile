FROM node:22-bookworm-slim AS builder

WORKDIR /e-sihha

RUN apt-get update -y && apt-get install -y openssl

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

WORKDIR /e-sihha/apps/appointments

RUN npx prisma generate

RUN npm run build appointments

RUN npm prune --production

FROM node:22-bookworm-slim AS production

WORKDIR /e-sihha

RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /e-sihha/dist ./dist
COPY --from=builder /e-sihha/node_modules ./node_modules
COPY --from=builder /e-sihha/package.json ./package.json
COPY --from=builder /e-sihha/apps/appointments/prisma .prisma

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/apps/appointments/main"]
