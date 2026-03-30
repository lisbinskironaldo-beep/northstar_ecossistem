# Echo Wave 1 Home Distinction Pass 03

## Purpose

This document records the third pass inside Wave 1 of the premium prompt-sequence plan.

This pass focused on one specific problem:

- `Aura agora` and `Estreias de hoje` still felt too similar

The goal was to make those two home layers feel like different behaviors, not two copies of the same card family.

## What Changed

### 1. Premiere Cards

`Estreias de hoje` now uses a dedicated event card surface instead of reusing the normal release card.

That new surface:

- is more compact
- feels more like an event than a release shelf
- leans more violet than the regular release feed
- emphasizes `estreia`, `hoje` and event participation

This makes premieres feel like a special moment rather than a smaller copy of the publication feed.

### 2. Aura Panel

The expanded Aura panel now feels more distinct from premiere surfaces:

- stronger live labeling
- clearer room type
- cleaner dark interaction layer
- darker reaction area
- more direct actions

This helps Aura feel like live signal and not like a release card in a different place.

### 3. Listener Copy Reduction

Short listener-facing copy was tightened again on the home:

- Aura copy is shorter
- premiere copy is shorter
- publication copy is shorter
- library copy is shorter

The screen now explains itself more through structure and less through paragraphs.

### 4. Publication Cards

Normal release cards were kept as the long-form publication surface, but with one more copy reduction pass:

- shorter helper copy
- premiere lane no longer competes by using the same visual shape

## Files Changed In This Pass

- `apps/echo-mobile/app/index.tsx`
- `apps/echo-mobile/src/components/live-room-panel.tsx`
- `apps/echo-mobile/src/components/social-release-card.tsx`
- `apps/echo-mobile/src/components/premiere-event-card.tsx`

## What This Pass Solved

- home layers now have clearer identities
- `Aura agora` feels more live
- `Estreias de hoje` feels more event-like
- `Novas publicacoes` remains the normal release feed instead of competing with premieres

## What Still Remains In Wave 1

- continue reducing repeated block geometry across some surfaces
- improve motion and continuity between home, Aura and artist stage
- refine the last residual copy that still feels explanatory instead of native

## Validation

Validated with:

- `npm run typecheck --workspace @northstar/echo-mobile`
- `npx expo export --platform android --clear`
