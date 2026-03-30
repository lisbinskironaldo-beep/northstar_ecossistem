# Echo Mobile Clean Split Experience

## Purpose

This document defines the first clean mobile shape for Echo.

The goal is to stop the app from feeling like a raw internal system and turn it into a lighter listener-first product.

## Core Rule

The mobile app should be built around listening first.

The professional path exists inside the same account, but it should not overload the listener shell.

## Mobile Top Level Shape

The mobile shell should expose only three top-level entries:

- home
- search
- profile

That keeps the surface light enough to learn in seconds.

## Home

Home must stay the cleanest screen in the product.

It should expose:

- one primary track focus
- a small action row
- large world cards
- a short rotating selection
- fixed albums or fixed picks near the bottom

Home should not look like:

- an admin panel
- a testing checklist
- a wall of blocks
- a giant category dump

## Search

Search should open worlds rather than flat technical lists.

The first worlds are:

- artists
- categories
- moments
- outside the normal catalog

This makes the product feel like exploration instead of a raw database.

## Profile

Profile is the only place where the account changes mode.

The switch lives there:

- listener
- professional

That means:

- listeners do not see upload controls during normal browsing
- the professional path remains available
- the same account can hold both roles

## Professional Mode

Professional mode is not a place for listening.

It is a focused workspace for:

- plan selection
- terms acceptance
- creator setup
- track upload
- release classification

This keeps the listener path lighter and protects future cost and complexity.

## Professional Upload Flow

The first clean upload flow should collect:

- track name
- artist display name
- source tool
- category
- access room
- intended moment
- language
- lyrics or no lyrics
- creator quality self-rating
- whether it already launched elsewhere
- cover format note
- audio file note
- ten-second preview mark
- release window

## Language Rule

The mobile product should default to Portuguese-first for the current build phase.

Future language switching can be added later, but the current shell should not stay half-English and half-Portuguese.

## Noise Rule

The mobile product should reduce:

- testing copy
- setup copy
- long diagnostics in the main surface
- duplicate controls
- listener-facing admin language

Debug or setup information should stay secondary and never dominate the first screen.

## Ecosystem Rule

This shape must stay compatible with the bigger ecosystem:

- Echo uses the light listener-first mobile shell now
- Pulse can later inherit the same clean shell logic
- Lumen can later inherit the same account and professional mode split

The creator workspace remains ecosystem-ready even when the current mobile surface is Echo-only.
