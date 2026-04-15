#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

echo "Building frontend image..."
docker build -f frontend/web/Dockerfile -t travel-health-web .

echo "Building backend images..."
docker build -f backend/services/api-gateway/Dockerfile -t travel-health-api-gateway .
docker build -f backend/services/travel-service/Dockerfile -t travel-health-travel-service .
docker build -f backend/services/health-service/Dockerfile -t travel-health-health-service .
docker build -f backend/services/data-scraper-service/Dockerfile -t travel-health-data-scraper-service .
docker build -f backend/services/data-analyzer-service/Dockerfile -t travel-health-data-analyzer-service .
docker build -f backend/services/score-api-service/Dockerfile -t travel-health-score-api-service .

echo "All images built successfully."
