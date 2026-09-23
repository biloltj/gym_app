# Gym Admin

An admin-only web app for managing gym members and tracking monthly payments.
There is no member-facing login — staff sign in and manage everything from one
dashboard that flags who's paid, who's due soon, and who's overdue.

Built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma, and SQLite.

## Features

- Single admin login (session cookie, no third-party auth provider)
- Add / edit / delete members (name, phone, email, join date, monthly fee, status, notes)
- Record payments per member (amount, month covered, date paid, method)
- Dashboard that auto-computes each active member's payment status:
  - **Paid** — payment recorded for the current month
  - **Due soon** — due date (anchored to their join day each month) is within 5 days
  - **Overdue** — past due with no payment recorded, with months-owed count
  - **Upcoming** — not due yet this month
- Mobile-first layout, so it works well wrapped as an Android app (see below)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the env file and fill in real values:

   ```bash
   cp .env.example .env
   ```

   - `SESSION_SECRET` — any long random string (e.g. `openssl rand -hex 32`)
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD` — the login you'll seed below

3. Create the database and seed the admin account:

   ```bash
   npm run db:push
   npm run db:seed
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) — it redirects to
   `/admin/login`. Sign in with the `ADMIN_USERNAME`/`ADMIN_PASSWORD` you seeded.

## Scripts

| Command            | What it does                                   |
| ------------------ | ----------------------------------------------- |
| `npm run dev`       | Start the dev server                            |
| `npm run build`     | Production build                                |
| `npm start`         | Run the production build                        |
| `npm run db:push`   | Sync the Prisma schema to the SQLite database    |
| `npm run db:seed`   | Create/update the admin account from `.env`      |

## Deploying

This is a standard Next.js app, so it deploys to any Next.js-friendly host
(Vercel, Railway, Render, a VPS, etc.). Two things to set up on the host:

1. Environment variables: `DATABASE_URL`, `SESSION_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`.
2. A persistent volume/disk for the SQLite file if your host has an ephemeral
   filesystem (e.g. Vercel serverless does *not* persist disk writes — for
   Vercel, swap `DATABASE_URL` to a hosted Postgres/MySQL database instead and
   update `prisma/schema.prisma`'s `provider`). Railway/Render/a VPS with a
   persistent disk can keep using SQLite as-is.

After deploying, run `npm run db:push` and `npm run db:seed` against the
production database once (via the host's shell/console, or temporarily point
your local `.env` at the production `DATABASE_URL`).

## Wrapping it as an Android app (median.co)

Once the app is deployed and reachable at a public URL:

1. Create a project at [median.co](https://median.co) and point it at your
   deployed URL.
2. Because this is a plain server-rendered site (no offline/native APIs
   required), the default "website to app" wrapping works out of the box —
   no extra config needed beyond your app's URL, icon, and splash screen.
3. Build the Android app from the median.co dashboard and install/test the
   APK, or submit it to the Play Store from there.

## Project structure

- `src/app/admin/login` — login page (public)
- `src/app/admin/(protected)` — dashboard, members list, member detail —
  all require a valid session (enforced by `src/middleware.ts` and the
  layout's session check)
- `src/app/actions` — server actions for auth, members, and payments
- `src/lib/payment-status.ts` — the due/overdue calculation logic
- `prisma/schema.prisma` — data model (Admin, Member, Payment)
