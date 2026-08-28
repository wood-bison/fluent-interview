# Runtime failure matrix

- Status: **PASS**
- Generated: 2026-08-28T08:14:46.686Z
- Runtime: http://127.0.0.1:48227

The matrix submits only disposable runtime runs. It does not write Lab progress, and source is recorded as a digest.

## Cases

- [x] missing-revision-rejected: HTTP 400 revision_required for node-rate-limiter-001
- [x] pass: HTTP 200, status=pass, duration=256ms
- [x] go-pass: HTTP 200, status=pass, duration=13576ms
- [x] java-pass: HTTP 200, status=pass, duration=1117ms
- [x] csharp-pass: HTTP 200, status=pass, duration=2601ms
- [x] postgres-pass: HTTP 200, status=pass, duration=881ms
- [x] test-failure: HTTP 200, status=fail, duration=213ms
- [x] compile-failure: HTTP 200, status=error, duration=200ms
- [x] timeout: HTTP 504, status=timeout, duration=n/a
- [x] trace-evidence-identity: trace b08319d34ad26d1a3f212b6f5c9b9235 contains task.run with correlation, task and revision identity
- [x] resource-and-isolation-policy: memory/cpu/PID/network/read-only policy assertions pass

All exact-revision, cross-profile verdict, timeout, trace identity, redaction, and resource policy checks passed.
