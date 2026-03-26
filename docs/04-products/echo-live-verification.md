# Echo Live Verification

## Purpose

This document defines the first live end-to-end verification path for Echo once local PostgreSQL and the API are running.

It is meant to validate Echo, trust and admin in one pass.

## Preconditions

- local PostgreSQL is running
- Prisma schema has been pushed
- API is running on `NORTHSTAR_API_BASE_URL`
- demo identities have been created with:

```powershell
cmd /c npm run seed:echo:demo
```

- `.env` contains:

```env
EXPO_PUBLIC_DEMO_USER_ID="..."
EXPO_PUBLIC_DEMO_CREATOR_ID="..."
```

## Dry Run

To validate the script shape without touching live data:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/verification/run-echo-demo-flow.ps1 -DryRun
```

## Full Verification

```powershell
cmd /c npm run verify:echo:demo
```

## Latest Confirmed Result

Validated successfully on `2026-03-26` against live local PostgreSQL 16 with:

- API health responding on `http://localhost:3001`
- seeded demo user and creator identities
- live save, playback, follow, report and moderation calls
- recent trust and analytics reads returning live data

## What The Script Verifies

1. API health
2. Echo track listing
3. track save flow
4. track playback flow
5. creator follow flow
6. trust report creation
7. moderation action creation
8. admin-facing trust and analytics reads

## Expected Result

- at least one Echo track exists
- save call succeeds
- playback call succeeds
- follow call succeeds
- report is created
- moderation action is created
- linked report leaves the open queue
- analytics recent events include Echo interaction events

## After Verification

Check these surfaces:

- `apps/admin-web`
- `apps/echo-mobile`
- `GET /trust/reports/open`
- `GET /trust/moderation-actions/recent`
- `GET /analytics/events/recent`

If any of these fail, update:

- `docs/00-master/execution-tracker.md`
- `docs/00-master/project-handoff-status.md`
- `workspace/planning/phase-2-build-notes.md`
