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

## Common Local Issue: Prisma P1000 (auth failed)

If you previously started Postgres with a different password, Docker volume state can keep old credentials and Prisma will fail with `P1000`.

Fix:

```bash
npm run db:reset
npm run db:migrate
npm run start:dev
```

If Docker Desktop is not running, start it first. If you use a local PostgreSQL service instead of Docker, update `DATABASE_URL` in `.env` to match your local credentials.
