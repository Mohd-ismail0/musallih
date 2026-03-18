# Musallih Frontend Setup

This document describes the frontend architecture, API usage, and references to the broader Musallih platform.

## Overview

The Musallih frontend is a **monorepo** with two main apps:

| App | Purpose | Platform |
|-----|---------|----------|
| **Musallih** | Consumer app for individuals and families | Web + Mobile |
| **Dashboard** | Staff app for admin, authority, org, and business | Web |

The **Musallih consumer app** is a single product with two surfaces:
- **Web** (`apps/musallih/web`) — Vite + React. Home page (landing), future: prayer times, discovery, requests.
- **Mobile** (`apps/musallih/mobile`) — Expo (React Native). Same features, native experience.

## Architecture References

- **[ARCHITECTURE.md](../ARCHITECTURE.md)** — System architecture, domains, access control, authority model
- **[PRD.md](../PRD.md)** — Product requirements and feature scope
- **[REPLICATION_GUIDE.md](./REPLICATION_GUIDE.md)** — Styling and components for the consumer web app

## Monorepo Structure

```
frontend/
├── apps/
│   ├── musallih/
│   │   ├── web/           # Consumer web app (home + future features)
│   │   └── mobile/        # Consumer mobile app (Expo)
│   └── dashboard/         # Staff app (admin, authority, org)
├── packages/
│   ├── shared/            # Design tokens, cn() utils
│   └── api-client/       # API base URL, typed client
├── package.json           # Workspace root
└── REPLICATION_GUIDE.md
```

## Shared Packages

### @musallih/shared

- **Design tokens** — Colors, fonts, spacing, radius (dark-first, teal accent)
- **cn()** — Class name merger (clsx + tailwind-merge)

### @musallih/api-client

- **DEFAULT_API_BASE_URL** — Default backend URL
- **createApiClient()** — Typed fetch wrapper with optional auth

## Running the Apps

From `frontend/`:

```bash
npm install
npm run dev:web        # Consumer web app — http://localhost:8080
npm run dev:dashboard # Staff dashboard — http://localhost:8081
npm run dev:mobile    # Consumer mobile (Expo)
```

## API Configuration

- **Web / Dashboard**: `VITE_API_URL` in `.env` (see `apps/musallih/web/.env.example`)
- **Mobile**: `EXPO_PUBLIC_API_URL` in `.env` (see `apps/musallih/mobile/.env.example`)
- **Default**: `https://musallih-api.jollyocean-083299b2.southeastasia.azurecontainerapps.io/v1`

For production deployment (builds, env vars, static host, EAS, CI), see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## Auth

- Backend: Firebase ID token → `POST /v1/auth/token` → Musallih JWT
- Consumer (web + mobile): Firebase Auth + token exchange (TODO)
- Dashboard: Same flow (TODO)

## Next Steps

1. **Firebase Auth** — Wire sign-in and token exchange in consumer and dashboard
2. **API hooks** — React Query hooks for health, orgs, prayer times
3. **Consumer features** — Prayer times, masjid discovery, service requests (web + mobile)
4. **Role gates** — Dashboard UI based on authority vs org permissions
