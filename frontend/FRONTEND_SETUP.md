# Musallih Frontend Setup

This document describes the frontend architecture, API usage, and references to the broader Musallih platform.

## Overview

The Musallih frontend is a **monorepo** with two main apps:

| App | Purpose | Platform |
|-----|---------|----------|
| **Musallih** | Consumer app for individuals and families | Mobile (Expo) |
| **Dashboard** | Staff app for admin, authority, org, and business | Web |
| **Landing** | Marketing site | Web |

## Architecture References

- **[ARCHITECTURE.md](../ARCHITECTURE.md)** — System architecture, domains, access control, authority model
- **[PRD.md](../PRD.md)** — Product requirements and feature scope
- **[REPLICATION_GUIDE.md](./REPLICATION_GUIDE.md)** — Styling and components for the landing page

## Monorepo Structure

```
frontend/
├── apps/
│   ├── landing/           # Marketing site (Vite + React)
│   ├── musallih/
│   │   └── mobile/        # Consumer app (Expo)
│   └── dashboard/         # Staff app (Vite + React)
├── packages/
│   ├── shared/            # Design tokens, cn() utils
│   └── api-client/        # API base URL, typed client
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
npm run dev:landing      # http://localhost:8080
npm run dev:dashboard    # http://localhost:8081
npm run dev:mobile       # Expo (QR code)
```

## API Configuration

- **Landing / Dashboard**: `VITE_API_URL` in `.env`
- **Mobile**: `EXPO_PUBLIC_API_URL` in `.env` or app config
- **Default**: `https://musallih-api.jollyocean-083299b2.southeastasia.azurecontainerapps.io/v1`

## Auth

- Backend: Firebase ID token → `POST /v1/auth/token` → Musallih JWT
- Dashboard: Firebase Auth + token exchange (TODO)
- Mobile: Same flow (TODO)

## Next Steps

1. **Firebase Auth** — Wire sign-in and token exchange in dashboard and mobile
2. **API hooks** — React Query hooks for health, orgs, prayer times
3. **Role gates** — Dashboard UI based on authority vs org permissions
4. **Mobile features** — Prayer times, masjid discovery, service requests
