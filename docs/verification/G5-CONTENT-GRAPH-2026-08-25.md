# G5 — reviewed Question Brain content graph

Status: **closed**
Date: **2026-08-25**

Question Brain now has a revision-aware, reviewed content graph. Proposals and
immutable released edges are separate; only accepted edges enter the learner
projection. Workspace triggers, foreign keys, self-edge checks, stale revision
checks, and transactional prerequisite-cycle checks fail closed. The legacy
topic placement graph remains explicitly separate.

Live evidence:

- Question release: `question-release-d00a14931e607336`.
- Active graph release: `question-graph-release-7c9d2bf4a73a5d49`.
- Seven accepted/released edges cover prerequisite, related, contrast,
  follow_up, variant, and supersedes.
- Two rejected proposals remain auditable (duplicate candidate and rejected
  prerequisite cycle); neither leaked into the release.
- Active release has six immutable edges, zero stale endpoints, and zero cycles.
- API routes expose proposals, release metadata, and neighborhoods; mutation
  routes require the internal token and actor.
- `qb-graph-edges` provides proposal, decision, dry-run, approve, export, and
  rollback operations.

Verification passed: Docker Go 1.24 `go test ./...`, `make check`, `make
smoke`, `make graph-smoke`, readiness, API release/neighborhood reads, expected
HTTP 409 for the reverse prerequisite cycle, idempotent active approval, and
immutable rollback/reuse rejection.

Detailed implementation and commands:
[`fluent-question-brain/docs/verification/G5-CONTENT-GRAPH-2026-08-25.md`](../../fluent-question-brain/docs/verification/G5-CONTENT-GRAPH-2026-08-25.md)
