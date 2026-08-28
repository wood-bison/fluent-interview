# G0 rollback and recovery

G0 does not alter application source or databases. Recovery is therefore
rehearsed from disposable copies only.

## Repository recovery

1. Create a disposable directory outside the workspace.
2. Clone a selected bundle, for example:

   `git clone /Users/sergeyzhechko/.codex/backups/fluent-interview-greenfield-2026-08-28/fluent-interview.bundle /tmp/fluent-g0-recovery`
3. Verify the expected tag and SHA from `repository-inventory.json`.

## Database recovery

The two custom-format dumps were restored into disposable PostgreSQL 17 and 18
containers with explicit names/volumes, probed (`108` and `117` ordinary tables),
then removed. The durable reference volumes were never removed.

## Runtime recovery

Use the workspace-owned command:

```bash
cd /Users/sergeyzhechko/developer/fluent-interview
pnpm down
pnpm dev
```

`pnpm down` preserves durable volumes and removes only the three Fluent Compose
projects. It does not run `docker compose down -v`, global prune, or touch
unrelated Docker resources.
