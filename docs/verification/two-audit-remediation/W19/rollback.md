# W19 — rollback boundary

Upgrade is reversible through the verified full-local artifact created before the package replacement:

- artifact: `/tmp/fel-vue-locale-backup-20260828.json`;
- id: `learner-backup-20260828110204-3840de45-56f`;
- SHA-256: `7e6555d1057d021e8f67429d61a823e6389498fda408379256022c4bef25376f`;
- rows: `12,161`;
- payload digest: `17470a02353b103d188e6a18ec25fbfedb41a98bdeef08e9685392247c7a4d3a`.

Previous package boundary: `db76fb8d-bd0c-4ad6-8b17-447253594edd` (Vue `ed4d4e3`).

Current package boundary: `43c4b6c8-9874-431d-b9b8-6098942a6449` (Vue `31b6356`).

Operator rollback command from the Lab root:

```bash
pnpm package:local:rollback
```

The package lifecycle refuses a rollback when the recorded verified artifact or component provenance does not match the reviewed boundary.
