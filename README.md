# Musallih
Open Islamic Civic Infrastructure Platform

## Overview
Musallih is open, neutral, and federated digital infrastructure for Muslim
communities. It connects individuals, families, masjids, institutions,
authorities, service organizations, and ecosystem partners into a single
interoperable system for religious coordination, civic services, welfare
support, and community development. It is not a social network.

## Repository purpose
This repository contains the canonical product, architecture, governance, and
workflow specifications for the Musallih platform. It is documentation-first
and intended to drive implementation across future services and clients.

## Key documents
- Product vision and scope: `PRD.md`
- Full role and permission model: `full_role_permission_matrix.md`
- OAuth scopes and partner API permissions: `oauth_scope_system_partner_api_permission_map.md`
- Authority hierarchy and escalation flows: `authority_jurisdiction_escalation_flow_diagrams.md`
- Request and case-management workflows: `request_case_management_workflow_diagrams.md`
- Ads and revenue ledger design: `ads_revenue_ledger_technical_design.md`
- Canonical data model and ERD: `musallih_platform_complete_er_diagram.md`
- Platform architecture overview: `ARCHITECTURE.md`

## Architecture at a glance
- Identity and family graph with consent-driven access controls
- Organization and institution network with jurisdiction bindings
- Authority governance, rulings, and escalation workflow model
- Request and case-management system with auditable state changes
- Islamic calendar and prayer systems with authority overrides
- Public APIs and partner APIs with OAuth 2.1 scopes
- Ethical ads with ledger-based revenue routing
- Auditability, encryption, and compliance-by-design

## Access control model
All protected actions require layered enforcement of role, jurisdiction,
relationship, consent, and audit logging.

## Delivery phases
- Phase 1: core identity, organizations, prayer, calendar, maps, announcements
- Phase 2: families, services, requests, donations, consent v2
- Phase 3: OAuth platform, partner APIs, ads, revenue routing, analytics

## Contributing
See `CONTRIBUTING.md` for documentation conventions and change guidelines.

## License
Licensed under the terms in `LICENSE`.
