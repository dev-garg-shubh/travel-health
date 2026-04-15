# Travel Health Monorepo

Base microservice structure for a flight health score platform.

## Workspaces

- `frontend/web`: Next.js frontend app
- `frontend/ui`: Vite-based shared component library
- `shared/packages/types`: Shared contracts and event payload types
- `shared/packages/config`: Shared TypeScript and lint config
- `backend/services/api-gateway`: Public API gateway
- `backend/services/travel-service`: Flight/travel query intake
- `backend/services/health-service`: Health criteria service
- `backend/services/data-scraper-service`: External source data ingestion
- `backend/services/data-analyzer-service`: Scoring analysis pipeline
- `backend/services/score-api-service`: Score query API

## Run

```bash
pnpm install
pnpm dev
```

Build/run by area:

```bash
pnpm dev:frontend
pnpm dev:backend
pnpm build:frontend
pnpm build:backend
```

Or run from each domain folder:

```bash
cd frontend && pnpm dev
cd backend && pnpm dev
```

## Environment Files

- `frontend/.env.example` -> copy to `frontend/.env`
- `backend/.env.example` -> copy to `backend/.env`
- Each backend service also has a local `.env.example` under `backend/services/*` for service-level overrides

## Infra

Use `backend/infra/docker/docker-compose.yml` for local RabbitMQ, Redis, and Postgres instances.

```bash
docker compose -f backend/infra/docker/docker-compose.yml up -d
```

## Shared Tooling

- Bootstrap script: `shared/scripts/bootstrap.sh`
- Architecture docs: `shared/docs/architecture/overview.md`
- Frontend setup guide: `frontend/README.md`
- Backend setup guide: `backend/README.md`
- Quickstart guide: `shared/docs/guides/quickstart.md`
- Installation guide: `shared/docs/guides/installation.md`
- Docker guide: `shared/docs/guides/docker.md`

Useful scripts:

- `shared/scripts/setup-frontend.sh`
- `shared/scripts/setup-backend.sh`
- `shared/scripts/start-infra.sh`
- `shared/scripts/docker-build-images.sh`

## Deployment Templates

- Frontend image: `frontend/web/Dockerfile`
- Backend service images: `backend/services/*/Dockerfile`
- CI pipeline: `.github/workflows/ci.yml`

Example builds:

```bash
docker build -f frontend/web/Dockerfile -t travel-health-web .
docker build -f backend/services/api-gateway/Dockerfile -t travel-health-api-gateway .
```

## Phase 1 API Flow

1. Submit flight request through gateway:

```bash
curl -X POST http://localhost:4000/v1/flight-health/request \
  -H "content-type: application/json" \
  -d '{"flightNumber":"AI101","departureAirport":"DEL","arrivalAirport":"SFO","departureDate":"2026-05-20"}'
```

2. Query score through gateway:

```bash
curl http://localhost:4000/v1/scores/AI101
```
