# Runtime failure matrix

- Status: **PASS**
- Generated: 2026-08-27T22:34:13.686Z
- Runtime: http://127.0.0.1:48227

The matrix submits only disposable runtime runs. It does not write Lab progress, and source is recorded as a digest.

## Cases

- [x] missing-revision-rejected: HTTP 400 revision_required for node-rate-limiter-001
- [x] pass: HTTP 200, status=pass, duration=209ms
- [x] go-pass: HTTP 200, status=pass, duration=11541ms
- [x] java-pass: HTTP 200, status=pass, duration=578ms
- [x] csharp-pass: HTTP 200, status=pass, duration=1870ms
- [x] postgres-pass: HTTP 200, status=pass, duration=691ms
- [x] test-failure: HTTP 200, status=fail, duration=198ms
- [x] compile-failure: HTTP 200, status=error, duration=191ms
- [x] timeout: HTTP 504, status=timeout, duration=n/a
- [x] trace-evidence-identity: trace 3d27db7b267e99ea11252b8db438c48e contains task.run with correlation, task and revision identity
- [x] resource-and-isolation-policy: memory/cpu/PID/network/read-only policy assertions pass

All exact-revision, cross-profile verdict, timeout, trace identity, redaction, and resource policy checks passed.
