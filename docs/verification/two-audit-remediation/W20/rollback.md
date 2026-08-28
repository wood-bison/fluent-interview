# W20 — rollback boundary

Перед заменой пакета создан и self-verified full-local backup:

- artifact: `/tmp/fel-full-local-backup-20260828-1324.json`;
- id: `learner-backup-20260828112341-95926202-347`;
- SHA-256: `5c4a52f81c1c90c89e8978334ad0740a4956188b88c7db9f76bb7dda3407de8f`;
- rows: `12,251`;
- payload digest: `6804c5b652218a8c377337ee85de2bf2bd4e8570dd6ec596bcc97275fe408c6c`.

Текущая граница пакета: `f011aabc-6bfd-4a37-9369-833957e815fa` (Vue
`667f462`). Операторский rollback из корня Lab:

```bash
pnpm package:local:rollback
```

Lifecycle gate откажется выполнять rollback без совпадающей verified backup
identity и provenance.
