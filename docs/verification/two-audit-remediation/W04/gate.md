# Gate W04 — PARTIAL PASS

The local Docker provenance and lifecycle safety defects found by the audit
are materially fixed and live-verified. Every built service has an immutable
image ID and source SHA; every owned base image and task image is digest
pinned; scoped cleanup is read-only by default and does not target unrelated
resources. The workspace launcher now also enforces one exclusive
`development|production` mode with a fail-closed lock and a negative test.

The gate is not a production promotion: the five repositories are still dirty,
Vue has no verified origin, the package service-image digest/SBOM set is not
published, and exact-digest rollback has not been exercised. Those conditions
remain explicit W01/W04/W18 blockers rather than being hidden behind a green
development check.
