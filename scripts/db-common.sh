#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DB_ROOT="$ROOT_DIR/.postgres"
PGDATA_DIR="$DB_ROOT/data"
PGSOCKET_DIR="$DB_ROOT/socket"
PGLOG_FILE="$DB_ROOT/postgres.log"
PGPORT="${PGPORT:-54329}"
PGDATABASE="${PGDATABASE:-kinsley_law_next}"
PGUSER="${PGUSER:-$USER}"
export PGUSER

if [[ -n "${PG_BIN_DIR:-}" ]]; then
  BIN_DIR="$PG_BIN_DIR"
elif [[ -d "/opt/homebrew/Cellar/postgresql@15/15.12_1/bin" ]]; then
  BIN_DIR="/opt/homebrew/Cellar/postgresql@15/15.12_1/bin"
else
  echo "PostgreSQL binaries not found. Set PG_BIN_DIR to a valid bin directory." >&2
  exit 1
fi

INITDB_BIN="$BIN_DIR/initdb"
PG_CTL_BIN="$BIN_DIR/pg_ctl"
CREATEDB_BIN="$BIN_DIR/createdb"
PSQL_BIN="$BIN_DIR/psql"
PG_ISREADY_BIN="$BIN_DIR/pg_isready"

CONNECTION_URL="postgresql://${PGUSER}@localhost:${PGPORT}/${PGDATABASE}?schema=public"
PSQL_CONNECTION_URL="postgresql://${PGUSER}@localhost:${PGPORT}/${PGDATABASE}?sslmode=disable"

ensure_dirs() {
  mkdir -p "$DB_ROOT" "$PGSOCKET_DIR"
}

is_running() {
  "$PG_ISREADY_BIN" -h "localhost" -p "$PGPORT" >/dev/null 2>&1
}
