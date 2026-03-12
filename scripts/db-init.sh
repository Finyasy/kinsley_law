#!/bin/zsh

set -euo pipefail

source "$(cd "$(dirname "$0")" && pwd)/db-common.sh"

ensure_dirs

if [[ ! -d "$PGDATA_DIR/base" ]]; then
  "$INITDB_BIN" -D "$PGDATA_DIR" --auth=trust --username="$PGUSER"
fi

if ! is_running; then
  "$PG_CTL_BIN" -D "$PGDATA_DIR" -l "$PGLOG_FILE" -o "-p $PGPORT -k $PGSOCKET_DIR" start
fi

if ! "$PG_ISREADY_BIN" -h "$PGSOCKET_DIR" -p "$PGPORT" >/dev/null 2>&1; then
  echo "PostgreSQL did not become ready." >&2
  exit 1
fi

if ! "$PSQL_BIN" -h "$PGSOCKET_DIR" -p "$PGPORT" -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$PGDATABASE'" | grep -q 1; then
  "$CREATEDB_BIN" -h "$PGSOCKET_DIR" -p "$PGPORT" "$PGDATABASE"
fi

admin_password_line=""
if [[ -f "$ROOT_DIR/.env" ]]; then
  existing_admin_password="$(sed -n 's/^ADMIN_DASHBOARD_PASSWORD=//p' "$ROOT_DIR/.env" | head -n 1)"

  if [[ -n "$existing_admin_password" ]]; then
    admin_password_line=$'\n'"ADMIN_DASHBOARD_PASSWORD=$existing_admin_password"
  fi
fi

cat > "$ROOT_DIR/.env" <<EOF
DATABASE_URL="$CONNECTION_URL"$admin_password_line
EOF

echo "Database ready."
echo "DATABASE_URL written to $ROOT_DIR/.env"
