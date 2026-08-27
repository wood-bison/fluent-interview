# W07 changes

- Added the executable `QuestionGraphEdgeKindRegistry()` with explicit
  prerequisite/follow-up/contrast/variant/supersedes/duplicate/related
  semantics and learner effects.
- Added fail-closed evidence validation: confidence `1.0` requires rationale
  and source; an accepted edge requires reviewer actor, decision timestamp and
  rationale; production proposals cannot use fixture/smoke/synthetic/test
  provenance.
- Added idempotent migration
  `fluent-question-brain/db/migrations/0021_question_graph_evidence_guards.sql`
  and applied it to the durable dev database. The root launcher applies it on
  every start; no volumes or question payloads were deleted.
- Added `graph-release-audit.mjs`, which joins active graph edges to accepted
  proposal evidence and the published catalog, detecting unknown kinds,
  orphaned/stale/archived targets, cycles, duplicate edges, missing evidence,
  and test provenance.
- Reviewed the eight accepted fixture/smoke proposals found in the production
  workspace. All were rejected through the review API with an explicit W07
  cleanup rationale; the historical rows and audit events remain intact.
- Published the deterministic empty production graph release
  `question-graph-release-e3b0c44298fc1c14`; the active release now contains no
  test provenance or learner edges until a real reviewed semantic release is
  authored.
