FROM node:20-alpine AS builder
WORKDIR /repo

RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY frontend ./frontend
COPY backend ./backend
COPY shared ./shared

RUN pnpm install --no-frozen-lockfile
RUN pnpm turbo run build --filter=@travel-health/health-service

FROM node:20-alpine AS runner
WORKDIR /repo

COPY --from=builder /repo /repo

EXPOSE 4102
CMD ["node", "backend/services/health-service/dist/index.js"]
