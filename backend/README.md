# Backend Setup Guide

This folder contains backend code:

- `services`: microservices
- `infra`: local infrastructure (Docker Compose)

## Services

- `api-gateway`
- `travel-service`
- `health-service`
- `data-scraper-service`
- `data-analyzer-service`
- `score-api-service`

## Prerequisites

- Node.js 20+
- pnpm 10+
- Docker (for infra and container builds)

## Install

From repository root:

```bash
pnpm install
```

Create backend env:

```bash
cp backend/.env.example backend/.env
```

## Run Backend

Start infra first:

```bash
docker compose -f backend/infra/docker/docker-compose.yml up -d
```

Then run backend services from repository root:

```bash
pnpm dev:backend
```

Or from this folder:

```bash
cd backend
pnpm dev
```

## Build Backend

From repository root:

```bash
pnpm build:backend
```

Or from this folder:

```bash
cd backend
pnpm build
```

## Service Dockerfiles

- `backend/services/api-gateway/Dockerfile`
- `backend/services/travel-service/Dockerfile`
- `backend/services/health-service/Dockerfile`
- `backend/services/data-scraper-service/Dockerfile`
- `backend/services/data-analyzer-service/Dockerfile`
- `backend/services/score-api-service/Dockerfile`

Example image build:

```bash
docker build -f backend/services/api-gateway/Dockerfile -t travel-health-api-gateway .
```
