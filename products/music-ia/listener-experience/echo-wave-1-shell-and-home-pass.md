# Echo Wave 1 Shell And Home Pass

## Purpose

This document records the first implementation pass of Wave 1 from the premium prompt-sequence plan.

Wave 1 covers:

- shell
- hierarchy
- home redesign

This pass does not complete Wave 1 fully.

It establishes the first stable product-facing version of that wave.

## What Changed

### 1. Bottom Shell

The mobile shell is now calmer and more premium:

- bottom navigation now sits inside a darker shared glass container
- active state is stronger without becoming loud
- navigation no longer looks like three unrelated pills

### 2. Signature Player Refinement

The fixed top player was refined again as Echo's signature object:

- darker oval glass body
- stronger cover treatment
- cleaner separation between play and expand
- improved inner glow balance
- expanded state kept intact for richer controls

### 3. Home Hierarchy

The listener home now follows a clearer rhythm:

1. `Aura agora`
2. `Estreias de hoje`
3. `Novas publicacoes`
4. `Biblioteca`
5. ecosystem horizon

This replaces the previous feeling of one long mixed stack.

### 4. Aura Cards

Aura strips now carry clearer event language:

- circle/global source
- event kind
- timing label
- audience count
- CTA label

This makes Aura feel more like a real signal surface and less like a decorative row.

### 5. Premiere Lane

The home now has a dedicated `Estreias de hoje` band.

This is still a first-pass surface built on top of the current lightweight event model.

It exists to prepare the product for the later `Estreia em Circulo` ritual.

### 6. Release Cards

Home release cards were rebalanced:

- larger cover
- stronger dark treatment
- less loose explanatory copy
- better neon-accent logic by access type
- stronger CTA visibility for preview and save

### 7. Library And Horizon

The home library and horizon strip were aligned to the same dark family:

- library tiles now feel like the same product as the player and feed
- horizon is now treated as `novidades`
- non-Echo fronts are intentionally dimmer

## Files Changed In This Pass

- `apps/echo-mobile/App.tsx`
- `apps/echo-mobile/app/index.tsx`
- `apps/echo-mobile/app/explore.tsx`
- `apps/echo-mobile/src/components/mobile-player-dock.tsx`
- `apps/echo-mobile/src/components/live-room-card.tsx`
- `apps/echo-mobile/src/components/social-release-card.tsx`
- `apps/echo-mobile/src/components/home-library-grid.tsx`
- `apps/echo-mobile/src/components/ecosystem-horizon-strip.tsx`
- `apps/echo-mobile/src/lib/mobile-social.ts`

## What This Pass Solved

- the first screen now has a stronger conceptual order
- Aura gained clearer event semantics
- the home feels closer to a premium music surface
- the player, nav and feed now belong to the same family more clearly

## What Still Remains In Wave 1

- remove more leftover explanatory text in listener-facing surfaces
- strengthen motion and continuity between slim and expanded player
- strengthen contrast and coherence on `Buscar` and `Perfil`
- refine `Aura agora` versus `Estreias de hoje` so they feel even more distinct
- reduce repeated card structure where the same block shape still appears too often

## Validation

Validated with:

- `npm run typecheck --workspace @northstar/echo-mobile`
- `npx expo export --platform android --clear`
