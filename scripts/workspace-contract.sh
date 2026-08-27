#!/usr/bin/env bash
set -Eeuo pipefail

# Load one machine-readable workspace contract for all launch/status helpers.
# Ruby's YAML parser is part of macOS; the values are shell-escaped before
# export so a contract edit cannot turn into command injection.
WORKSPACE_CONTRACT_ROOT="${ROOT:-$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)}"

if [[ "${1:-}" == "check" ]]; then
  bundle="${WORKSPACE_CONTRACT_ROOT}/docs/contracts/capability-mastery-bundle.v1.fixture.json"
  test -s "${bundle}"
  jq -e '.contractVersion == "capability-mastery-bundle.v1"' "${bundle}" >/dev/null
  canonical_digest="$(jq -S -c . "${bundle}" | shasum -a 256 | awk '{print $1}')"
  for copy in \
    "${WORKSPACE_CONTRACT_ROOT}/fluent-engineering-lab/docs/contracts/capability-mastery-bundle.v1.fixture.json" \
    "${WORKSPACE_CONTRACT_ROOT}/fluent-question-brain/docs/contracts/capability-mastery-bundle.v1.fixture.json" \
    "${WORKSPACE_CONTRACT_ROOT}/fluent-task-runtime/docs/contracts/capability-mastery-bundle.v1.fixture.json"; do
    test -s "${copy}"
    copy_digest="$(jq -S -c . "${copy}" | shasum -a 256 | awk '{print $1}')"
    test "${copy_digest}" = "${canonical_digest}"
  done
  printf 'workspace contract: capability-mastery-bundle.v1 copies match %s\n' "${canonical_digest}"
  exit 0
fi

eval "$(ruby -ryaml -rshellwords -e '
  path = ARGV.fetch(0)
  doc = YAML.load_file(path)
  services = doc.fetch("services")
  service = ->(id) { services.find { |entry| entry.fetch("id") == id } }
  qb = service.call("question-brain")
  rt = service.call("task-runtime")
  lab = service.call("fluent-lab")
  ports = doc.fetch("ports")
  obs = doc.fetch("observability")
  values = {
    WS_QB_READY_URL: qb.fetch("readiness"),
    WS_QB_API_URL: "http://127.0.0.1:#{ports.fetch("questionBrain").fetch("api")}",
    WS_QB_CMS_URL: qb.fetch("ui"),
    WS_RUNTIME_READY_URL: rt.fetch("readiness"),
    WS_RUNTIME_API_URL: "http://127.0.0.1:#{ports.fetch("taskRuntime").fetch("api")}",
    WS_LAB_DEV_URL: lab.fetch("devUrl"),
    WS_LAB_DEV_API_URL: "http://127.0.0.1:#{ports.fetch("fluentLab").fetch("devApi")}",
    WS_LAB_PACKAGE_URL: lab.fetch("productionUrl"),
    WS_LAB_PACKAGE_API_URL: "http://127.0.0.1:#{ports.fetch("fluentLab").fetch("packageApi")}",
    WS_TRACE_URL: obs.fetch("traceExplorerUrl"),
    WS_TRACE_UI_PORT: ports.fetch("questionBrain").fetch("traceExplorerUi"),
    WS_OTLP_GRPC_PORT: obs.fetch("collector").fetch("otlpGrpc"),
    WS_OTLP_HTTP_PORT: obs.fetch("collector").fetch("otlpHttp"),
    WS_GRAFANA_URL: "http://localhost:#{ports.fetch("fluentLab").fetch("grafana")}",
    WS_QB_API_PORT: ports.fetch("questionBrain").fetch("api"),
    WS_QB_CMS_PORT: ports.fetch("questionBrain").fetch("cms"),
    WS_QB_POSTGRES_PORT: ports.fetch("questionBrain").fetch("postgres"),
    WS_RUNTIME_API_PORT: ports.fetch("taskRuntime").fetch("api"),
    WS_LAB_DEV_API_PORT: ports.fetch("fluentLab").fetch("devApi"),
    WS_LAB_DEV_WEB_PORT: ports.fetch("fluentLab").fetch("devWeb"),
    WS_LAB_PACKAGE_WEB_PORT: ports.fetch("fluentLab").fetch("packageWeb"),
    WS_LAB_PACKAGE_API_PORT: ports.fetch("fluentLab").fetch("packageApi"),
    WS_LAB_POSTGRES_PORT: ports.fetch("fluentLab").fetch("postgres"),
    WS_LAB_REDIS_PORT: ports.fetch("fluentLab").fetch("redis"),
    WS_GRAFANA_PORT: ports.fetch("fluentLab").fetch("grafana"),
    WS_PROMETHEUS_PORT: ports.fetch("fluentLab").fetch("prometheus"),
    WS_LOKI_PORT: ports.fetch("fluentLab").fetch("loki"),
    WS_KAFKA_PORT: ports.fetch("fluentLab").fetch("kafka")
  }
  values.each { |key, value| puts "export #{key}=#{Shellwords.escape(value.to_s)}" }
' "$WORKSPACE_CONTRACT_ROOT/workspace.yaml")"
