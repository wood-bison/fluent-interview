# W12 changes — server-owned route/action projection

- Added the versioned `learner-route-context.v1` contract with explicit route
  family, phase, readiness, canonical path, recovery, and allowed actions.
- Extended the public resource projection with the exact Runtime
  `revision` + `taskFamilyKey` tuple; these fields remain answer-free.
- Made route parsing accept only bounded revision/family selections. An
  incompatible pair, invalid revision, unknown lab, or unsafe `returnTo`
  becomes a recoverable route instead of silently selecting another task.
- Passed the exact tuple through Workspace and Run boundaries. Runtime lookup
  checks released/runnable status, task id, revision, and family before reading
  files or executing hidden checks.
- Added the Vue API schema/client and shell projection. Contextual actions are
  rendered only after the server projection is loaded and only when the action
  is allowed for that route.
- Added an 11-case live gate covering program/map/practice/theory/lab/journal,
  exact revision selection, unsafe return targets, and tampered Runtime query.
- Added a canonical-route guard and browser regression for legacy `/program`,
  `/map`, `/practice/questions`, and `/practice/lab/:id` aliases. Query and
  hash context survive every redirect; lesson CTAs now take controlled routes
  from the released Program map instead of an Event Loop fallback.

This wave does not claim that every legacy alias or hand-authored destination
has been removed; those remain explicit W12/W13 debt and are not hidden by the
gate.
