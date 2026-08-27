# W10 findings

## Fixed

- All 1,591 published cards have an explicit answer-free activity disposition.
- 48 cards carry the structured Brain task flag; 42 are runtime-evidence
  candidates and six are design activities. None are silently promoted from
  a label alone.
- Behavioral/project prompts are `defend`; system-design groups are `design`
  with a design rubric; troubleshooting/code-review groups are `debug`.
- The 85-card Practical Tasks-without-structure cohort is visible as an
  editorial queue, not a false executable CTA.
- `llmAutoPublish=false`, human review is required, and the queue is bounded
  at 100 items.

## Remaining W10/W11 work

- The 85 queued cards need editorial decisions and, where appropriate,
  structured TaskFamily or external-project briefs.
- Runtime binding, hidden-test boundaries, starter ownership and exact
  revision evidence are W11 work; the current report deliberately shows zero
  released executable activity bindings.
