# Runtime failure matrix

- Status: **BLOCKED**
- Generated: 2026-08-27T21:20:10.959Z
- Runtime: http://127.0.0.1:48227

The matrix submits only disposable runtime runs. It does not write Lab progress, and source is recorded as a digest.

## Cases

- [x] missing-revision-rejected: HTTP 400 revision_required for node-rate-limiter-001
- [x] pass: HTTP 200, status=pass, duration=226ms
- [x] go-pass: HTTP 200, status=pass, duration=10223ms
- [x] java-pass: HTTP 200, status=pass, duration=666ms
- [x] csharp-pass: HTTP 200, status=pass, duration=2286ms
- [x] postgres-pass: HTTP 200, status=pass, duration=765ms
- [x] test-failure: HTTP 200, status=fail, duration=238ms
- [x] compile-failure: HTTP 200, status=error, duration=238ms
- [x] timeout: HTTP 504, status=timeout, duration=n/a
- [ ] trace-evidence-identity: The operation was aborted due to timeout
- [x] resource-and-isolation-policy: memory/cpu/PID/network/read-only policy assertions pass

Blocked cases: trace-evidence-identity
