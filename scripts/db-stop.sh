#!/bin/zsh

set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/db-common.sh"

if [[ ! -d "$PGDATA_DIR/base" ]]; then
  echo "Database cluster is not initialized."
  exit 0
fi

if ! is_running; then
  echo "PostgreSQL is not running."
  exit 0
fi

"$PG_CTL_BIN" -D "$PGDATA_DIR" stop

echo "PostgreSQL stopped."
