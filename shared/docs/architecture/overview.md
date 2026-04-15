# Architecture Overview

## Scope (Phase 1)

- No authentication.
- No user profile persistence.
- Flight health score pipeline only.

## Services

- `api-gateway`: public entry for frontend APIs.
- `travel-service`: receives flight request context.
- `data-scraper-service`: ingests source signals from external providers.
- `data-analyzer-service`: computes weighted health score from source signals.
- `score-api-service`: serves latest score and breakdown.
- `health-service`: provides criteria catalog and baseline metadata.

## Event Flow

1. `travel-service` emits `flight.requested`.
2. `data-scraper-service` consumes `flight.requested`, fetches source data, emits `source.data.fetched`.
3. `data-analyzer-service` consumes `source.data.fetched`, computes weighted score, emits `health.score.computed`.
4. `score-api-service` consumes `health.score.computed` and stores latest score per flight.
5. `api-gateway` proxies score queries to `score-api-service`.

RabbitMQ topology (phase 1):

- Exchange: `travel_health.events` (topic)
- Routing keys:
  - `flight.requested`
  - `source.data.fetched`
  - `health.score.computed`

## Future Extension

- Plug in auth middleware at `api-gateway`.
- Add `user-service` for user preferences/history without changing core scoring pipeline.
