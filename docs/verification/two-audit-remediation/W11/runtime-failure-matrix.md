# Runtime failure matrix

- Status: **PASS**
- Generated: 2026-08-27T22:16:46.704Z
- Runtime: http://127.0.0.1:48227

The matrix submits only disposable runtime runs. It does not write Lab progress, and source is recorded as a digest.

## Cases

- [x] missing-revision-rejected: HTTP 400 revision_required for node-rate-limiter-001
- [x] pass: HTTP 200, status=pass, duration=296ms
- [x] go-pass: HTTP 200, status=pass, duration=11578ms
- [x] java-pass: HTTP 200, status=pass, duration=647ms
- [x] csharp-pass: HTTP 200, status=pass, duration=1886ms
- [x] postgres-pass: HTTP 200, status=pass, duration=711ms
- [x] test-failure: HTTP 200, status=fail, duration=209ms
- [x] compile-failure: HTTP 200, status=error, duration=197ms
- [x] timeout: HTTP 504, status=timeout, duration=n/a
- [x] trace-evidence-identity: trace 7960d4c6b87be2361415db14599da4c4 contains task.run with correlation, task and revision identity
- [x] resource-and-isolation-policy: memory/cpu/PID/network/read-only policy assertions pass

All exact-revision, cross-profile verdict, timeout, trace identity, redaction, and resource policy checks passed.
