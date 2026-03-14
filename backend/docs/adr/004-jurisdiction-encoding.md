# ADR-004: Jurisdiction Encoding Model

## Status
Accepted

## Context
Authority hierarchy is City → State → Country → Global. Geo-boundaries and org authority bindings must be queryable and validated efficiently.

## Decision
- Jurisdiction codes: `CITY:<id>`, `STATE:<id>`, `COUNTRY:<id>`, `GLOBAL`
- Authority table: `level` (CITY|STATE|COUNTRY|GLOBAL), `parent_id` (self FK), `geo_boundary` (PostGIS geometry)
- Organizations have `authority_id` FK → Authority; inherit hierarchy via parent chain
- Token `jurisdiction_codes`: array of codes the actor can act within (e.g. `["CITY:1","STATE:5"]`)
- Geo proximity queries use PostGIS `ST_Contains`, `ST_DWithin` on `geo_boundary` and org `geo_location`

## Consequences
- Authority hierarchy traversal via recursive CTE or materialized path
- All jurisdiction checks resolve to set containment (actor codes ⊆ required codes)
