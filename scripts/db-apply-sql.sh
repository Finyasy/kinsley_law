#!/bin/zsh

set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/db-common.sh"

if [[ ! -f "$ROOT_DIR/.env" ]]; then
  echo "Missing $ROOT_DIR/.env. Run npm run db:init first." >&2
  exit 1
fi

if (( $# > 0 )); then
  files=("$@")
else
  files=("$ROOT_DIR"/prisma/migrations/*/migration.sql)
fi

for file in "${files[@]}"; do
  "$PSQL_BIN" "$PSQL_CONNECTION_URL" -f "$file"
done

echo "SQL migrations applied."
