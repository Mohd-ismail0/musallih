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
docker-compose up -d postgres redis minio

# Copy env
cp .env.example .env

# Migrations (when schema exists)
npm run prisma:migrate:dev

# Run
npm run start:dev
```

API: http://localhost:3000/v1/health
Docs: http://localhost:3000/api/docs
