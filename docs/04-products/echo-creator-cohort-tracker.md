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
- first upload done
- second upload done
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

| Creator | Handle | Source | Status | First Upload | Second Upload | Feedback | Return Likelihood | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Example Creator | @example | community | candidate | no | no | pending | unknown | waiting for invite |

## Current Live Cohort Baseline

These entries reflect creators already present in the local Echo environment.

They are not yet a real external beta cohort, but they provide the initial baseline for onboarding and operator review.

| Creator | Handle | Source | Status | First Upload | Second Upload | Feedback | Return Likelihood | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Echo Demo | @echo-demo | internal demo seed | onboarded | yes | yes | internal only | medium | current house creator used for feed, save, follow and moderation validation |
| Creator Setup Smoke | @creator_a9e5334d | API smoke test | onboarded | no | no | internal only | low | useful to validate creator setup; still needs first real upload |
| Aurora Circuit | @aurora-circuit | internal seed batch | onboarded | yes | yes | pending | medium | melodic electronic opener for batch 01 |
| Nox Avenue | @nox-avenue | internal seed batch | onboarded | yes | yes | pending | medium | dark lane anchor for batch 01 |
| Brisa Loop | @brisa-loop | internal seed batch | onboarded | yes | yes | pending | medium | lo-fi comfort lane for batch 01 |
| Ferro Pulse | @ferro-pulse | internal seed batch | onboarded | yes | yes | pending | medium | higher-energy contrast creator |
| Vale Mono | @vale-mono | internal seed batch | onboarded | yes | yes | pending | medium | instrumental balance creator |
| Prisma Motel | @prisma-motel | internal seed batch | onboarded | yes | yes | pending | medium | accessible pop-adjacent creator |
| Sombra Atlas | @sombra-atlas | internal seed batch | onboarded | yes | yes | pending | medium | cinematic darker prestige hint |
| Lume Delta | @lume-delta | internal seed batch | onboarded | yes | yes | pending | medium | experimental but digestible edge creator |

## First External Cohort Target

The first real beta cohort should add at least:

- `5` externally sourced creators in `accepted` or `onboarded`
- `3` creators with a first upload completed
- `2` creators with a second upload completed

Until that threshold is met, the cohort should still be treated as internal preparation rather than public beta readiness.

## Wave 01 External Slate

These are the planned external slots for the first outreach wave.

Replace placeholders with real handles and links as soon as candidates are identified.

| Creator | Handle | Source | Status | First Upload | Second Upload | Feedback | Return Likelihood | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DARKWAVE FREQUENCIES | @DarkwaveFrequencies | public shortlist / SoundCloud + YouTube | candidate | no | no | pending | medium | strong dark-cinematic fit; good match for the night lane |
| AGV Music | AGV Music | public shortlist / Apple Music + creator note | candidate | no | no | pending | medium | repeated releases and unusually reflective creator behavior |
| Dizzo AI Music | @DizzoAIMusic | public shortlist / Reddit community thread | candidate | no | no | pending | unknown | useful small-creator fit for general AI music outreach |
| Zero Yard Range | @ZeroYardRange | public shortlist / Reddit community thread | candidate | no | no | pending | unknown | alt-rock lane candidate; adds genre diversity |
| Vibe Central Channel | @vibecentralchannel | public shortlist / Reddit community thread | candidate | no | no | pending | unknown | reggae / vibe lane candidate; broadens feed feel |
| ECHOSYNC with AI | @ECHOSYNCwithAI | public shortlist / Reddit community thread | candidate | no | no | pending | unknown | very new AI music creator candidate with early-stage empathy value |
| King Willonius | King Willonius | public shortlist / official site | hold | no | no | pending | low | important benchmark but likely too large for Wave 01 learning goals |
| ImOliver | @imoliver | public shortlist / Suno profile | hold | no | no | pending | low | benchmark creator, probably too advanced for early beta learning |
| Wave 01 Reserve 03 | pending | coherent experimental creator | candidate | no | no | pending | unknown | reserve slot still open for edge-of-feed testing |
| Wave 01 Reserve 04 | pending | fast iterative hobbyist | candidate | no | no | pending | unknown | reserve slot still open for repeat-upload behavior |

## Review Rule

The first cohort is healthy when:

- enough creators accept quickly
- most finish setup without rescue
- some return for a second upload

If most creators stall at the same step, that is a product problem, not a people problem.
