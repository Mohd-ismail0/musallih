# ADR-002: Multi-Tenant Organization Binding

## Status
Accepted

## Context
Organizations are the root abstraction for masjids, madrasas, burial authorities, welfare orgs, and businesses. Partner tokens and actions are often scoped to a single organization.

## Decision
- Every OAuth token MAY include `org_id` when bound to an organization (org-bound client or user acting in org context)
- Requests to org-scoped endpoints (e.g. `organization.requests.manage`) require `org_id` in token and relationship validation
- Users may have multiple org memberships; token reflects current context
- Org binding validated via `OrganizationTeam` and role; authority binding via `AuthorityAdmin`

## Consequences
- Token exchange may require org selection when user has multiple memberships
- Middleware enforces org_id + relationship before delegating to domain logic
