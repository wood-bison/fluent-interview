# G0 known limitations

These are explicit inputs to G1, not hidden failures:

1. Go and .NET are not installed on the host. G1 must pin them in containerized
   toolchain lanes or install exact versions; floating `latest` is prohibited.
2. The current reference is intentionally five child Git roots. The target
   monorepo is not created yet and must never be treated as a continuation of
   those histories.
3. `fluent-engineering-vue` has no remote. It is reference-only and is captured
   by bundle/manifest, not published by the target.
4. Unrelated containers (`clickhouse`, `kafka_broker`, `mysql`, `redis`,
   `localstack_s3`, `searxng-pi`) and many non-Fluent volumes existed before G0.
   They were not deleted; target Compose must prove resource scoping without
   relying on global cleanup.
5. The reference does not expose `/api/openapi.json`. Contract/schema tests and
   the versioned client contracts are the current surface authority.
