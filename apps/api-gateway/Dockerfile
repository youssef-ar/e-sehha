FROM node:22-bookworm-slim AS builder

WORKDIR /e-sihha

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:22-bookworm-slim AS production

WORKDIR /e-sihha

COPY --from=builder /e-sihha/dist ./dist
COPY --from=builder /e-sihha/node_modules ./node_modules
COPY --from=builder /e-sihha/package.json ./package.json

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/main"]
