# Next.js Full-Stack Migration Path

Status on March 12, 2026:

- the Next.js + Prisma + PostgreSQL application has been promoted to the repo root
- the old split apps are archived under `legacy/react-frontend` and `legacy/rails-backend`
- this document remains as the migration record and file-mapping reference

This document defines the exact migration path for moving this repository from:

- `frontend/`: Create React App + React Router
- `backend/`: Ruby on Rails API

to:

- a single Next.js full-stack application with:
  - App Router
  - server-rendered/public pages
  - Route Handlers for backend APIs
  - one database layer shared by the app

The goal is to preserve the current site structure and content, improve the implementation, and remove the split frontend/backend setup.

## 1. Migration Goals

The new application should keep these user-facing sections:

- Home
- About
- Services
- Contact

The new application should keep these business entities:

- attorneys
- practice areas
- contacts
- appointments

The new application should improve these areas:

- one codebase instead of two
- SSR/SEO for public marketing pages
- real form submission instead of console logging
- clearer data flow between UI and backend
- simpler deployment
- consistent docs and startup flow

## 2. Recommended Target Stack

Use the following target stack:

- Next.js 15+ with App Router
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod for request validation
- CSS Modules or Tailwind
- optional: React Hook Form for forms
- optional: Resend or Nodemailer for email notifications

Why this stack:

- Next.js replaces both the existing frontend app and API server
- Prisma maps cleanly to the current Rails models
- PostgreSQL preserves the relational structure already implied by Rails
- Zod gives explicit request validation at the API layer

## 3. Current App Inventory

## Frontend pages

- `frontend/src/pages/Home.js`
- `frontend/src/pages/About.js`
- `frontend/src/pages/Services.js`
- `frontend/src/pages/Contact.js`

## Frontend shared components

- `frontend/src/components/Navbar.js`
- `frontend/src/components/Footer.js`
- `frontend/src/components/ValueAnimation.js`

## Rails API endpoints

- `GET /api/v1/attorneys`
- `GET /api/v1/attorneys/:id`
- `GET /api/v1/practice_areas`
- `GET /api/v1/practice_areas/:id`
- `POST /api/v1/appointments`
- `POST /api/v1/contacts`

## Rails models

- `Attorney`
- `PracticeArea`
- `Appointment`
- `Contact`

## Important current-state notes

- The public website is mostly static.
- The contact form does not submit to the backend yet.
- The frontend already includes API helpers, but they are not wired into the pages.
- The Rails backend contains the real persistence layer and seed data.

## 4. Migration Strategy

Use a phased migration, not a big-bang rewrite.

Recommended order:

1. Create the new Next.js app alongside the current code.
2. Port static pages and shared layout first.
3. Port the data model and seed data.
4. Rebuild API endpoints in Next.js.
5. Wire forms to the new APIs.
6. Validate parity with the existing content and behavior.
7. Remove the old React and Rails apps only after cutover.

This reduces risk and makes rollback possible at each stage.

## 5. Target Repository Structure

Recommended final structure:

```text
kinsley_law/
  app/
    page.tsx
    about/page.tsx
    services/page.tsx
    contact/page.tsx
    api/
      attorneys/route.ts
      attorneys/[id]/route.ts
      practice-areas/route.ts
      practice-areas/[id]/route.ts
      contacts/route.ts
      appointments/route.ts
  components/
    layout/
      navbar.tsx
      footer.tsx
    home/
      value-animation.tsx
  lib/
    db.ts
    validations/
      contact.ts
      appointment.ts
  prisma/
    schema.prisma
    seed.ts
  public/
    images/
  styles/
  package.json
  next.config.ts
  tsconfig.json
```

## 6. File-by-File Mapping

Map the current frontend files into the new app like this:

| Current file | New file |
| --- | --- |
| `frontend/src/App.js` | `app/layout.tsx` and route files under `app/` |
| `frontend/src/index.js` | not needed in Next.js |
| `frontend/src/pages/Home.js` | `app/page.tsx` |
| `frontend/src/pages/About.js` | `app/about/page.tsx` |
| `frontend/src/pages/Services.js` | `app/services/page.tsx` |
| `frontend/src/pages/Contact.js` | `app/contact/page.tsx` |
| `frontend/src/components/Navbar.js` | `components/layout/navbar.tsx` |
| `frontend/src/components/Footer.js` | `components/layout/footer.tsx` |
| `frontend/src/components/ValueAnimation.js` | `components/home/value-animation.tsx` |
| `frontend/src/services/api.js` | `lib/api` helpers or direct `fetch` calls to `/api/...` |

Map the Rails backend into Next.js like this:

