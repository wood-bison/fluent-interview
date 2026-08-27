# W00 mutation-safety review

Reviewed before further waves:

- `scripts/status.sh` — reads Git, Docker and HTTP state.
- `scripts/workspace-git-check.mjs` — reads Git topology and provenance.
- `scripts/layout-check.sh` — reads workspace layout.
- `scripts/release-verify.mjs --dev` — executes checks and writes only its declared verification output.
- `fluent-question-brain/scripts/backup-restore-smoke.sh` — creates a disposable database and removes only its temporary dump/disposable database through its trap; it does not touch the source database or named durable volume.

The review intentionally did not run any prune, volume removal, destructive
checkout, migration, publish or release promotion command. The external
`spearad-test-stack`, `goofy_gould`, `searxng-pi`, Testcontainers Ryuk and other
unowned resources remain untouched.
