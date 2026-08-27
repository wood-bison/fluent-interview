# W05 findings — Question Brain schema, metadata and taxonomy

## Closed in this wave

- EN/RU learner projections contain 1,591 cards each with 1,591 unique stable
  IDs and zero locale-only IDs.
- Published lane and execution-mode values are within the released enum set;
  topic-prefix checks report no lane violations.
- Normalized prompt collisions are all backed by durable decisions: the
  authentication/authorization pair is `not_duplicate`; the N+1 pair is
  `keep_separate` because one card is ORM-agnostic and the other is
  Hibernate/Spring-specific.
- The three punctuation/casing topic groups are the reviewed aliases already
  documented by Question Brain's taxonomy registry, not silent fuzzy merges.

## Remaining debt

- The registry still contains legacy labels as a compatibility snapshot. New
  writes must continue to use explicit canonical keys and alias decisions.
- Missing level/group/language metadata remains a bounded enrichment queue;
  this wave does not invent values for generic cards.
- The current Brain release is immutable; content changes require a new pinned
  release and a repeat of this audit.
- The current live database contains 1,596 published rows, five of which are
  fixture records excluded by the learner catalogue. The release and mapping
  gates intentionally use the 1,591 production denominator.

## Domain separation evidence

- Before: `path.algorithms/domain.runtime = 52` and
  `path.behavioral/domain.testing = 103`.
- After: `path.algorithms/domain.algorithms = 52` and
  `path.behavioral/domain.behavioral = 103`.
- The complete manifest dry-run is `covered=1591`, `missing_manifest=0`,
  `extra_manifest=0`, `invalid=0`, `blocked=false`.
- Replaying migration 0020 produced `UPDATE 0` for both data updates and a
  successful fail-closed verification block, proving idempotency.
- Dedicated shape negative cases reject Algorithms→Runtime,
  Behavioral→Testing and Node→Algorithms placements.
