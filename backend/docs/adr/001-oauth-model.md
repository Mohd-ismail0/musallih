# ADR-001: OAuth Model

## Status
Accepted

## Context
Musallih exposes Public (no auth) and Partner (OAuth) APIs. Partner APIs require fine-grained scopes, organization binding, jurisdiction awareness, and consent enforcement.

## Decision
- Implement OAuth 2.1 with Authorization Code + PKCE as the primary flow
- Support Device flow for IoT (deferred to Phase 3)
- JWT access tokens with claims: `sub`, `client_id`, `scopes`, `org_id`, `authority_level`, `jurisdiction_codes`, `consent_hash`
- Refresh tokens stored server-side; rotation on use
- PKCE mandatory for public clients; optional for confidential clients
- Scope format: `domain.resource.action` (e.g. `profile.basic.read`)

## Consequences
- Token validation and consent_hash check on every protected request
- Consent revocation invalidates tokens via consent_hash mismatch
- Partner clients must obtain consent before requesting sensitive scopes
