# Musallih
Open Islamic Civic Infrastructure Platform

## Vision
Musallih is a map-first civic app for Muslim communities: people can discover nearby masjids and services, access prayer and calendar information, and request support from trusted organizations. Authorities and organization teams operate from a separate staff dashboard with governance, verification, and service workflows.

The platform is designed to be open, neutral, and interoperable. It is not a social network.

## What the working app looks like today

### Consumer app (`frontend/apps/musallih`)
- Single product across **web + mobile** with the same map-first UX.
- Default home is **Map** with category tabs:
  - Masjid, Restaurants, Business, Madrasa, Islamic Orgs, Welfare, Burial, All.
- Masjid tab supports sub-filters:
  - sect, timing, and distance bands.
- Real map rendering with MapLibre on web and mobile.
- Viewport/bounds-aware discovery flow:
  - frontend sends `bbox` and filters to backend `GET /v1/organizations/nearby`.
- Core consumer flows are scaffolded and navigable:
  - auth, map, entity detail, prayer, discover, requests, announcements, family, consent, donations, profile/settings.

### Staff app (`frontend/apps/dashboard`)
- Separate web app for authority/admin/organization/business operators.
- Foundation for role-based operations and governance workflows.

### Backend API (`backend/apps/api`)
- NestJS + Prisma API with auth, organization, prayer, calendar, services, requests, and donations domains.
- Map discovery endpoint available:
  - `GET /v1/organizations/nearby` (also reachable via `/v1/organization/nearby` alias).

## End-to-end experience (target behavior)
1. User signs in with Firebase.
2. App exchanges Firebase ID token for Musallih API JWT.
3. User lands on map and selects category + Masjid filters.
4. App fetches nearby entities by viewport (`bbox`) and renders markers.
5. User opens an entity and can view details, request help, or navigate.
6. Prayer, Hijri calendar, requests, and community modules continue from the same account/session.

## Architecture at a glance
- Identity and family graph with consent-driven access controls.
- Organization and institution network with jurisdiction bindings.
- Authority governance, rulings, and escalation workflow model.
- Request and case-management system with auditable state changes.
- Islamic calendar and prayer systems with authority overrides.
- Public APIs and partner APIs with OAuth 2.1 scopes.
- Ethical ads with ledger-based revenue routing.
- Auditability, encryption, and compliance-by-design.

## Run locally

### Frontend
From `frontend/`:

```bash
npm install
npm run dev:web
npm run dev:dashboard
npm run dev:mobile
```

### Backend
From `backend/`:

```bash
npm install
npm run db:up
npm run dev
```

## Production readiness
- Frontend deployment and environment setup:
  - `frontend/DEPLOYMENT.md`
  - `frontend/FRONTEND_SETUP.md`
- Core architecture and roadmap:
  - `ARCHITECTURE.md`
  - `PRD.md`

## Key documents
- Product vision and scope: `PRD.md`
- Platform architecture overview: `ARCHITECTURE.md`
- Full role and permission model: `full_role_permission_matrix.md`
- OAuth scopes and partner API permissions: `oauth_scope_system_partner_api_permission_map.md`
- Authority hierarchy and escalation flows: `authority_jurisdiction_escalation_flow_diagrams.md`
- Request and case-management workflows: `request_case_management_workflow_diagrams.md`
- Ads and revenue ledger design: `ads_revenue_ledger_technical_design.md`
- Canonical data model and ERD: `musallih_platform_complete_er_diagram.md`

## Contributing
See `CONTRIBUTING.md` for documentation conventions and change guidelines.

## License
Licensed under the terms in `LICENSE`.
