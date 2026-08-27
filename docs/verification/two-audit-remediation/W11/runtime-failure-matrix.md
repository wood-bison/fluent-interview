# Runtime failure matrix

- Status: **PASS**
- Generated: 2026-08-27T21:48:13.710Z
- Runtime: http://127.0.0.1:48227

The matrix submits only disposable runtime runs. It does not write Lab progress, and source is recorded as a digest.

## Cases

- [x] missing-revision-rejected: HTTP 400 revision_required for node-rate-limiter-001
- [x] pass: HTTP 200, status=pass, duration=202ms
- [x] go-pass: HTTP 200, status=pass, duration=11527ms
- [x] java-pass: HTTP 200, status=pass, duration=688ms
- [x] csharp-pass: HTTP 200, status=pass, duration=1865ms
- [x] postgres-pass: HTTP 200, status=pass, duration=693ms
- [x] test-failure: HTTP 200, status=fail, duration=199ms
- [x] compile-failure: HTTP 200, status=error, duration=192ms
- [x] timeout: HTTP 504, status=timeout, duration=n/a
- [x] trace-evidence-identity: trace 6b6ff75cb5dd9e396464bcf5151e43d7 contains task.run with correlation, task and revision identity
- [x] resource-and-isolation-policy: memory/cpu/PID/network/read-only policy assertions pass

All exact-revision, cross-profile verdict, timeout, trace identity, redaction, and resource policy checks passed.
