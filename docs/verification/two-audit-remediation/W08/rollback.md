# W08 rollback

The release is an additive, answer-free file. To roll back, stop consuming
`learning-module-release-2026-08-27.1` and pin the previous module release (or
return to the pre-W08 path/domain projection) without touching Question Brain
rows or Docker volumes. Do not delete the generated manifest or evidence;
retain it for audit and reproducibility.

If the Brain release changes, generate a new module release and run the gate.
The gate intentionally fails on stale `questionReleaseId` or graph pins rather
than silently falling back to latest.
