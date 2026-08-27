# W13 changes — learner journey coverage

W13 is an evidence wave over the Vue learner surface. The existing smoke suite
now exercises the released journey rather than treating route reachability as
success:

- Program, Atlas, nine path projections, Practice modes and Questions use
  server-owned counts and route links.
- Path runtime pickers expose all released language revisions and preserve the
  selected exact `taskId@revision&taskFamily` in the workspace href.
- TaskFamily presents the language-neutral contract first and exposes the
  language/revision boundary before opening Workspace.
- Event Loop and code Workspace journeys cover prediction, run, trace/evidence,
  hidden-check results, retry/outage/timeout, reload restoration and idempotent
  submissions.
- Project chapters, defense, AI companion, Navigator dock, profile settings,
  light/dark theme and RU/EN route content are exercised in the same shell.
- Every tested desktop surface asserts horizontal-overflow bounds and a
  meaningful heading; the route suite also checks canonical aliases and
  unexpected request/console-error absence on failure-oriented paths.

The route/action gate in W12 remains the authority for whether a CTA is
allowed; these browser tests prove that the learner can actually follow it.
