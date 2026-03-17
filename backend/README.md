# Musallih Backend

API-first modular monolith for the Musallih Open Islamic Civic Infrastructure Platform.

## Stack
- Node.js 22, TypeScript 5, NestJS 11 (Fastify)
- PostgreSQL 16 + PostGIS
- Redis 7
- Prisma ORM
- S3-compatible storage (MinIO/R2/S3)

## Quick Start

```bash
# Install
npm install

# Start infra
npm run db:up

# Copy env
cp .env.example .env

# Migrations (when schema exists)
npm run db:migrate

# Run
npm run start:dev
```

API: http://localhost:3000/v1/health
Docs: http://localhost:3000/api/docs

## Required Environment Variables

- `DATABASE_URL`
- `REDIS_URL`
- `JWT_SECRET` (minimum 24 chars)
- `JWT_EXPIRES_IN_SECONDS`
- `PORT`
- `NODE_ENV`
- `JOBS_ENABLED` (true/false)
- `API_RATE_LIMIT_MAX`
- `API_RATE_LIMIT_WINDOW`

### Auth (Firebase)

For `POST /v1/auth/token` (Firebase ID token exchange):

- **Option A**: `GOOGLE_APPLICATION_CREDENTIALS` – path to Firebase service account JSON
- **Option B**: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` (preferred for containers)

### CORS

- `CORS_ORIGINS` – comma-separated allowed origins (default: `http://localhost:3000`, `http://localhost:5173`)

## Common Local Issue: Prisma P1000 (auth failed)

If you previously started Postgres with a different password, Docker volume state can keep old credentials and Prisma will fail with `P1000`.

Fix:

```bash
npm run db:reset
npm run db:migrate
npm run start:dev
```

If Docker Desktop is not running, start it first. If port 5432 is used by another PostgreSQL, Docker Postgres exposes 5433 instead; `DATABASE_URL` in `.env` uses `localhost:5433`.

## Production Notes

- Never use the development JWT secret in production.
- `/v1/health/ready` now verifies database connectivity and job-system status.
- If `JOBS_ENABLED=true` and pg-boss fails to start in production, startup fails fast.
- Set `CORS_ORIGINS` to your frontend domain(s) in production.
- Configure Firebase Admin credentials for auth token exchange.

## Standalone Deployment

The backend can be deployed independently (frontend builds separately).

### Docker

```bash
# Build
docker build -t musallih-backend .

# Run (ensure DATABASE_URL, REDIS_URL, JWT_SECRET, Firebase vars are set)
docker run -p 3000:3000 --env-file .env musallih-backend
```

### Pre-deploy

1. Run migrations: `npx prisma migrate deploy`
2. Set production env vars (see `.env.example`)
3. For Azure/cloud: use managed PostgreSQL, Redis, and Key Vault for secrets
