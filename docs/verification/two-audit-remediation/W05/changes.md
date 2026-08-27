# W05 changes

1. Added `scripts/question-catalog-integrity-audit.mjs`, a reproducible
   read-only gate for stable IDs, locale parity, published enums, lane/topic
   shape, normalized prompts and topic aliases.
2. Added quality/review reconciliation: the gate reads durable duplicate
   decisions from Question Brain in addition to the diagnostic quality
   projection, so punctuation-only variants cannot be falsely reported as
   open after a reviewed decision.
3. Recorded the explicit `keep_separate` decision for
   `question.c004` ↔ `question.q016` through the authenticated Brain API, with
   rationale and actor `codex-w05-review`.
4. Added the W05 JSON/Markdown evidence and deterministic content digest.
5. Added `domain.algorithms` and `domain.behavioral` to the Brain taxonomy and
   enforced dedicated path/domain shape invariants in the explicit placement
   resolver.
6. Added idempotent migration `0020_curriculum_domain_separation.sql` and the
   deterministic follow-up manifest
   `releases/curriculum-mapping-2026-08-27-domain-separated.json`.
7. Rebuilt the development stack with the new manifest. The dry-run reports
   `1591/1591` covered, `0` blocked, `0` changed on the second apply; the live
   SQL projection confirms 52 Algorithms and 103 Behavioral rows on their
   dedicated domains.
8. Documented the decision in Brain ADR-0005 and the taxonomy contract.

No learner answer, source hash, or immutable question-release payload was
rewritten. Only revision-scoped mapping rows changed.
