FROM node:20-alpine AS builder
WORKDIR /repo

RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json tsconfig.json ./
COPY frontend ./frontend
COPY backend ./backend
COPY shared ./shared

RUN pnpm install --no-frozen-lockfile
RUN pnpm turbo run build --filter=@travel-health/web

FROM node:20-alpine AS runner
WORKDIR /repo

ENV NODE_ENV=production

COPY --from=builder /repo /repo

EXPOSE 3000
CMD ["node", "node_modules/next/dist/bin/next", "start", "frontend/web", "--port", "3000"]
