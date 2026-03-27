# Echo Seed Batch 01

## Purpose

This file defines the first real seed batch prepared for the Echo controlled beta.

It is the first catalog lot that goes beyond smoke-test content and starts shaping the opening product feel.

## Batch Summary

- batch id: `echo-batch-01`
- creators: `8`
- total tracks: `24`
- opening tracks: `16`
- reserve tracks: `8`
- target categories covered:
  - `electronic`
  - `ambient`
  - `dark`
  - `lo-fi`
  - `trap`
  - `instrumental`
  - `pop-ia`
  - `experimental`

## Why This Batch Exists

This batch is designed to fix three weak points in the current live seed:

- too few creators
- too few clearly save-worthy tracks
- too much of the feed identity resting on internal test artifacts

## Creator Mix

| Creator | Handle | Role In Feed |
| --- | --- | --- |
| Aurora Circuit | `@aurora-circuit` | melodic opener and broad accessibility |
| Nox Avenue | `@nox-avenue` | dark lane and night identity |
| Brisa Loop | `@brisa-loop` | lo-fi repeat-listen lane |
| Ferro Pulse | `@ferro-pulse` | higher-energy contrast |
| Vale Mono | `@vale-mono` | calm instrumental depth |
| Prisma Motel | `@prisma-motel` | pop-adjacent accessibility |
| Sombra Atlas | `@sombra-atlas` | cinematic darker prestige hint |
| Lume Delta | `@lume-delta` | experimental edge without chaos |

## Opening Feed Intent

The first feed pass should feel:

- alive
- varied
- understandable
- a little surprising
- not overloaded with novelty for novelty's sake

The first 8 ranks intentionally balance:

- 1 melodic electronic opener
- 1 dark mood cut
- 1 lo-fi comfort track
- 1 sharper high-energy contrast
- 1 instrumental calmer piece
- 1 pop-adjacent accessible option
- 1 cinematic darker identity piece
- 1 experimental but digestible track

## Reserve Intent

Reserve tracks exist for:

- refreshing the opening feed after weak performers are identified
- preventing the opening set from feeling overexposed during beta
- widening the catalog without immediately increasing visible noise

## Source Of Truth

The executable source of truth for this batch is:

- [echo-batch-01.json](/c:/dev/northstar_ecosystem/scripts/seed/manifests/echo-batch-01.json)

The batch can be applied with:

```powershell
cmd /c npm run seed:echo:batch-01
```

## Applied Local Result

This batch has already been applied successfully to the local PostgreSQL environment.

Observed result after application:

- created users: `8`
- created creators: `8`
- created tracks: `24`
- Echo totals after apply:
  - users: `10`
  - creators: `10`
  - tracks: `27`
  - visible opening tracks: `17`
  - suppressed reserve tracks: `10`

That means the local Echo environment is no longer running only on smoke-test content.

It now has the first real internal beta catalog layer.
