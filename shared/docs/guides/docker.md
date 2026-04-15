# Docker Guide

This project uses per-app/service Dockerfiles and a local infra compose file.

## Infra Compose

- File: `backend/infra/docker/docker-compose.yml`
- Starts: RabbitMQ, Redis, Postgres instances

Command:

```bash
docker compose -f backend/infra/docker/docker-compose.yml up -d
```

## Frontend Dockerfile

- File: `frontend/web/Dockerfile`

Build:

```bash
docker build -f frontend/web/Dockerfile -t travel-health-web .
```

Run:

```bash
docker run --rm -p 3000:3000 --env-file frontend/.env travel-health-web
```

## Backend Dockerfiles

- `backend/services/api-gateway/Dockerfile`
- `backend/services/travel-service/Dockerfile`
- `backend/services/health-service/Dockerfile`
- `backend/services/data-scraper-service/Dockerfile`
- `backend/services/data-analyzer-service/Dockerfile`
- `backend/services/score-api-service/Dockerfile`

Build examples:

```bash
docker build -f backend/services/api-gateway/Dockerfile -t travel-health-api-gateway .
docker build -f backend/services/score-api-service/Dockerfile -t travel-health-score-api .
```

Run example:

```bash
docker run --rm -p 4000:4000 --env-file backend/.env travel-health-api-gateway
```

## CI Reference

- CI pipeline file: `.github/workflows/ci.yml`
- It validates quality tasks and Docker builds.
