#!/bin/zsh

set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/db-common.sh"

ensure_dirs

if [[ ! -d "$PGDATA_DIR/base" ]]; then
  echo "Database cluster is not initialized. Run npm run db:init first." >&2
  exit 1
fi

if is_running; then
  echo "PostgreSQL is already running on port $PGPORT."
  exit 0
fi

"$PG_CTL_BIN" -D "$PGDATA_DIR" -l "$PGLOG_FILE" -o "-p $PGPORT -k $PGSOCKET_DIR" start

echo "PostgreSQL started on port $PGPORT."
