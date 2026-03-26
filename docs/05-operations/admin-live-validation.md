# Admin Live Validation

## Purpose

This document defines the reproducible live validation path for the Northstar Admin against seeded local PostgreSQL data.

It exists so another operator or Codex can prove that the admin pages are not only compiling, but also rendering live trust and analytics data from the API.

## Preconditions

- local PostgreSQL is running
- `.env` points to the live local database
- Prisma schema has been pushed
- Echo demo seed has already been executed
- the API is responding on `NORTHSTAR_API_BASE_URL`

## Command

```powershell
cmd /c npm run verify:admin:live
```

## What The Script Verifies

1. API health is reachable
2. Admin server starts locally on `http://localhost:3002`
3. `/` renders the main admin dashboard
4. `/reports` renders the reports queue
5. `/alerts` renders the alerts surface
6. `/actions` renders the moderation surface
7. the admin dashboard includes a live analytics event from the API
8. the actions page includes the latest moderation action and target from the API

## Expected Result

- all four admin routes return success
- the home page renders `Northstar Admin`
- the reports page renders `Reports Queue`
- the alerts page renders `Alerts`
- the actions page renders `Moderation`
- at least one live moderation action from the seeded verification flow is visible in the admin HTML
- at least one live analytics event from the seeded verification flow is visible in the admin HTML

## Latest Confirmed Result

Validated successfully on `2026-03-26` against live local PostgreSQL data.

Confirmed in the same pass:

- admin build completed successfully
- `/`, `/reports`, `/alerts` and `/actions` all rendered locally
- the admin home reflected a live analytics event from the verification flow
- the actions page reflected the latest live moderation action and target
