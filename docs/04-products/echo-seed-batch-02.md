# Echo Seed Batch 02

## Purpose

This file defines the second real seed batch prepared for the Echo controlled beta.

Batch 02 exists to do two things:

- make the opening catalog feel less thin
- give the separated rooms real material instead of empty placeholders

## Batch Summary

- batch id: `echo-batch-02`
- creators: `6`
- total tracks: `18`
- opening tracks: `12`
- reserve tracks: `6`
- new room coverage:
  - `kids`
  - `parody`
  - `clone_inspired`
  - `explicit`

## Why This Batch Exists

Batch 01 proved the feed could stop feeling empty.

Batch 02 is about making Echo feel more intentional:

- stronger main-feed depth
- better save and library candidates
- real separated-room coverage
- more believable creator spread
- a first internal audio layer for mobile preview and fixed-player validation

## Creator Mix

| Creator | Handle | Role |
| --- | --- | --- |
| Cinder South | `@cinder-south` | darker electronic depth |
| Opal Kite | `@opal-kite` | broader save-friendly melodic lane |
| Juniper Frames | `@juniper-frames` | instrumental and offline/library support |
| Pearl Comet | `@pearl-comet` | kids-room coverage |
| Mirror Spoof | `@mirror-spoof` | parody-room coverage |
| Ghost Vector | `@ghost-vector` | clone-inspired and explicit access testing |

## Product Effect

This batch helps three areas at once:

1. listener path
   - more variety
   - less fake emptiness
   - stronger library potential

2. creator path
   - more believable slot occupancy
   - better release-map examples

3. separated-room system
   - no longer only conceptual
   - now has real tracks behind it

4. audio validation path
   - pooled local sample assets can now be attached without recreating the seeded tracks
   - mobile preview and fixed-player logic can now be validated on top of real `ContentAsset` data

## Applied Local Result

This batch has already been applied successfully to the local PostgreSQL environment.

Observed result after application:

- created users: `6`
- created creators: `6`
- created tracks: `18`
- Echo totals after apply:
  - visible opening tracks: `25`
  - suppressed reserve tracks: `19`

The batch now also supports backfilling pooled local audio assets into those tracks on re-run.

## Verification

After applying Batch 02, the live Echo verification flow still passed successfully and used:

- `Southbound Halo`

This confirms the larger seed layer did not break the current local flow.

## Source Of Truth

The executable source of truth for this batch is:

- [echo-batch-02.json](/c:/dev/northstar_ecosystem/scripts/seed/manifests/echo-batch-02.json)

The batch can be applied with:

```powershell
cmd /c npm run seed:echo:batch-02
```
