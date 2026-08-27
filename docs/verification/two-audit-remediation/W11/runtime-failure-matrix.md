# Runtime failure matrix

- Status: **PASS**
- Generated: 2026-08-27T21:23:02.559Z
- Runtime: http://127.0.0.1:48227

The matrix submits only disposable runtime runs. It does not write Lab progress, and source is recorded as a digest.

## Cases

- [x] missing-revision-rejected: HTTP 400 revision_required for node-rate-limiter-001
- [x] pass: HTTP 200, status=pass, duration=201ms
- [x] go-pass: HTTP 200, status=pass, duration=11524ms
- [x] java-pass: HTTP 200, status=pass, duration=673ms
- [x] csharp-pass: HTTP 200, status=pass, duration=1817ms
- [x] postgres-pass: HTTP 200, status=pass, duration=679ms
- [x] test-failure: HTTP 200, status=fail, duration=199ms
- [x] compile-failure: HTTP 200, status=error, duration=191ms
- [x] timeout: HTTP 504, status=timeout, duration=n/a
- [x] trace-evidence-identity: trace 877975ed69035878ca38004ea761394e contains task.run with correlation, task and revision identity
- [x] resource-and-isolation-policy: memory/cpu/PID/network/read-only policy assertions pass

All exact-revision, cross-profile verdict, timeout, trace identity, redaction, and resource policy checks passed.
