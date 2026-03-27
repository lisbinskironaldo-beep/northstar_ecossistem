# Echo Seed Catalog Review Sheet

## Purpose

This sheet turns the seed catalog plan into a review tool that can actually be used during beta preparation.

Use one line per track or per candidate batch.

## Fields To Review

For each seeded track, evaluate:

- track title
- creator identity
- category fit
- audio quality floor
- save-worthiness
- duplicate risk
- beta decision

## Rating Scale

Use:

- `strong`
- `acceptable`
- `weak`

## Review Table Template

| Track | Creator | Category | Quality Floor | Save-worthiness | Duplicate Risk | Decision | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Example Track | Example Creator | Ambient | strong | acceptable | low | keep | strong first-session option |

## Current Live Baseline

The local Echo database already has a small live seed baseline from the demo and acceptance flows.

This is not enough for beta launch, but it is enough to anchor the first review pass in real data.

| Track | Creator | Category | Quality Floor | Save-worthiness | Duplicate Risk | Decision | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| City Lights Prototype | Echo Demo | Electronic / demo seed | acceptable | acceptable | low | keep | visible published seed track; suitable as an opening-catalog placeholder |
| Night Drive Signal | Echo Demo | Dark / night | acceptable | acceptable | low | reserve | currently suppressed; useful as a moderation and trust test asset, not opening feed material |
| Acceptance Track 153700 | Northstar Acceptance | Unassigned / acceptance | weak | weak | low | remove | acceptance-test artifact; should not appear in controlled beta |

## Immediate Gaps From The Live Baseline

- live visible tracks ready for the opening beta feed: `1`
- reserve tracks that can stay for operator testing: `1`
- tracks that should be removed from opening beta: `1`
- creators represented in the live seed: `2`

This confirms that the current database is useful for verification, but still far below the launch target defined in `echo-seed-catalog-plan.md`.

## Batch 01 Applied Result

After applying `echo-batch-01`, the local Echo database now contains:

- total Echo tracks: `27`
- visible opening tracks: `17`
- suppressed reserve tracks: `10`
- creators represented: `10`

Top visible feed after the batch:

| Feed Position | Track | Creator | Beta Role |
| --- | --- | --- | --- |
| 1 | Afterimage Avenue | Aurora Circuit | opening melodic hook |
| 2 | Midnight Toll | Nox Avenue | dark lane anchor |
| 3 | Warm Tape Weather | Brisa Loop | lo-fi comfort slot |
| 4 | Chrome Rush | Ferro Pulse | energy contrast |
| 5 | Paper Skyline | Vale Mono | calm instrumental balance |

This is the first seed state that is strong enough to support a serious internal beta pass.

## Decision Rules

- `keep`: allowed into opening beta catalog
- `reserve`: not opening feed, but useful backup
- `remove`: should not appear in beta

## Batch Review Goal

At the end of each review pass, answer:

- does the first screen feel alive?
- are there enough tracks worth saving?
- are the categories balanced?
- is anything obviously weak and embarrassing?
