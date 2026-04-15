# Travel Health

Travel Health is a flight wellness scoring app.  
You enter flight details, the backend collects external health-related signals, and the app returns a flight health score with a simple breakdown.

## Setup and Start

### Prerequisites

- Node.js 20+
- pnpm 10+
- Docker Desktop (or any running Docker engine)

### 1) Install dependencies

```bash
pnpm install
```

### 2) Create env files

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

### 3) Start local infrastructure

```bash
docker compose -f backend/infra/docker/docker-compose.yml up -d
```

### 4) Start backend

```bash
pnpm dev:backend
```

### 5) Start frontend (new terminal)

```bash
pnpm dev:frontend
```

### 6) Open the app

- Frontend: [http://localhost:3000](http://localhost:3000)

### Optional quick scripts

```bash
./shared/scripts/setup-backend.sh
./shared/scripts/setup-frontend.sh
./shared/scripts/start-infra.sh
```
