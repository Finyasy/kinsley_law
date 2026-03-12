#!/bin/bash

set -euo pipefail

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required." >&2
  exit 1
fi

echo "Starting local PostgreSQL if needed..."
npm run db:start

echo "Starting Next.js development server on http://localhost:3000 ..."
exec npm run dev
