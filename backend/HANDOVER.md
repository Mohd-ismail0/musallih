# Musallih Backend – Handover Package

## Overview
API-first modular monolith for the Musallih platform. Built with NestJS (Fastify), PostgreSQL/PostGIS, Redis, and Prisma.

## API Base
- **Base URL**: `/v1`
- **Swagger**: `/api/docs`
- **Health**: `/v1/health`, `/v1/health/live`, `/v1/health/ready`

## Implemented Endpoints

### Public (no auth)
- `POST /v1/identity/users` – Create user
- `GET /v1/organization/:id` – Get organization
- `POST /v1/organization` – Create organization
- `GET /v1/authority` – List authorities
- `GET /v1/authority/:id` – Get authority
- `GET /v1/prayer/times` – Prayer times
- `GET /v1/calendar/hijri` – Hijri date

### Protected (Bearer JWT)
- `GET /v1/identity/users/:id` – Get user

### Ads (protected)
- `GET /v1/ads/campaigns/:id` – Get campaign
- `GET /v1/ads/ledger` – Revenue ledger

## Running Locally
1. `docker-compose up -d postgres redis`
2. `cp .env.example .env`
3. `npm run prisma:migrate:dev`
4. `npm run start:dev`

## JWT
Set `JWT_SECRET` in .env. Tokens require `sub` (user id). Use `/api/docs` to test.

## For RN/Web Clients
- OpenAPI spec: `libs/contracts/src/openapi.json`
- Run `npm run contracts:validate` to verify contracts
- Generate client: `npx openapi-generator-cli generate -i libs/contracts/src/openapi.json -g typescript-axios -o ./sdk`
