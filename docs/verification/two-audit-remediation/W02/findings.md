# W02 findings — domain model, ownership and ADR

## Fixed and documented

- The umbrella glossary and Lab `CONTEXT.md` now use one vocabulary for
  `Path`, `TrackView`, `LearningModule`, `QuestionPlacement`, `Activity` and
  `EvidenceMode`.
- The four readiness dimensions are named explicitly. Cross-service contracts
  may not publish an unqualified `ready` claim.
- ADR-0038 records reusable modules and release-scoped many-to-many placements;
  ADR-0039 separates Question Brain content graph from Lab curriculum graph;
  ADR-0040 separates activity/evidence kinds from content completeness.
- ADR-0038 explicitly rejects copying generic cards into each language path.
- Existing Lab contract tests reject private/source fields and keep counts,
  routing and readiness server-owned at the HTTP boundary.

## Remaining boundary work

- The dedicated `LearningModule`/`QuestionPlacement` validator now has a
  negative matrix for duplicate tuples, foreign/private fields, missing owners,
  release mismatch and prerequisite cycles. The browser owner guard also has a
  checked-in baseline for the 14 known transitional display/route derivations.
  These are explicit W12 debt, not silently accepted authority.
- The 14 transitional Vue derivations still need to be replaced by the
  server-owned `LearningActionProjection` in W12; the guard deliberately keeps
  them visible until that migration is complete.
- The current public Program contract is still `learner-program.v1`; additive
  module/placement fields require a versioned projection rather than silently
  changing that contract.
