# Frontend Setup Guide

This folder contains frontend code:

- `web`: Next.js application
- `ui`: Vite-based shared UI package used by `web`

## Prerequisites

- Node.js 20+
- pnpm 10+

## Install

From repository root:

```bash
pnpm install
```

Create frontend env:

```bash
cp frontend/.env.example frontend/.env
```

## Run Frontend

From repository root:

```bash
pnpm dev:frontend
```

Or from this folder:

```bash
cd frontend
pnpm dev
```

## Build Frontend

From repository root:

```bash
pnpm build:frontend
```

Or from this folder:

```bash
cd frontend
pnpm build
```

## Frontend Dockerfile

- Path: `frontend/web/Dockerfile`

Build image from repo root:

```bash
docker build -f frontend/web/Dockerfile -t travel-health-web .
```

Run container:

```bash
docker run --rm -p 3000:3000 --env-file frontend/.env travel-health-web
```
