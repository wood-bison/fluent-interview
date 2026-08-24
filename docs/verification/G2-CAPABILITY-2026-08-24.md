# G2 evidence — canonical capability registry

Date: 2026-08-25  
Status: **complete**  
Gate: G2 — capability registry, canonical naming, aliases, and domain bindings

## Delivered

Question Brain `main` now contains the reviewed capability registry migration
and its contract tests. The registry has immutable canonical keys, localized
display metadata, lifecycle states, explicit aliases/supersedes provenance,
and a many-to-many `CapabilityDomainBinding` table. Historical task-shaped
keys remain readable and are deprecated; they are not silently rewritten in
question revisions, runtime releases, or learner evidence.

The reviewed disposition is
`fluent-question-brain/docs/manifests/capability-registry-2026-08-24.json`.
The no-write inventory is
`fluent-question-brain/docs/verification/g2-capability-migration-dry-run-2026-08-24.json`.

## Live evidence

Question Brain Postgres after applying `0015_capability_registry_v2.sql`:

| Metric | Count |
|---|---:|
| Capability/domain bindings | 26 |
| Alias rows | 11 |
| Supersedes rows | 11 |
| Active canonical capabilities | 15 |
| Deprecated historical capabilities | 11 |
| Production cards | 1,591 |
| Fixture cards (excluded from release) | 5 |
| Embeddings | 10,653 |

The dry-run covers all 15 old keys with deterministic dispositions (`keep=4`,
`rename=11`, `split=0`, `merge=0`, `retire=0`) and reports
`unresolved=[]`, `writeMode=none`, and 18 Task Runtime references. The two
rate-limiter keys remain separate pending later semantic review.

## Safety and acceptance

- Migration is additive and idempotent; it was re-applied to the live volume
  and passed migration smoke.
- Historical aliases resolve to one canonical key for reads/ingest, while a
  new release manifest rejects deprecated keys and requires the canonical key.
- Foreign keys reject dangling aliases/supersedes; the database trigger
  `taxonomy_capability_supersedes_cycle` rejects cyclic provenance.
- Composite uniqueness prevents duplicate capability/domain edges. API-level
  projection deduplication is intentionally owned by G8, before any registry
  results are exposed as learner stations.
- No card or release hash was rewritten by G2.

Checks:

```text
make contract                                      PASS
scripts/migration-smoke.sh                         PASS
docker Go 1.24: go test ./...                      PASS
python3 scripts/g2-capability-dry-run.py ...       PASS (unresolved=[])
deprecated release key validator                  PASS
Question Brain /health/ready                       PASS
```

## Owner commits

- `7daf53d` — canonical registry, migration, manifest, dry-run, evidence
- `89946a3` — reject deprecated capability keys in new manifests
- `19e9fdf` — supersedes-cycle trigger and integrity smoke

G3 may start. G7/G8 must still perform the reviewed card bindings and release
join; G2 deliberately does not bulk-assign the current published corpus.
