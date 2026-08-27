# W06 rollback

Changes are additive and release-bound. No database migration or destructive
data operation was run. To roll back before commit, revert only the listed
Brain/Lab source files after review; keep the catalog release and Postgres
volumes intact. A future Brain release without `learning_layers` remains
supported by the Lab's conservative fallback.

The funnel endpoint and Studio projection are additive. If a funnel release is
rejected, remove the endpoint/UI wiring in one change set and keep the prior
question catalog release; no question payload or database row is deleted. The
generated EN/RU JSON/Markdown files are evidence artifacts and can be
regenerated from the same release-pinned API. Do not bypass the executable
funnel gate or promote an LLM-generated queue item without human-review
evidence.
