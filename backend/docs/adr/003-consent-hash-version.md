# ADR-003: Consent Hash and Version Model

## Context
Field-level access to user data requires consent. Tokens must reflect current consent state; revocation must invalidate access.

## Decision
- `ConsentProfile` stores `scope_json` with version; `valid_from` / `valid_to` for time-bounded consent
- Consent hash = SHA-256(scope_json + version + user_id + org_id). Included in JWT as `consent_hash`
- On every protected read of consent-gated fields: validate token consent_hash matches current ConsentProfile
- Mismatch → 401; user must re-authorize
- Consent version incremented on any scope change; old tokens invalidated

## Consequences
- Token lifetime should be short (e.g. 15 min access, 7d refresh) to limit consent drift
- Consent changes propagate via hash; no token blacklist required for consent revocation
