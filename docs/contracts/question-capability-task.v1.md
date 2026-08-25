# Question → Capability → Task contract v1

This is the workspace-level contract used by Question Brain, Task Runtime, and
Fluent Lab. The machine-readable source is
[`question-capability-task.v1.schema.json`](question-capability-task.v1.schema.json)
and the review fixture is
[`question-capability-task.v1.fixture.json`](question-capability-task.v1.fixture.json).

## The one composition

```text
QuestionCard (Brain)
  ├─ theory / localized answer
  ├─ QuestionCapabilityBinding → Capability (Brain)
  └─ optional QuestionBinding → TaskFamily (Runtime)
                                  └─ TaskRevision × language/profile
                                        └─ Run (Runtime)
                                              └─ Evidence (Lab)
```

The arrows are released, revision-pinned joins—not copied prose or shared
tables. A card may be theory-only. A family may have multiple language
revisions. A Run can produce Evidence only through the Lab evidence contract.

## Non-negotiable invariants

1. Capability keys describe observable skills, never task filenames or sequence
   numbers. Technology appears in the key only when it is intrinsic to the
   skill.
2. Domain membership is an explicit many-to-many relation.
3. TaskFamily is language-neutral; TaskRevision owns exactly one language and
   profile.
4. Every QuestionBinding carries a stable question key, immutable revision ID,
   and content hash. Active Task Runtime contracts expose question-backed joins
   only as `questionBindings`; capability-only joins use `capabilityKeys`. The
   removed overloaded `questionKeys` projection is rejected by current
   readers and is retained only in explicit migration evidence.
5. Semantic edges and capability bindings are proposed/reviewed/released by
   Question Brain; Lab does not infer them from labels.
6. Run and Evidence are never stored in Question Brain, and executable source
   or hidden tests never cross into Lab.

The fixture intentionally includes a theory-only card, a Node-specific and a
PostgreSQL-specific capability, a language-neutral rate limiter with four
revisions, a circuit breaker under review, and a multi-capability capstone.
It is the small cross-repository contract test before larger production data
is migrated.
