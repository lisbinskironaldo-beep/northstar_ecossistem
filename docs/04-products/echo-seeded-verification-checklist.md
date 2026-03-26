# Echo Seeded Verification Checklist

## Purpose

This checklist exists for the first local verification loop after PostgreSQL, API and demo seed are available.

It should be used together with:

- `docs/04-products/echo-live-verification.md`
- `scripts/verification/run-echo-demo-flow.ps1`

## Preconditions

- `cmd /c npm run db:local:up`
- API running locally
- `cmd /c npm run seed:echo:demo`
- `.env` updated with:
  - `EXPO_PUBLIC_DEMO_USER_ID`
  - `EXPO_PUBLIC_DEMO_CREATOR_ID`

## Seeded Checklist

### Environment

- [ ] local PostgreSQL responds
- [ ] API `/health` responds
- [ ] `.env` contains demo user and demo creator IDs
- [ ] Echo shell starts without missing-env errors

### Echo Feed

- [ ] feed loads at least one Echo track
- [ ] save action works from feed
- [ ] playback action works from feed
- [ ] feedback message appears after save
- [ ] feedback message appears after playback

### Echo Explore

- [ ] categories load
- [ ] saved tracks list loads for the demo user
- [ ] saved track entry points to the expected creator/artist

### Echo Upload

- [ ] creator metadata loads
- [ ] category metadata loads
- [ ] demo creator is prefilled or selectable
- [ ] creator setup path creates a new user and creator profile when needed
- [ ] upload creates a new track successfully

### Echo Profile

- [ ] creators list loads
- [ ] follow action works
- [ ] followed creators list updates for the demo user

### Trust And Admin

- [ ] report creation works
- [ ] moderation action works
- [ ] linked report leaves open queue
- [ ] admin overview reflects recent activity
- [ ] admin reports queue reflects remaining open reports
- [ ] admin moderation view shows the latest action

### Analytics

- [ ] recent analytics events show user registration or creator creation when applicable
- [ ] recent analytics events show track creation
- [ ] recent analytics events show save action
- [ ] recent analytics events show playback action
- [ ] recent analytics events show follow action
- [ ] recent analytics events show report and moderation action

## Decision Gate

Echo should only be considered close to MVP shell readiness when:

- all core actions succeed locally
- the admin reflects those actions
- no blocking type/build/runtime issue appears during the loop

## If The Check Fails

Update:

- `docs/00-master/execution-tracker.md`
- `docs/00-master/project-handoff-status.md`
- `workspace/planning/phase-2-build-notes.md`

Record:

- what failed
- where it failed
- whether it was API, data, mobile shell or admin
- what the next repair step should be
