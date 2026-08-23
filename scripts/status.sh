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
printf '  Question Brain  %s  http://127.0.0.1:48127/health/ready\n' "$(http_status 'http://127.0.0.1:48127/health/ready')"
printf '  Task Runtime    %s  http://127.0.0.1:48227/v1/health/ready\n' "$(http_status 'http://127.0.0.1:48227/v1/health/ready')"
printf '  Fluent Lab web  %s  http://localhost:47300/\n' "$(http_status 'http://localhost:47300/')"
printf '  Lab package     %s  http://localhost:49300/onboarding\n' "$(http_status 'http://localhost:49300/onboarding')"

echo
echo 'Observability:'
printf '  Question Brain Jaeger  %s  http://localhost:56686\n' "$(http_status 'http://localhost:56686')"
printf '  Task Runtime Jaeger    %s  http://localhost:56687\n' "$(http_status 'http://localhost:56687')"
printf '  Lab Grafana            %s  http://localhost:49304\n' "$(http_status 'http://localhost:49304')"
