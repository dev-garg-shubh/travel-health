# Quickstart

Use these commands to get the project running quickly.

## 1) Clone and enter project

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

## 4) Start local infrastructure

```bash
./shared/scripts/start-infra.sh
```

## 5) Start backend

```bash
pnpm dev:backend
```

## 6) Start frontend (new terminal)

```bash
pnpm dev:frontend
```

## 7) Smoke test API flow

```bash
curl -X POST http://localhost:4000/v1/flight-health/request \
  -H "content-type: application/json" \
  -d '{"flightNumber":"AI101","departureAirport":"DEL","arrivalAirport":"SFO","departureDate":"2026-05-20"}'
```

```bash
curl http://localhost:4000/v1/scores/AI101
```

## Useful shortcuts

```bash
./shared/scripts/setup-frontend.sh
./shared/scripts/setup-backend.sh
./shared/scripts/docker-build-images.sh
```
