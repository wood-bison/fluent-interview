# Gate W05 — PASS WITH REVIEW QUEUE

The published EN/RU learner catalog is structurally valid and locale-parity
safe. All observed normalized prompt collisions now have explicit durable
review decisions, so the blocking count is zero. Three canonical topic alias
groups remain visible as reviewed compatibility aliases; they are not silently
rewritten and must stay covered by the Brain taxonomy registry.

Evidence:

- `question-catalog-integrity.json` / `.md`
- `question-catalog-integrity.json.contentDigest = 6cc1df1d3049e591cae0b32ca723e10f1db64f369c232640db56da22f04e4c09`
- Brain `question-brain.duplicate-review.v1` decision for
  `question.c004 ↔ question.q016`

The wave does not claim that missing metadata or a new immutable release has
been produced; those remain explicit follow-up items.

The dedicated-domain migration is also green: the complete mapping release is
revision-pinned, dry-run clean, idempotent on replay, and shape tests reject
dedicated-lane leakage. The new mapping fingerprint is
`question-mapping-release-026566381561db3e`. Metadata enrichment, the full
path×domain×topic×language matrix, and rollback execution remain open W05
items; no checkbox is closed for those without a separate evidence artifact.
