# Echo Mobile Audio Foundation

## Purpose

This document records the first real audio foundation for Echo mobile.

The goal is not final polish yet.

The goal is to make the player and the feed preview sit on a real media layer,
so future work does not need to rewrite the mobile experience from scratch.

## What Is In Place Now

- `ContentAsset` is now exposed in Echo track reads from the API.
- local Echo seed data can now attach audio assets to tracks without recreating the tracks.
- the API now serves local media samples through `/media/...`.
- Echo mobile now has a dedicated audio-player hook instead of keeping playback rules scattered in screens.
- the mobile shell now distinguishes:
  - full-track playback in the fixed player
  - 20-second preview playback in the feed

## Why This Matters

Before this block:

- the player was mostly a product shell
- preview behavior was simulated
- track reads did not carry media information

After this block:

- the data model for audio is visible in the mobile app
- preview and full playback have distinct behavior
- the same path can later move from local media to cloud media without redesigning the player model

## Current Media Shape

For local validation only, Echo now uses a very small local static media layer:

- storage root: `services/api/public/media`
- first sample assets: `audio/echo-tone-01.wav`, `audio/echo-tone-02.wav`, `audio/echo-tone-03.wav`
- API exposure: `/media/<storageKey>`

This is only a development/testing bridge.

It is not the future distribution model.

## Current Playback Rules

### Feed preview

- the main feed stays limited to 20 recent releases
- the feed uses only a 20-second preview
- preview playback does not replace the fixed-player selection
- if the fixed player is playing and the listener starts a preview:
  - the fixed player pauses
  - the preview plays
  - the fixed player stays paused after preview ends

### Fixed player

- the fixed player keeps the selected full track visible
- the selected track can resume after feed browsing
- the selected track now lives on a dedicated audio state layer

## Mobile Implementation Boundary

The current audio layer lives in:

- `apps/echo-mobile/src/lib/echo-audio.ts`
- `apps/echo-mobile/src/lib/use-echo-audio-player.ts`

This is intentional.

It keeps:

- screen composition in `app/*`
- player behavior in `lib/*`
- product wording in component surfaces

## Seed Boundary

Seed support now accepts audio assets in two ways:

- explicit per-track assets
- pooled asset templates through `audioAssetPool`

This allows:

- fast internal beta validation
- backfilling assets into already seeded tracks
- future migration to real uploaded files or cloud storage

## What This Is Not Yet

This block does **not** mean Echo has finished mobile playback.

Still missing later:

- real creator-uploaded audio files
- real preview cut persistence from creator input
- offline save
- lock-screen controls
- headset controls
- artwork/cover delivery tied to media assets

## Next Audio Build Order

1. connect the 20-second preview cut to real stored creator-defined preview data
2. move from local sample assets to uploaded media assets
3. add stronger progress behavior in the fixed player
4. prepare offline-safe audio caching
5. add lock-screen and headset control support

## External Technical Reference

Official Expo audio playback reference used for this layer:

- Expo AV  
  https://docs.expo.dev/versions/v54.0.0/sdk/av/
