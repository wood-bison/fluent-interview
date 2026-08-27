# W07 rollback

The cleanup is reversible without restoring fixture edges to the learner
release: the previous release `question-graph-release-7c9d2bf4a73a5d49` is
immutable and marked `rolled_back`, and all eight proposal rows remain in the
database with their audit events. Do not re-accept those rows. To recover a
mistaken decision, author a new reviewed proposal with production provenance
and run the dry-run gate before approval.

Migration `0021_question_graph_evidence_guards.sql` is idempotent. Removing the
new code before a committed release requires reverting the source and compose
mount together; keep the database constraints and historical graph releases
until a reviewed rollback plan is approved.
