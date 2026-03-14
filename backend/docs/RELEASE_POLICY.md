# Musallih Backend Release Policy

## Environment Ladder
1. **local** – developer machine; Docker Compose
2. **dev** – shared development; ephemeral data
3. **staging** – pre-production; production-like infra
4. **pre-prod** – final validation; production data copy (sanitized)
5. **prod** – production

## Promotion Rules
- Migrations: forward-only; no destructive migrations to prod
- Each promotion requires: passing CI, successful migration, health check
- Rollback: revert to previous Docker image; migrations are additive only (no automatic rollback migrations)

## Release Candidate Criteria
- All tests pass (unit, integration, contract, e2e)
- No critical/high defects
- Security scan clean
- SBOM generated
- Runbook updated

## Canary Release
- High-risk modules (ads, ledger, settlement): deploy to subset of traffic first
- Monitor error rate, latency; rollback on threshold breach
