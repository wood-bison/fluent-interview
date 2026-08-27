# W07 findings

## Fixed

- Production graph release no longer contains the seven active fixture edges.
  The eight accepted fixture/smoke proposals were rejected, not deleted, so
  the audit trail is preserved.
- The active release is `question-graph-release-e3b0c44298fc1c14` with zero
  edges, zero cycles, zero stale/archived/orphaned endpoints, and zero test
  provenance. An empty trusted graph is intentional while semantic edges await
  editorial review.
- Edge semantics are now centralized and test-covered. Only `prerequisite`
  can gate recommendations and it must be acyclic; all other kinds are
  explanatory or historical relations.
- API, CLI, and database boundaries reject unproven confidence `1.0`, missing
  reviewer evidence, and test provenance in the production workspace.

## Remaining W07 work

- The 2,001 proposed `related` edges are still a bounded editorial backlog;
  none can reach the learner release without explicit decisions.
- No human-reviewed semantic production edge release has been authored yet.
  Future work must review real prerequisites, contrasts, follow-ups and
  variants, then compare candidate vs previous release and preview TrackView
  impact before approval.
- Incompatible-capability checks, archived-fixture rejection campaigns,
  learner-recommendation reconciliation, and a rollback rehearsal remain open.

## Evidence

The read-only executable report is owned by the root verification bundle and
contains the stable digest and reproduction commands:

`docs/verification/two-audit-remediation/W07/graph-release-audit.md`
