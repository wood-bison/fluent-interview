#!/usr/bin/env bash
set -u

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
QUESTION_BRAIN="$ROOT/fluent-question-brain"
TASK_RUNTIME="$ROOT/fluent-task-runtime"
LAB="$ROOT/fluent-engineering-lab"
source "$ROOT/scripts/workspace-contract.sh"

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
for repo in fluent-engineering-lab fluent-engineering-vue fluent-question-brain fluent-task-runtime; do
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
docker compose --project-name fluent-question-brain --file "$QUESTION_BRAIN/deploy/compose/compose.yaml" ps 2>/dev/null || true
docker compose --project-name fluent-task-runtime --file "$TASK_RUNTIME/deploy/compose/compose.yaml" ps 2>/dev/null || true
docker compose --project-name fluent-engineering-lab \
  --file "$LAB/docker-compose.yml" \
  --profile broker \
  --profile observability \
  ps 2>/dev/null || true

echo
echo 'Readiness:'
question_brain_status="$(http_status "$WS_QB_READY_URL")"
task_runtime_status="$(http_status "$WS_RUNTIME_READY_URL")"
lab_dev_status="$(http_status "$WS_LAB_DEV_URL")"
lab_package_status="$(http_status "$WS_LAB_PACKAGE_URL")"
if [[ "$lab_package_status" == 'offline' && "$lab_dev_status" != 'offline' ]]; then
  lab_package_status='not started (dev mode)'
fi
printf '  Question Brain  %s  %s\n' "$question_brain_status" "$WS_QB_READY_URL"
printf '  Task Runtime    %s  %s\n' "$task_runtime_status" "$WS_RUNTIME_READY_URL"
printf '  Fluent Lab web  %s  %s\n' "$lab_dev_status" "$WS_LAB_DEV_URL"
printf '  Lab package     %s  %s\n' "$lab_package_status" "$WS_LAB_PACKAGE_URL"

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
