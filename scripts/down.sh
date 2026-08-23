#!/usr/bin/env bash
set -Eeuo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)"
QUESTION_BRAIN="$ROOT/fluent-question-brain"
TASK_RUNTIME="$ROOT/fluent-task-runtime"
LAB="$ROOT/fluent-engineering-lab"

compose_question_brain=(docker compose --project-name fluent-question-brain --file "$QUESTION_BRAIN/deploy/compose/compose.yaml")
compose_task_runtime=(docker compose --project-name fluent-task-runtime --file "$TASK_RUNTIME/deploy/compose/compose.yaml")

echo 'Stopping Fluent Interview service stacks (volumes preserved)'

if [[ -f "$ROOT/.workspace/fluent-lab.pid" ]]; then
  app_pid="$(cat "$ROOT/.workspace/fluent-lab.pid" 2>/dev/null || true)"
  app_command="$(ps -p "$app_pid" -o command= 2>/dev/null || true)"
  if [[ "$app_command" == *"$LAB"* ]]; then
    kill -TERM "$app_pid" 2>/dev/null || true
    for _ in 1 2 3 4 5; do
      ps -p "$app_pid" >/dev/null 2>&1 || break
      sleep 1
    done
  fi
  rm -f "$ROOT/.workspace/fluent-lab.pid"
fi

if [[ -f "$LAB/.fel/local-production/state.json" ]] && command -v pnpm >/dev/null 2>&1; then
  pnpm --dir "$LAB" package:local:stop || true
fi

"${compose_question_brain[@]}" stop
"${compose_task_runtime[@]}" stop

docker compose --project-name fluent-engineering-lab \
  --file "$ROOT/fluent-engineering-lab/docker-compose.yml" \
  stop postgres redis 2>/dev/null || true

echo 'Stopped. Durable volumes were not deleted.'
