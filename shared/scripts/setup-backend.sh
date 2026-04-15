#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "Installing workspace dependencies..."
pnpm install

if [[ ! -f backend/.env ]]; then
  echo "Creating backend/.env from template..."
  cp backend/.env.example backend/.env
else
  echo "backend/.env already exists, skipping."
fi

echo "Starting backend infra (RabbitMQ, Redis, Postgres)..."
docker compose -f backend/infra/docker/docker-compose.yml up -d

echo "Backend setup complete."
