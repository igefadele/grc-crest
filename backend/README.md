# Crest Backend

NestJS ingestion backend for `grc_crest`.

## Features

- JWT-protected REST ingestion:
  - `POST /ingest/events`
  - `POST /ingest/evidence`
  - `POST /ingest/incidents`
- Read APIs for frontend bootstrap:
  - `GET /events?limit=30`
  - `GET /evidence?framework=SOC%202`
  - `GET /incidents?status=OPEN`
- Socket.io namespace `/grc` with JWT auth and events:
  - `event.created`
  - `evidence.updated`
  - `incident.updated`
- Supabase/Postgres schema via Prisma.

## Environment

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` / `DIRECT_URL` (Supabase Postgres)
- `INGESTION_JWT_TOKEN` (used by REST bearer auth and socket handshake auth)
- `FRONTEND_ORIGIN` (e.g. `http://localhost:3000`)

## Run

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Server default port: `4000`.

## Quick Verification

1. Health check: `GET /health`.
2. Ingest event with bearer token:

```bash
curl -X POST http://localhost:4000/ingest/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${INGESTION_JWT_TOKEN}" \
  -d '{"time":"00:01s","layer":"cicd","msg":"Test event","severity":"blocked","auto":true}'
```

3. Query events: `GET /events`.
4. Connect socket client to `/grc` with `token` auth and confirm `event.created` broadcasts.
