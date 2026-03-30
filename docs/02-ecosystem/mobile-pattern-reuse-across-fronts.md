# Mobile Pattern Reuse Across Fronts

## Purpose

This document records which mobile interaction patterns being developed in Echo should later be considered reusable across the ecosystem.

It exists to support growth without forcing Pulse or Lumen to copy Echo's music-specific shell.

## Core Rule

Reuse the pattern, not the exact product surface.

Echo is music-first.

Pulse and Lumen should inherit proven mobile rhythms only where they truly fit.

## Reusable Patterns

### 1. Split Between Familiar And Discovery

Pattern:

- a calm `following` lane
- a broader `discover` lane

Why reusable:

- it helps return behavior
- it helps low-noise exploration
- it can work for audio, short-form and longer works

## 2. One Coherent Creator Or Artist Home

Pattern:

- one clear home for the creator
- featured item on top
- recent releases below
- event hints close to identity

Why reusable:

- users understand where the creator is now
- upcoming work becomes easier to surface

## 3. Lightweight Event Visibility

Pattern:

- `show`
- `radio`
- `drop`

surfaced quietly in the feed before the user enters the creator home

Why reusable:

- creates urgency
- increases return behavior
- avoids heavy social clutter

## 4. Slim Persistent Session Surface

Pattern:

- a slim fixed dock that preserves the active item while the user keeps exploring

Why reusable:

- music can use a player dock
- Pulse can later use an active clip dock
- Lumen can later use an active watch queue or in-progress shelf

## 5. Horizon Visibility

Pattern:

- a light strip that hints the ecosystem is bigger than the current front

Why reusable:

- raises ambition
- does not require dead tabs
- makes expansion feel intentional

## Echo-Specific Patterns

These are intentionally Echo-specific for now:

- 20-second in-feed music preview
- track-cut metadata capture by the creator
- room-specific access labeling for music content
- borrowed album behavior
- music-first launch list inside artist home

Pulse and Lumen should not inherit those blindly.

## Platform Boundary

Reusable logic should move into shared platform or cross-front service layers only when:

- at least two fronts truly need it
- the shared shape is already stable
- reusing it reduces rework instead of increasing coupling

Until then:

- Echo keeps the implementation local
- docs mark the reusable pattern

## Why This Matters

This keeps the ecosystem:

- ambitious
- clean
- low-cost at the start
- less likely to require destructive rewrites later

## Decision

Echo remains the proving ground.

Pulse and Lumen should inherit what Echo proves, not what Echo merely imagines.
