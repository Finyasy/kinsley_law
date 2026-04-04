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

Create the first admin user before opening `/admin`:

```bash
npm run admin:create -- --email "admin@kinsleylaw.com" --name "Kinsley Admin" --password "replace-with-a-long-password"
```

Admin access is now database-backed:

- named users instead of a shared environment password
- persistent sessions stored in PostgreSQL
- per-user sign-in with email and password

## Email notifications

New contact enquiries and consultation requests can notify an internal inbox.

SMTP delivery:

```bash
NOTIFICATION_TO_EMAILS="intake@kinsleylaw.com"
SMTP_FROM_EMAIL="notifications@kinsleylaw.com"
SMTP_FROM_NAME="Kinsley Law Intake"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="smtp-user"
SMTP_PASS="smtp-password"
```

Local preview mode without SMTP:

```bash
NOTIFICATION_TO_EMAILS="intake@kinsleylaw.com"
SMTP_FROM_EMAIL="notifications@kinsleylaw.com"
EMAIL_PREVIEW_DIR=".email-previews"
```

When preview mode is enabled, each notification is written as a JSON payload
under `.email-previews/` instead of being sent over SMTP.

## Production deployment

Set these values in production:

```bash
DATABASE_URL="postgresql://pooled-connection-for-runtime"
MIGRATION_DATABASE_URL="postgresql://direct-connection-for-prisma-migrations"
NEXT_PUBLIC_SITE_URL="https://www.kinsleylaw.com"
NOTIFICATION_TO_EMAILS="intake@kinsleylaw.com"
SMTP_FROM_EMAIL="notifications@kinsleylaw.com"
SMTP_FROM_NAME="Kinsley Law Intake"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="smtp-user"
SMTP_PASS="smtp-password"
```

Production hardening now includes:

- security response headers from `next.config.ts`
- dynamic `robots.txt` and `sitemap.xml`
- `GET /api/health` for deploy and uptime checks
- no-index handling for `/admin`
- app-level `not-found` and `error` boundaries
- no-store cache headers on API routes that should never be cached

For Neon and other managed Postgres providers, keep runtime traffic and Prisma
migrations on separate connection strings:

- `DATABASE_URL`: the pooled/runtime connection used by the app server
- `MIGRATION_DATABASE_URL`: the direct/non-pooled connection used by
  `prisma migrate deploy`

If you run migrations during Vercel builds, point `MIGRATION_DATABASE_URL` at
the provider's direct connection string. Using a pooled URL for migrations can
cause advisory lock timeouts during deploy.

## Admin workflow

The admin portal is organized into focused work areas:

- `Overview` for migration health, counts, and settings
- `Inbox` for message and consultation workflow
- `Content`, `Attorneys`, `Practice Areas`, and `Testimonials` for publishing

Contacts and consultation requests now support internal workflow fields:

- `status`
- `assignedTo`
- `internalNotes`

Attorney profiles now accept either a direct `Photo URL` or a local image
upload. Local uploads are written to `public/uploads/attorneys/` and are
ignored by Git so they can be managed as runtime content.

## Admin authentication

`/admin` now uses real user accounts stored in PostgreSQL:

- create or rotate an account with `npm run admin:create`
- sign in with the configured email and password
- sessions are stored in the `AdminSession` table and expire automatically

Example:

```bash
npm run admin:create -- --email "admin@kinsleylaw.com" --name "Kinsley Admin" --password "replace-with-a-long-password"
```

Running the command again with the same email updates the password, keeps the
user active, and clears old sessions for that account.

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

1. Add role-aware authorization and an admin user management screen inside `/admin`.
2. Add direct content reordering drag/drop UX inside `/admin` instead of numeric ordering fields.
3. Move local attorney uploads to durable object storage if you do not plan to self-host the app on a persistent filesystem.
