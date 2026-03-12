#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

"$ROOT_DIR/scripts/db-init.sh"
"$ROOT_DIR/scripts/db-apply-sql.sh"
npm run prisma:generate
npm run prisma:seed

echo "Local database bootstrap complete."
