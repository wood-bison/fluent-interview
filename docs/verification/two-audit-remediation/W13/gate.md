# Gate W13 — PASS WITH EXPLICIT JOURNEY DEBT

The released Vue learner journey is green in both configured desktop profiles;
the current E2E run contains 76 scenarios and the aggregate development
gate reports zero failures. This proves the current learner surfaces are
reachable and interactive, not merely that the router has records.

The wave remains partial until synthetic-profile isolation receives a
dedicated assertion. Exact run identity, browser history/scroll restoration
and deep-link reload now have dedicated checks. The local pass is not a
production release while package provenance remains dirty.

Evidence: `W13/tests.json` and the aggregate `W03/release-verify-current.json`.
