# Echo Session Carryover Model

## Purpose

This document defines how Echo should remember taste across sessions without turning into a rigid or noisy recommendation system.

## Core Rule

Echo should not restart from zero after every session.

It should carry forward:

- strong positive signals
- strong negative signals
- repeated short-session rejection
- reduced lanes

## What Counts As Strong Rejection

Echo should treat these as stronger than a simple skip:

- hide track
- mute artist
- hide style
- repeated short sessions on the same track
- repeated short sessions around the same artist
- repeated short sessions around the same category

## Repeated Skip Logic

The system should not overreact to one short listen.

Recommended progression:

1. one short listen
   - light reduction
2. two short listens on the same track
   - heavy reduction for that track
3. three short listens around the same artist
   - reduce that artist line
4. three short listens around the same category
   - reduce that lane across the next sessions

## Carryover Rule

Carryover should be visible in product behavior, not exposed as a settings maze.

That means:

- the feed should look cleaner next time
- the same rejected line should not rebound too quickly
- saved and replayed lines should still have room to come back

## Recovery Rule

Carryover should soften when the listener starts accepting the same line again.

Examples:

- medium play reduces negative memory a little
- full play reduces negative memory more
- save or follow can neutralize an older rejection pattern over time

## Product Meaning

This makes Echo feel:

- less repetitive
- less stubborn
- more respectful of listener intent

## Current Built State

The current Echo web preview now has:

- local carryover memory
- repeated short-session counts by track
- repeated short-session counts by creator
- repeated short-session counts by category
- score penalties that keep rejected lines colder across reloads

## Future Extension

This same carryover model should later feed:

- mobile listener experience
- Pulse session memory
- Lumen session memory
- creator-facing release feedback
