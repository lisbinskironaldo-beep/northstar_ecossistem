# Echo Creator Cohort Tracker

## Purpose

This file tracks the first creator cohort for the Echo beta.

It should be updated as soon as creator candidates are identified.

## Fields

Track each creator with:

- display name
- handle
- source
- status
- invite sent
- accepted
- intake bar
- first upload done
- second upload done
- week-01 pulse
- feedback given
- return likelihood

## Status Labels

Use:

- `candidate`
- `invited`
- `accepted`
- `onboarded`
- `inactive`
- `hold`

## Tracker Table

| Creator | Handle | Source | Status | Invite Sent | Accepted | Intake Bar | First Upload | Second Upload | Week-01 Pulse | Feedback | Return Likelihood | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Example Creator | @example | community | candidate | no | no | not started | no | no | pending | pending | unknown | waiting for invite |

## Current Live Cohort Baseline

These entries reflect creators already present in the local Echo environment.

They are not yet a real external beta cohort, but they provide the initial baseline for onboarding and operator review.

| Creator | Handle | Source | Status | Invite Sent | Accepted | Intake Bar | First Upload | Second Upload | Week-01 Pulse | Feedback | Return Likelihood | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Echo Demo | @echo-demo | internal demo seed | onboarded | yes | yes | complete | yes | yes | ready | internal only | medium | current house creator used for feed, save, follow and moderation validation |
| Creator Setup Smoke | @creator_a9e5334d | API smoke test | accepted | yes | yes | partial | no | no | weak | internal only | low | useful to validate creator setup; still needs first real upload before onboarding |
| Aurora Circuit | @aurora-circuit | internal seed batch | onboarded | yes | yes | complete | yes | yes | ready | pending | medium | melodic electronic opener for batch 01 |
| Nox Avenue | @nox-avenue | internal seed batch | onboarded | yes | yes | complete | yes | yes | ready | pending | medium | dark lane anchor for batch 01 |
| Brisa Loop | @brisa-loop | internal seed batch | onboarded | yes | yes | complete | yes | yes | ready | pending | medium | lo-fi comfort lane for batch 01 |
| Ferro Pulse | @ferro-pulse | internal seed batch | onboarded | yes | yes | complete | yes | yes | ready | pending | medium | higher-energy contrast creator |
| Vale Mono | @vale-mono | internal seed batch | onboarded | yes | yes | complete | yes | yes | ready | pending | medium | instrumental balance creator |
| Prisma Motel | @prisma-motel | internal seed batch | onboarded | yes | yes | complete | yes | yes | ready | pending | medium | accessible pop-adjacent creator |
| Sombra Atlas | @sombra-atlas | internal seed batch | onboarded | yes | yes | complete | yes | yes | ready | pending | medium | cinematic darker prestige hint |
| Lume Delta | @lume-delta | internal seed batch | onboarded | yes | yes | complete | yes | yes | ready | pending | medium | experimental but digestible edge creator |

## First External Cohort Target

The first real beta cohort should add at least:

- `5` externally sourced creators in `accepted` or `onboarded`
- `3` creators with a first upload completed
- `2` creators with a second upload completed

Until that threshold is met, the cohort should still be treated as internal preparation rather than public beta readiness.

## Wave 01 External Slate

These are the planned external slots for the first outreach wave.

Replace placeholders with real handles and links as soon as candidates are identified.

| Creator | Handle | Source | Status | Invite Sent | Accepted | Intake Bar | First Upload | Second Upload | Week-01 Pulse | Feedback | Return Likelihood | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DARKWAVE FREQUENCIES | @DarkwaveFrequencies | public shortlist / SoundCloud + YouTube | candidate | no | no | not started | no | no | pending | pending | high | priority A; recent public activity visible; strongest dark lane fit |
| AGV Music | AGV Music | public shortlist / Apple Music + creator note | candidate | no | no | not started | no | no | pending | pending | high | priority A; reflective creator voice and repeated releases |
| Dizzo AI Music | @DizzoAIMusic | public shortlist / Reddit community thread | candidate | no | no | not started | no | no | pending | pending | medium | priority B; promising but still needs one stronger current public check |
| Zero Yard Range | @ZeroYardRange | public shortlist / Reddit community thread | candidate | no | no | not started | no | no | pending | pending | medium | priority B; good genre diversity and backlog signal |
| Vibe Central Channel | @vibecentralchannel | public shortlist / Reddit community thread | hold | no | no | not started | no | no | pending | pending | low | hold until current public verification is stronger |
| ECHOSYNC with AI | @ECHOSYNCwithAI | public shortlist / Reddit community thread | hold | no | no | not started | no | no | pending | pending | low | hold; name fit was interesting but public verification is too noisy |
| King Willonius | King Willonius | public shortlist / official site | hold | no | no | not started | no | no | pending | pending | low | important benchmark but likely too large for Wave 01 learning goals |
| ImOliver | @imoliver | public shortlist / Suno profile | hold | no | no | not started | no | no | pending | pending | low | benchmark creator, probably too advanced for early beta learning |
| Wave 01 Reserve 03 | pending | coherent experimental creator | candidate | no | no | not started | no | no | pending | pending | unknown | reserve slot still open for edge-of-feed testing |
| Wave 01 Reserve 04 | pending | fast iterative hobbyist | candidate | no | no | not started | no | no | pending | pending | unknown | reserve slot still open for repeat-upload behavior |

## Review Rule

The first cohort is healthy when:

- enough creators accept quickly
- most finish setup without rescue
- some return for a second upload

If most creators stall at the same step, that is a product problem, not a people problem.

## Intake Rule

Before moving a creator from `accepted` to `onboarded`, verify:

- active persona selected
- basic bio present
- at least `1` active main-room track
- at least `2` tracks in the workspace
- the creator understands the active versus sleeping catalog rule
