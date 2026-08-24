#!/usr/bin/env bash
set -u

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
QUESTION_BRAIN="$ROOT/fluent-question-brain"
TASK_RUNTIME="$ROOT/fluent-task-runtime"
LAB="$ROOT/fluent-engineering-lab"

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
for repo in fluent-engineering-lab fluent-question-brain fluent-task-runtime; do
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
question_brain_status="$(http_status 'http://127.0.0.1:48127/health/ready')"
task_runtime_status="$(http_status 'http://127.0.0.1:48227/v1/health/ready')"
lab_dev_status="$(http_status 'http://localhost:47300/')"
lab_package_status="$(http_status 'http://localhost:49300/onboarding')"
if [[ "$lab_package_status" == 'offline' && "$lab_dev_status" != 'offline' ]]; then
  lab_package_status='not started (dev mode)'
fi
printf '  Question Brain  %s  http://127.0.0.1:48127/health/ready\n' "$question_brain_status"
printf '  Task Runtime    %s  http://127.0.0.1:48227/v1/health/ready\n' "$task_runtime_status"
printf '  Fluent Lab web  %s  http://localhost:47300/\n' "$lab_dev_status"
printf '  Lab package     %s  http://localhost:49300/onboarding\n' "$lab_package_status"

echo
echo 'Release joins:'
printf '  Question Brain  '
curl --silent --show-error --max-time 3 'http://127.0.0.1:48127/v1/quality?workspace=fluent-interview' 2>/dev/null \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); c=d.get("checks",{}); print("{} · {} published · mapped {} · unmapped {}".format(d.get("release_id","unknown"), d.get("total",0), c.get("curriculum_mapped",0), c.get("curriculum_unmapped",0)))' \
  || echo 'unavailable'
printf '  Task Runtime    '
curl --silent --show-error --max-time 3 'http://127.0.0.1:48227/v1/tasks/summary' 2>/dev/null \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); print("{} · runtime {} · question {} · runnable {}".format(d.get("bindingState","unknown"), d.get("runtimeReleaseId","none"), d.get("questionReleaseId","none"), d.get("runnable",False)))' \
  || echo 'unavailable'

echo
echo 'Observability:'
printf '  Question Brain Jaeger  %s  http://localhost:56686\n' "$(http_status 'http://localhost:56686')"
printf '  Task Runtime Jaeger    %s  http://localhost:56687\n' "$(http_status 'http://localhost:56687')"
printf '  Lab Grafana            %s  http://localhost:49304\n' "$(http_status 'http://localhost:49304')"
