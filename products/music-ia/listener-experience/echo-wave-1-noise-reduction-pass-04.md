# Echo Wave 1 Noise Reduction Pass 04

## Purpose

This document records the fourth pass inside Wave 1 of the premium prompt-sequence plan.

This pass focused on:

- less repeated geometry
- less repeated helper text
- cleaner lower-home rhythm

## What Changed

### 1. Publication Cards

Normal publication cards lost one more helper line.

They now rely more on:

- title
- artist
- chips
- actions

and less on descriptive filler copy.

### 2. Premiere Cards

Premiere cards were tightened further:

- discovery label remains
- actions stay visible
- no extra explanation is needed

This keeps premieres feeling sharper and more event-like.

### 3. Library Grid

The library grid now repeats less chrome:

- removed the repeated `biblioteca` label on every tile
- added subtle internal glow accents instead
- kept the four-square structure intact

### 4. Ecosystem Horizon

The ecosystem horizon no longer reads like a second card deck.

It now behaves more like a slim ribbon lane:

- no outer glass card
- pill-like front markers
- quieter support role

This reduces repeated visual weight near the bottom of the home.

### 5. Minor Listener Copy Reduction

The home loading and lane copy continue to get shorter.

Wave 1 is now moving closer to:

- structure first
- copy second

## Files Changed In This Pass

- `apps/echo-mobile/app/index.tsx`
- `apps/echo-mobile/src/components/social-release-card.tsx`
- `apps/echo-mobile/src/components/premiere-event-card.tsx`
- `apps/echo-mobile/src/components/home-library-grid.tsx`
- `apps/echo-mobile/src/components/ecosystem-horizon-strip.tsx`

## What This Pass Solved

- less repeated block feeling near the bottom of the home
- less text noise in release surfaces
- quieter ecosystem horizon presence

## What Still Remains In Wave 1

- motion polish between mini player, Aura and artist stage
- final trimming of residual listener-facing explanatory copy
- a last consistency read across all three tabs together

## Validation

Validated with:

- `npm run typecheck --workspace @northstar/echo-mobile`
- `npx expo export --platform android --clear`
