# Contributing to Musallih Documentation

## Scope
This repository is documentation-first. It captures the product requirements,
architecture, governance, and workflow specifications for the Musallih platform.

## How to contribute
- Propose changes via issues or pull requests.
- Describe the problem, the proposed update, and impacted documents.
- Keep changes focused and include rationale for requirement updates.
- Link to any related discussions or decisions.

## Documentation conventions
- Use Markdown with clear, consistent headings.
- Prefer concise paragraphs and bullet lists.
- Keep language precise and testable (MUST, SHOULD, MAY).
- Use Mermaid diagrams when a flow or data model is clearer visually.
- Avoid adding non-ASCII characters unless already present in the file.
- Cross-link related documents when a change affects multiple areas.

## Consistency checklist
When updating requirements, verify related documents stay aligned:
- If you change roles or permissions, update `full_role_permission_matrix.md`.
- If you change API access, update `oauth_scope_system_partner_api_permission_map.md`.
- If you change data models, update `musallih_platform_complete_er_diagram.md`.
- If you change workflows, update the corresponding flow diagrams.
- If you add new core concepts, update `README.md` and `ARCHITECTURE.md`.

## Review notes
Reviewers should check:
- Alignment with the PRD and platform principles
- Impact on consent, jurisdiction, and audit enforcement
- Implications for partner APIs and external integrations
- Clarity and completeness of diagrams and definitions

## License
By contributing, you agree that your contributions are licensed under the terms
in `LICENSE`.
