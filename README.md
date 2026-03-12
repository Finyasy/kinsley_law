# Kinsley Law Advocates

This repository now runs as a single Next.js + TypeScript application at the
repo root.

## Stack

- Next.js 16 App Router
- React 19
- TypeScript 5.9
- Prisma 7
- PostgreSQL

## What is included

- public pages:
  - `/`
  - `/about`
  - `/services`
  - `/contact`
- internal admin dashboard:
  - `/admin`
- Route Handlers for:
  - `GET /api/attorneys`
  - `GET /api/attorneys/:id`
  - `GET /api/practice-areas`
  - `GET /api/practice-areas/:id`
  - `POST /api/contacts`
  - `POST /api/appointments`
  - `POST /api/admin/session`
  - `DELETE /api/admin/session`

## Runtime

Use Node `24.14.0`.

```bash
nvm use
```

## Database setup

The repo includes a workspace-local PostgreSQL setup.

Fast path:

```bash
npm run db:bootstrap
```

Manual path:

```bash
npm run db:init
npm run db:apply
npm run prisma:generate
npm run prisma:seed
```

Set a local admin password in `.env` to unlock `/admin`:

```bash
ADMIN_DASHBOARD_PASSWORD="replace-with-a-strong-local-password"
```

## Run locally

```bash
nvm use
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm run dev` uses webpack on purpose. Turbopack is available as an opt-in:

```bash
npm run dev:turbo
```

## Validate

```bash
npm run lint
npm run prisma:generate
npm run build -- --webpack
```

## Legacy apps

The old split apps were retired from the root and archived under:

- `legacy/react-frontend`
- `legacy/rails-backend`

The previous combined React/Rails startup script is archived at:

- `legacy/start-app-react-rails.sh`

## Notes

Prisma 7 is installed and the runtime is working. On this machine, Prisma's
schema engine is still unreliable for `migrate dev`, so the local bootstrap
path applies the checked-in SQL migrations via `psql` and then keeps Prisma
migration history in sync.

## Next steps

1. Add create/update actions inside `/admin` for attorneys, practice areas, testimonials, and site settings.
2. Replace placeholder imagery with real firm assets.
3. Remove the temporary `next-app/` stub after any stale dev process using it is fully gone.
