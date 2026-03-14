# Musallih Backend Standards

## Branch Strategy
- `main` – production-ready; protected; requires PR approval
- `develop` – integration branch; default for feature merges
- `feature/*` – feature branches (e.g. `feature/identity-module`)
- `fix/*` – bugfix branches
- `release/*` – release preparation branches

## Semantic Commit Policy
All commits MUST follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(scope): description` – new feature
- `fix(scope): description` – bug fix
- `docs(scope): description` – documentation only
- `refactor(scope): description` – refactoring
- `test(scope): description` – tests only
- `chore(scope): description` – build, deps, config

## Migration Policy
- Migrations are forward-only; no destructive migrations for production data
- Each migration must be idempotent where possible (IF NOT EXISTS, etc.)
- Rollback scripts documented per migration set for emergency use
- Migrations run before app boot in all environments

## API Version Policy
- All non-internal endpoints MUST use version prefix: `/v1/`
- Public open APIs may use `/v1/` or root paths; root paths MUST be versioned in headers if not in path
- Breaking changes require new version (`/v2/`); old version supported during deprecation window
- Deprecation: minimum 6 months notice; `Deprecation` and `Sunset` headers on responses

## Code Quality Gates
- ESLint + Prettier; zero warnings on CI
- TypeScript strict mode; no `any` without explicit justification
- Test coverage: minimum 80% per module for domain logic; 100% for financial/ledger paths
- Contract tests: all handlers must match OpenAPI spec
