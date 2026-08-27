# W10 changes

- Added an answer-free activity disposition for every published card.
- Explicitly distinguish `recall`, `explain`, `code`, `debug`, `design` and
  `defend` activities with evidence modes (`spoken`, `runtime`,
  `design-rubric`, `incident-evidence`).
- Added a bounded editorial queue for 85 cards labelled Practical Tasks but
  lacking a structured task flag. They are not advertised as runnable.
- Added guards that keep behavioral prompts out of sandbox code and system
  design cases out of runtime-only evidence.
- Added a release verifier step and machine-readable report. The report never
  includes prompt/answer/private source fields and keeps `Run` closed until an
  exact TaskFamily binding exists.
