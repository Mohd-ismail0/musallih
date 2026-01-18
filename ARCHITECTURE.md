# Musallih Platform Architecture

## Purpose and scope
This document summarizes the system architecture defined by the Musallih product
requirements and supporting design specifications. It is a map of domains,
governance, access control, and core system boundaries for implementation.

## Architectural principles
- Open-source and community-owned
- Consent-first data design
- Fiqh-neutral, institution-respecting
- Federated and self-hostable
- Authority-aware, not authority-controlled
- API-first, platform-grade
- Auditability over convenience
- Ethical monetization only
- Offline-tolerant, low-bandwidth ready
- Infrastructure over features

## System context
Primary clients and actors:
- Musallih App for individuals and families
- Admin and Authority App for governance and oversight
- Organization and Business App for services and operations
- External partners via public and OAuth-protected APIs

## Core domains and services
The platform is organized into interoperable domains:
- Identity and family graph with structured profiles
- Organizations and institutions with jurisdiction binding
- Authority governance, rulings, and escalation workflows
- Consent engine, access logging, and audit compliance
- Islamic calendar and prayer systems with override controls
- Discovery and mapping with geo-boundary enforcement
- Services, activities, and request/case management
- Announcements and broadcast engine
- Donations, campaigns, and webinars
- Ethical ads with revenue ledger and routing
- Public and partner API platform

## Access control and consent pipeline
Every protected action must pass these enforcement layers:
1. Role-based access control (RBAC)
2. Jurisdiction validation (geo-boundary scope)
3. Relationship validation (member, staff, trustee, authority)
4. Consent profile validation (field-level access)
5. Audit logging and access history

## Authority and jurisdiction model
- Authorities exist at city, state, country, and global levels.
- Each authority is bound to a geo-boundary and can only act within it.
- Organizations belong to exactly one city authority and inherit higher levels.
- Authority actions require signed identity, MFA, and immutable audit logs.
- Escalation flows handle disputes, overrides, and emergency actions.

## Data model overview
The canonical data model covers:
- Users, families, and schools of thought
- Organizations, teams, and authority structures
- Consent profiles and access logs
- Services, activities, requests, and appointments
- Announcements, campaigns, webinars
- Ads, revenue ledgers, and distributions
- OAuth clients, tokens, and webhooks

See `musallih_platform_complete_er_diagram.md` for full entity definitions and
the ER diagram.

## Request and case management
- Requests are cases owned by a single organization.
- Each case follows a defined state machine from draft to closure.
- High-sensitivity flows (nikah, burial, welfare) add strict controls.
- Escalation and transfer require authority review and user consent.

## API boundaries and partner integrations
- Public APIs are open and unauthenticated (prayer times, hijri dates, discovery).
- Partner APIs require OAuth 2.1 with PKCE and fine-grained scopes.
- Tokens include scope, organization binding, jurisdiction codes, and consent hash.
- Webhooks provide signed event notifications with replay protection.

## Ethical ads and revenue ledger
- Ad delivery is geo-scoped and non-profiling.
- All billable actions are logged as immutable events.
- Revenue is derived from a ledger, not mutable balances.
- Routing allocates a fixed platform fee and distributes remaining funds by scope.
- Settlements are auditable and require authority verification.

## Non-functional requirements
- Field-level encryption and consent versioning for sensitive data
- Auditability for all reads and writes of protected data
- Low-bandwidth performance and offline tolerance
- Self-hostable deployments and open governance

## Deployment and evolution
The platform starts as an API-first modular monolith designed to evolve into
federated services. Reference components include PostgreSQL with PostGIS, Redis,
object storage, a message broker, an OAuth server, and consent middleware.

## References
- `PRD.md`
- `full_role_permission_matrix.md`
- `oauth_scope_system_partner_api_permission_map.md`
- `authority_jurisdiction_escalation_flow_diagrams.md`
- `request_case_management_workflow_diagrams.md`
- `ads_revenue_ledger_technical_design.md`
- `musallih_platform_complete_er_diagram.md`