| Current file | New file |
| --- | --- |
| `backend/app/controllers/api/v1/attorneys_controller.rb` | `app/api/attorneys/route.ts` and `app/api/attorneys/[id]/route.ts` |
| `backend/app/controllers/api/v1/practice_areas_controller.rb` | `app/api/practice-areas/route.ts` and `app/api/practice-areas/[id]/route.ts` |
| `backend/app/controllers/api/v1/contacts_controller.rb` | `app/api/contacts/route.ts` |
| `backend/app/controllers/api/v1/appointments_controller.rb` | `app/api/appointments/route.ts` |
| `backend/app/models/*.rb` | `prisma/schema.prisma` |
| `backend/db/seeds.rb` | `prisma/seed.ts` |

## 7. Database Migration Plan

Use PostgreSQL in the Next.js app.

### Proposed Prisma schema

Recommended initial model set:

- `Attorney`
  - `id`
  - `name`
  - `email`
  - `phone`
  - `bio`
  - `position`
  - `specialization`
  - `photoUrl` optional
  - timestamps

- `PracticeArea`
  - `id`
  - `name`
  - `description`
  - `attorneyId` optional
  - timestamps

- `Contact`
  - `id`
  - `name`
  - `email`
  - `phone` optional
  - `service`
  - `message`
  - timestamps

- `Appointment`
  - `id`
  - `name`
  - `email`
  - `phone`
  - `date`
  - `time`
  - `practiceArea`
  - `description`
  - `attorneyId`
  - timestamps

### Data migration options

Choose one of these approaches:

1. Re-seed from the Rails seed content.
2. Export from the Rails database and import into PostgreSQL for Next.js.

For this repo, re-seeding is the cleanest choice because:

- the current dataset is small
- the app appears to be in an early stage
- seed content already exists in `backend/db/seeds.rb`

### Data migration steps

1. Translate `backend/db/seeds.rb` into `prisma/seed.ts`.
2. Keep the same attorney and practice area content.
3. Normalize naming where useful:
   - `practice_area` in Rails appointment data becomes `practiceArea` in Prisma
4. Run `prisma migrate dev`.
5. Run `prisma db seed`.

## 8. API Migration Plan

Recreate the Rails API in Next.js Route Handlers.

### Endpoint mapping

| Rails endpoint | Next.js endpoint |
| --- | --- |
| `/api/v1/attorneys` | `/api/attorneys` |
| `/api/v1/attorneys/:id` | `/api/attorneys/[id]` |
| `/api/v1/practice_areas` | `/api/practice-areas` |
| `/api/v1/practice_areas/:id` | `/api/practice-areas/[id]` |
| `/api/v1/contacts` | `/api/contacts` |
| `/api/v1/appointments` | `/api/appointments` |

### API implementation rules

- Use `GET` for attorneys and practice areas.
- Use `POST` for contacts and appointments.
- Validate all POST payloads with Zod.
- Return explicit `400`/`422` style validation errors.
- Preserve response shapes only where it helps migration.
- Remove the `/v1` prefix unless versioning is required immediately.

### Example improvements over the current Rails API

- structured validation errors
- typed responses
- better form error handling on the frontend
- optional spam protection on contact submission

## 9. Frontend Migration Plan

### Step 1: Create the Next.js app

Create a new branch for the migration:

```bash
git checkout -b codex/nextjs-migration
```

Initialize Next.js at the repo root or in a temporary sibling folder.

Recommended approach for this repo:

- keep the current `frontend/` and `backend/` folders untouched during migration
- create the new app in `next-app/` first
- after validation, move it to the repo root or promote it as the main app

This avoids disrupting the current working setup while the migration is in progress.
That approach was used here, and the cutover is now complete.

### Step 2: Port layout and routing

Rebuild:

- shared header
- shared footer
- main page routes

Implementation notes:

- Next.js App Router replaces React Router
- route segments replace `<Routes>` and `<Route>`
- shared layout belongs in `app/layout.tsx`

### Step 3: Port static content exactly

For the first pass, preserve:

- page headings
- body copy
- CTA labels
- service lists
- team-member content

Do not redesign and rewrite content at the same time. First achieve parity, then improve visuals and UX.

### Step 4: Replace placeholders with better implementations

Improve these areas during the port:

- replace placeholder image blocks with real images where available
- convert the contact CTA on Services into a real link to `/contact`
- use `next/image` for logos and firm images
- improve mobile navigation behavior
- keep the animated value component as a client component

### Step 5: Rebuild forms

The contact page should stop using console logging and instead:

1. validate user input in the browser
2. submit to `/api/contacts`
3. show loading, success, and error states
4. reset only after successful submission

Add an appointment form either:

- on the contact page
- or on a dedicated `/appointments` page

The current backend supports appointments, so the Next.js version should expose that feature in the UI instead of leaving it hidden.

## 10. Content Preservation Rules

To maintain structure and content:

- keep the four current top-level pages
- keep the current attorney names and bios unless the business content is changing
- keep the current service categories
- preserve the current tone of voice on the first pass

Allowed improvements:

- clearer hierarchy and spacing
- better responsive behavior
- stronger accessibility
- real image handling
- proper data-backed forms
- SEO metadata per page

## 11. Recommended Improvements During Migration

