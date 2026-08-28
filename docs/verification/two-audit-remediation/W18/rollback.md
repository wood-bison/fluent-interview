# W18 rollback

The change is a browser-only Vue revision. The release boundary was created by
`package:local:upgrade` after a fresh full-local learner backup and restore
preflight:

- backup artifact: `learner-backup-20260828104745-38e3618f-1f6`;
- backup SHA-256: `775139bd21aa5d0eec8cf873d58da96dc5948337f4394f76662b672b0b10efb8`;
- rows/bytes: `12,161 / 10,250,325`;
- previous package boundary: `71234473-1636-4534-b663-54478c126adb`;
- current package boundary: `0625e0bf-2c1b-4773-9d2e-74d9b987b7ff`.

To restore the previous learner web release without touching durable data:

```bash
cd /Users/sergeyzhechko/developer/fluent-interview/fluent-engineering-lab
pnpm package:local:rollback
```

The rollback command owns the boundary and keeps Postgres/Redis volumes. A
forward promotion must repeat the backup, preflight and route smoke; no manual
replacement of the packaged `dist` directory is allowed.
