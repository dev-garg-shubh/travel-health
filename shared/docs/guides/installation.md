# Installation Guide

## 1) Clone and enter repo

```bash
git clone <your-repo-url>
cd travel-health
```

## 2) Install dependencies

```bash
pnpm install
```

## 3) Create env files

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

## 4) Start infrastructure

```bash
docker compose -f backend/infra/docker/docker-compose.yml up -d
```

## 5) Run apps

Frontend:

```bash
pnpm dev:frontend
```

Backend:

```bash
pnpm dev:backend
```

## Optional helper script

Use:

```bash
./shared/scripts/bootstrap.sh
```

It performs install + env bootstrap.
