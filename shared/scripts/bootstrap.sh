#!/usr/bin/env bash
set -euo pipefail

echo "Installing dependencies..."
pnpm install

echo "Copying env templates..."
if [[ ! -f frontend/.env ]]; then
  cp frontend/.env.example frontend/.env
fi

if [[ ! -f backend/.env ]]; then
  cp backend/.env.example backend/.env
fi

echo "Bootstrap complete."
