# Runtime failure matrix

- Status: **PASS**
- Generated: 2026-08-27T22:52:28.379Z
- Runtime: http://127.0.0.1:48227

The matrix submits only disposable runtime runs. It does not write Lab progress, and source is recorded as a digest.

## Cases

- [x] missing-revision-rejected: HTTP 400 revision_required for node-rate-limiter-001
- [x] pass: HTTP 200, status=pass, duration=220ms
- [x] go-pass: HTTP 200, status=pass, duration=11632ms
- [x] java-pass: HTTP 200, status=pass, duration=635ms
- [x] csharp-pass: HTTP 200, status=pass, duration=1854ms
- [x] postgres-pass: HTTP 200, status=pass, duration=714ms
- [x] test-failure: HTTP 200, status=fail, duration=210ms
- [x] compile-failure: HTTP 200, status=error, duration=208ms
- [x] timeout: HTTP 504, status=timeout, duration=n/a
- [x] trace-evidence-identity: trace 1ee1e07a22905d67947946179edd850b contains task.run with correlation, task and revision identity
- [x] resource-and-isolation-policy: memory/cpu/PID/network/read-only policy assertions pass

All exact-revision, cross-profile verdict, timeout, trace identity, redaction, and resource policy checks passed.
