# ADR-005: Ledger Immutability Model

## Status
Accepted

## Context
Ad revenue accounting must be audit-proof. No mutable balances; all revenue derived from ledger aggregation.

## Decision
- `AdEvent` and `RevenueLedger` (and `RevenueDistribution`) are append-only
- No UPDATE or DELETE on financial rows; only INSERT
- Corrections via compensating entries (new rows with negative amounts or reversal references)
- Balances computed by aggregation (SUM) over ledger; never stored
- Settlement creates `RevenueDistribution` rows; settlement_status on ledger rows updated only to immutable values (e.g. SETTLED)
- Event hashing: SHA-256 of critical fields for integrity verification

## Consequences
- All revenue logic is reproducible from event stream
- Heavy read workloads for aggregations; use materialized views or cached aggregates for reporting
