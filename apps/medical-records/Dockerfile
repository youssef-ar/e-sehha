FROM node:22-bookworm-slim AS builder

WORKDIR /e-sihha

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm install

COPY . .

RUN npx prisma generate --schema=apps/appointments/prisma/schema.prisma

RUN npm run build medical-records

FROM node:22-bookworm-slim AS production

WORKDIR /e-sihha

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY --from=builder /e-sihha/dist ./dist

EXPOSE 3000

CMD ["node", "dist/apps/medical-records/main.js"]
