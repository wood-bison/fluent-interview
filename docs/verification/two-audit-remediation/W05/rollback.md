# W05 rollback

The catalogue audit and mapper are read-only. To reverse the editorial
decision, do not edit the immutable Question Brain release: submit a new
authenticated duplicate decision with a documented rationale, or roll the
database snapshot back using the Brain backup/restore runbook. The recorded
decision is auditable in `content.duplicate_candidate` and
`content.audit_event`.

No destructive command, volume deletion, card deletion, or release rewrite was
performed in this wave.

For the domain migration, rollback means re-running the previously approved
`releases/curriculum-mapping-2026-08-25-canonical.json` through the same
`qb-map-release --approve` boundary after taking a fresh backup. Migration
0020 itself is additive/idempotent and does not delete domains; it is not a
rollback mechanism. A rollback rehearsal was not executed in this wave and
remains W05-027 debt.
