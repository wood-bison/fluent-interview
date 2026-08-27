# W01 findings

## Confirmed

- All five product Git roots exist directly under the canonical workspace.
- Every declared root is on `main`; Vault was fast-forwarded from the review
  branch into local `main` without rewriting history.
- Immutable 40-character baseline revisions are now recorded in
  `workspace.yaml` and match each current `HEAD`.
- `pnpm layout:check`, development provenance validation and diff hygiene pass.
- `developer/sandbox/fluent-engineering-lab`,
  `developer/sandbox/fluent-interview-studio` and
  `developer/sandbox/fluent-prompt-studio` are historical Git projects, not
  silently deleted product roots. The old Lab sandbox has a different current
  history and must not be removed without an explicit archival decision.

## Release blocker

`fluent-engineering-vue` has no configured `origin` remote. The manifest keeps
the explicit development value `local-only` instead of inventing an unverified
repository URL. Strict provenance therefore fails closed. Lab/Vue/Brain/Runtime
also have uncommitted remediation work, so their pinned commits are only the
baseline commit, not a claim that the dirty tree is releasable.
