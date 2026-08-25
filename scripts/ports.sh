#!/usr/bin/env bash
set -Eeuo pipefail
ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
source "$ROOT/scripts/workspace-contract.sh"

# Host-facing ports owned by the workspace. Container-internal ports stay
# standard; only these loopback/publication ports need collision protection.
ports=(
  "$WS_LAB_DEV_API_PORT" "$WS_LAB_DEV_WEB_PORT"
  "$WS_QB_API_PORT" "$WS_QB_CMS_PORT" "$WS_RUNTIME_API_PORT"
  "$WS_LAB_PACKAGE_WEB_PORT" "$WS_LAB_PACKAGE_API_PORT" "$WS_LAB_POSTGRES_PORT" "$WS_LAB_REDIS_PORT" "$WS_GRAFANA_PORT" "$WS_PROMETHEUS_PORT" "$WS_LOKI_PORT" "$WS_KAFKA_PORT"
  "$WS_OTLP_GRPC_PORT" "$WS_OTLP_HTTP_PORT" "$WS_QB_POSTGRES_PORT" "$WS_TRACE_UI_PORT"
)

declare -A seen=()
for port in "${ports[@]}"; do
  if [[ -n "${seen[$port]:-}" ]]; then
    echo "Duplicate workspace host port: $port" >&2
    exit 1
  fi
  seen[$port]=1
done

printf 'Host port registry: %d unique dedicated ports (no standard app binds)\n' "${#ports[@]}"
printf '  Lab dev      web %s · API %s\n' "$WS_LAB_DEV_WEB_PORT" "$WS_LAB_DEV_API_PORT"
printf '  Lab package  web %s · API %s · Postgres %s · Redis %s\n' "$WS_LAB_PACKAGE_WEB_PORT" "$WS_LAB_PACKAGE_API_PORT" "$WS_LAB_POSTGRES_PORT" "$WS_LAB_REDIS_PORT"
printf '  Lab telemetry Grafana %s · Prometheus %s · Loki %s · Kafka %s\n' "$WS_GRAFANA_PORT" "$WS_PROMETHEUS_PORT" "$WS_LOKI_PORT" "$WS_KAFKA_PORT"
printf '  Question Brain API %s · CMS %s · Postgres %s\n' "$WS_QB_API_PORT" "$WS_QB_CMS_PORT" "$WS_QB_POSTGRES_PORT"
printf '  Shared Trace Explorer %s · OTLP %s/%s\n' "$WS_TRACE_UI_PORT" "$WS_OTLP_GRPC_PORT" "$WS_OTLP_HTTP_PORT"
printf '  Task Runtime API %s · traces via the shared explorer\n' "$WS_RUNTIME_API_PORT"
