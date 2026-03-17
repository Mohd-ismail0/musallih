# ADR-006: Organization Branch Support

## Status
Accepted

## Context
Masjids, welfare organizations, and other Islamic institutions often operate multiple branches or locations under a single governing entity. The platform needed to support:
- A masjid network with a main location and branch locations
- Welfare organizations with regional offices
- Madrasas with multiple campuses

## Decision
- Add `parent_organization_id` (nullable FK → Organization) to link branches to a parent
- Add `branch_type`: STANDALONE (default), HEADQUARTERS (has branches), BRANCH (child of parent)
- When creating a branch (`parent_organization_id` set), `branch_type` must be BRANCH; parent is auto-updated to HEADQUARTERS if currently STANDALONE
- On parent deletion: `ON DELETE SET NULL` so branches become standalone
- New API endpoints: `GET /organization/:id/branches`, `GET /organization/:id/parent`
- `GET /organization/:id` includes `parentOrganization` and `branches` in response

## Consequences
- Existing organizations remain STANDALONE (backward compatible)
- Branch hierarchies are one level (no nested branches); can be extended later if needed
- Discovery and listing can filter by branch_type or traverse parent/branches
