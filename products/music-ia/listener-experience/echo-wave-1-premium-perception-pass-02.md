# Echo Wave 1 Premium Perception Pass 02

## Purpose

This document records the second implementation pass inside Wave 1 of the premium prompt-sequence plan.

While the first Wave 1 pass focused on:

- shell
- home hierarchy
- Aura semantics

this second pass focused on:

- cross-screen dark consistency
- contrast cleanup
- residual light-surface removal
- stronger artist-stage perception

## What Changed

### 1. Search Screen

`Buscar` now belongs to the same dark-cinematic family as the home:

- dark search field
- darker result cards
- darker idle state
- darker back control
- stronger title/caption hierarchy

This removes the feeling that search belonged to an earlier prototype layer.

### 2. Explore Tiles

Search entry tiles now use the same dark premium family:

- darker bodies
- stronger contrast
- more consistent border treatment
- better alignment with listener home and bottom shell

### 3. Profile Screen

`Perfil` now aligns better with the premium shell:

- dark mode switch
- dark listener pulse card
- dark profile metrics
- darker utility rail
- darker creator plan cards
- darker plan summary and manager toggles

This removes one of the biggest remaining “theme split” issues in the mobile app.

### 4. Artist Home

The artist profile now reads more like a stage within the same product:

- back action aligned to dark shell
- featured-release area now dark
- launch list now dark
- reactions area now dark
- agenda area now dark
- comment inputs and rows now dark
- action pills on artist surfaces now lean dark instead of floating in a lighter style

### 5. Shared Token Support

`TinyStatus` now supports dark usage explicitly.

This matters because signals, counters and micro summaries are used inside dark premium surfaces and must remain legible.

## Files Changed In This Pass

- `apps/echo-mobile/src/components/mobile-ui.tsx`
- `apps/echo-mobile/src/components/explore-mini-tile.tsx`
- `apps/echo-mobile/app/explore.tsx`
- `apps/echo-mobile/app/profile.tsx`
- `apps/echo-mobile/src/components/artist-profile-panel.tsx`

## What This Pass Solved

- reduced the feeling of mixed visual eras
- improved readability on dark surfaces
- made `Buscar` and `Perfil` feel less like utility screens and more like product screens
- made the artist page feel more coherent with the rest of Echo

## What Still Remains In Wave 1

- reduce more residual explanatory copy in listener surfaces
- strengthen motion between mini player, home and artist entry
- refine the visual distinction between `Aura agora` and `Estreias de hoje`
- reduce same-shape repetition across cards where possible

## Validation

Validated with:

- `npm run typecheck --workspace @northstar/echo-mobile`
- `npx expo export --platform android --clear`