These improvements should be included while moving to Next.js.

### Public pages

- add page metadata for SEO
- add semantic sections and heading order
- improve internal CTA linking
- remove dead buttons and placeholder blocks

### Forms

- real submission to the backend
- server-side validation
- inline error messages
- success states instead of `alert()`
- honeypot or rate limiting for spam resistance

### Backend

- centralize validation schemas
- use a single Prisma client instance
- log API failures cleanly
- optionally send email notifications for contact and appointment creation

### Developer experience

- one README
- one `.env.example`
- one startup command
- one deployment target

## 12. Exact Phase Plan

## Phase 0: Preparation

Deliverables:

- create migration branch
- freeze content changes during migration
- inventory current assets and copy
- choose Next.js + Prisma + PostgreSQL

Exit criteria:

- architecture choice is locked
- migration branch exists

## Phase 1: Scaffold the new app

Deliverables:

- initialize Next.js with TypeScript
- configure linting and formatting
- add Prisma and PostgreSQL config
- add environment variables

Exit criteria:

- app runs locally
- database connects successfully

## Phase 2: Rebuild static pages

Deliverables:

- `app/page.tsx`
- `app/about/page.tsx`
- `app/services/page.tsx`
- `app/contact/page.tsx`
- shared layout components

Exit criteria:

- all four pages render in Next.js
- content parity with the current frontend is complete

## Phase 3: Port data model and seed data

Deliverables:

- `prisma/schema.prisma`
- `prisma/seed.ts`
- migrated attorney and practice area records

Exit criteria:

- local database contains all seed records
- data can be queried from Prisma

## Phase 4: Rebuild API endpoints

Deliverables:

- `/api/attorneys`
- `/api/attorneys/[id]`
- `/api/practice-areas`
- `/api/practice-areas/[id]`
- `/api/contacts`
- `/api/appointments`

Exit criteria:

- all endpoints return the expected payloads
- validation failures return clear error responses

## Phase 5: Connect the UI to the new APIs

Deliverables:

- about page uses attorney data
- services page can use practice area data
- contact form persists records
- appointment flow persists records

Exit criteria:

- no console-only form behavior remains
- data is stored in PostgreSQL through Next.js

## Phase 6: QA and parity review

Deliverables:

- route-by-route review
- form submission testing
- responsive review
- metadata review

Exit criteria:

- content parity is confirmed
- major UX regressions are resolved

## Phase 7: Cutover

Deliverables:

- root README updated
- start scripts updated
- old apps archived or removed

Exit criteria:

- Next.js app is the default app
- old React and Rails apps are no longer required for local development

## 13. Suggested Implementation Order Inside Next.js

Build in this order:

1. root layout
2. navbar
3. footer
4. home page
5. about page
6. services page
7. contact page
8. Prisma schema
9. seed script
10. read endpoints
11. write endpoints
12. form wiring
13. metadata and polish

This order gives visible progress early while still converging on the full-stack migration.

## 14. Risks and How to Avoid Them

## Risk: redesign and migration happen at the same time

Impact:

- harder to verify parity
- more regressions

Mitigation:

- first ship parity
- then apply design improvements in a second pass

## Risk: losing backend validation behavior

Impact:

- forms may submit incomplete or invalid data

Mitigation:

- implement shared Zod schemas before wiring forms

## Risk: migrating data and schema inconsistently

Impact:

- broken forms and mismatched records

Mitigation:

- define Prisma schema first
- seed from a single source of truth

## Risk: changing URLs or structure unnecessarily

Impact:

- SEO regressions
- stakeholder confusion

Mitigation:

- keep the current route structure intact
- use redirects only when intentionally adding new routes

## 15. Cutover Decision

At the end of the migration, choose one of these:

### Option A: Replace the repo root with Next.js

Use this if:

- the Rails app is fully retired
- no team members still depend on the old split architecture

### Option B: Keep legacy apps during a short transition

Use this if:

- stakeholders want a fallback period
- the deployment process needs staged cutover

Recommended for this repo:

- use Option B during development
- use Option A once parity and deployment are confirmed

## 16. Definition of Done

The migration is complete when:

- Next.js serves the public website
- PostgreSQL stores attorneys, practice areas, contacts, and appointments
- the contact form persists records successfully
- the appointment flow is visible and persists records successfully
- the old React app is no longer needed
- the old Rails API is no longer needed
- local development uses one app and one startup command

## 17. Immediate Next Steps

The migration implementation steps were completed in this order:

1. scaffolded a new Next.js TypeScript app in `next-app/`
2. added Prisma and PostgreSQL
3. ported the public pages with content parity and improved UI
4. rebuilt the API endpoints in Next.js
5. wired contact and appointment forms to persistence
6. added admin visibility for intake and migrated content
7. promoted the Next.js app to the repo root
8. archived the legacy React and Rails apps under `legacy/`

The practical next step is no longer scaffolding. It is expanding `/admin`
into a full content-management workflow.
