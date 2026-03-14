# Endpoint Acceptance Template

Every new or modified endpoint MUST satisfy this checklist before merge.

## 1. OpenAPI Schema
- [ ] Endpoint path, method, summary, description defined
- [ ] Request body/query/params schema with validation rules
- [ ] Response schema for 2xx and error responses (4xx, 5xx)
- [ ] Security requirements (oauth2, public) specified
- [ ] Tags/categories assigned for grouping

## 2. Auth & Scope Checks
- [ ] Public vs protected clearly defined
- [ ] Required OAuth scopes documented and enforced
- [ ] RBAC, jurisdiction, relationship, consent checks as per matrix
- [ ] Org binding validated where applicable

## 3. Validation
- [ ] Request DTOs use class-validator or zod
- [ ] Validation errors return 400 with structured body

## 4. Audit
- [ ] Protected read/write emits audit log with: actor, action, target, timestamp, request_id

## 5. Tests
- [ ] Unit tests for domain logic
- [ ] Integration test for handler
- [ ] Contract test: response matches OpenAPI schema

## 6. Observability
- [ ] Request logged with trace_id
- [ ] Metrics emitted (latency, count, errors)
- [ ] No PII in logs
