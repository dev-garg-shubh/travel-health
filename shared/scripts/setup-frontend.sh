#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "Installing workspace dependencies..."
pnpm install

if [[ ! -f frontend/.env ]]; then
  echo "Creating frontend/.env from template..."
  cp frontend/.env.example frontend/.env
else
  echo "frontend/.env already exists, skipping."
fi

echo "Frontend setup complete."
