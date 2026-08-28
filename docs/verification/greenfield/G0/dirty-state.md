# G0 dirty-state triage

The baseline was collected before target creation. No dirty path was staged,
deleted, reset, or overwritten.

## Classification

- Umbrella root: 23 modified files under `CONTEXT.md`, `docs/WISHLIST.md`,
  `docs/verification/two-audit-remediation/**`; these are prior audit/evidence
  outputs. New greenfield documents are untracked audit outputs and remain
  separate from the G0 commit.
- `fluent-engineering-lab`: five modified JSON/Markdown evidence files under
  `docs/production/evidence` and `docs/verification/two-audit-remediation/W02`;
  these are prior remediation evidence, not target source.
- Vue, Brain, Runtime, Vault: clean working trees at the captured HEADs.
- Unknown source-code dirty paths: **0**.
- Untracked files unrelated to the audit: **0 observed**.

## Safety artifacts

The six repository bundles, tracked-file manifests, status/remotes/tags
snapshots, binary patches for tracked dirty changes, and database dumps are
stored outside Git at:

`/Users/sergeyzhechko/.codex/backups/fluent-interview-greenfield-2026-08-28/`

The backup directory is intentionally not a runtime dependency and is not
deleted by `pnpm down` or any workspace cleanup command.
