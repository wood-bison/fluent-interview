#!/usr/bin/env bash
set -uo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
QUESTION_BRAIN="$ROOT/fluent-question-brain"
TASK_RUNTIME="$ROOT/fluent-task-runtime"
LAB="$ROOT/fluent-engineering-lab"
source "$ROOT/scripts/workspace-contract.sh"
status_exit=0

http_status() {
  local url="$1"
  local status
  status="$(curl --silent --output /dev/null --write-out '%{http_code}' --max-time 3 "$url" 2>/dev/null || true)"
  [[ "$status" == '000' ]] && status='offline'
  printf '%s' "$status"
}

echo 'Fluent Interview workspace status'
echo "root: $ROOT"
echo
echo 'Repositories:'
for repo in fluent-engineering-lab fluent-engineering-vue fluent-question-brain fluent-task-runtime fluent-question-vault; do
  path="$ROOT/$repo"
  if [[ -d "$path/.git" ]]; then
    printf '  %-26s ' "$repo"
    git -C "$path" status --short --branch 2>/dev/null | head -1
  else
    echo "  $repo  MISSING"
  fi
done

echo
echo 'Compose:'
compose_ps() {
  local label="$1"
  shift
  if ! "$@" ps; then
    echo "  $label: unable to read Compose state" >&2
    status_exit=1
  fi
}
compose_ps 'Question Brain' docker compose --project-name fluent-question-brain --file "$QUESTION_BRAIN/deploy/compose/compose.yaml"
compose_ps 'Task Runtime' docker compose --project-name fluent-task-runtime --file "$TASK_RUNTIME/deploy/compose/compose.yaml"
compose_ps 'Fluent Lab' docker compose --project-name fluent-engineering-lab \
  --file "$LAB/docker-compose.yml" \
  --profile broker \
  --profile observability

echo
echo 'Readiness:'
question_brain_status="$(http_status "$WS_QB_READY_URL")"
task_runtime_status="$(http_status "$WS_RUNTIME_READY_URL")"
lab_dev_status="$(http_status "$WS_LAB_DEV_URL")"
lab_dev_api_status="$(http_status "$WS_LAB_DEV_API_URL/api/health/ready")"
lab_package_status="$(http_status "$WS_LAB_PACKAGE_URL")"
lab_package_api_status="$(http_status "$WS_LAB_PACKAGE_API_URL/api/health/ready")"
if [[ "$lab_package_status" == 'offline' && "$lab_dev_status" != 'offline' ]]; then
  lab_package_status='not started (dev mode)'
  lab_package_api_status='not started (dev mode)'
fi
printf '  Question Brain  %s  %s\n' "$question_brain_status" "$WS_QB_READY_URL"
printf '  Task Runtime    %s  %s\n' "$task_runtime_status" "$WS_RUNTIME_READY_URL"
printf '  Fluent Lab web  %s  %s\n' "$lab_dev_status" "$WS_LAB_DEV_URL"
printf '  Fluent Lab API  %s  %s/api/health/ready\n' "$lab_dev_api_status" "$WS_LAB_DEV_API_URL"
printf '  Lab package     %s  %s\n' "$lab_package_status" "$WS_LAB_PACKAGE_URL"
printf '  Package API     %s  %s/api/health/ready\n' "$lab_package_api_status" "$WS_LAB_PACKAGE_API_URL"
if [[ "$lab_dev_status" != 'offline' && "$lab_dev_api_status" != '200' ]]; then
  echo '  ERROR: development web is online but its API is not ready.' >&2
  status_exit=1
fi
if [[ "$lab_package_status" != 'offline' && "$lab_package_status" != 'not started (dev mode)' && "$lab_package_api_status" != '200' ]]; then
  echo '  ERROR: packaged web is online but its API is not ready.' >&2
  status_exit=1
fi
if [[ "$lab_dev_status" != 'offline' && "$lab_package_status" != 'offline' && "$lab_package_status" != 'not started (dev mode)' ]]; then
  echo '  CONFLICT: development and packaged Lab listeners are both online.' >&2
  echo '  Stop one mode before continuing; shared learner state must have one owner.' >&2
  status_exit=1
fi

echo
echo 'Release joins:'
printf '  Question Brain  '
curl --silent --show-error --max-time 3 "$WS_QB_API_URL/v1/quality?workspace=fluent-interview" 2>/dev/null \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); c=d.get("checks",{}); print("{} · {} published · mapped {} · unmapped {}".format(d.get("release_id","unknown"), d.get("total",0), c.get("curriculum_mapped",0), c.get("curriculum_unmapped",0)))' \
  || echo 'unavailable'
printf '  Task Runtime    '
curl --silent --show-error --max-time 3 "$WS_RUNTIME_API_URL/v1/tasks/summary" 2>/dev/null \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print("{} · runtime {} · question {} · runnable {}".format(d.get("bindingState","unknown"), d.get("runtimeReleaseId","none"), d.get("questionReleaseId","none"), d.get("runnable",False)))' \
  || echo 'unavailable'

echo
echo 'Observability:'
printf '  Shared Trace Explorer   %s  %s\n' "$(http_status "$WS_TRACE_URL")" "$WS_TRACE_URL"
printf '  Shared traces            OTLP %s/%s → Trace Explorer %s\n' "$WS_OTLP_GRPC_PORT" "$WS_OTLP_HTTP_PORT" "$WS_TRACE_UI_PORT"
printf '  Lab Grafana              %s  %s\n' "$(http_status "$WS_GRAFANA_URL")" "$WS_GRAFANA_URL"

# If an observability profile is running, Grafana is part of that profile's
# advertised contract and an offline endpoint is a real status failure. When
# the profile is not running, keep the line informational rather than making a
# normal learner-only launch fail.
if docker compose --project-name fluent-engineering-lab \
  --file "$LAB/docker-compose.yml" --profile observability ps --services --filter status=running 2>/dev/null \
  | grep -qx 'grafana'; then
  grafana_status="$(http_status "$WS_GRAFANA_URL")"
  if [[ "$grafana_status" != '200' ]]; then
    echo '  ERROR: observability profile advertises Grafana but its endpoint is not ready.' >&2
    status_exit=1
  fi
fi

exit "$status_exit"
