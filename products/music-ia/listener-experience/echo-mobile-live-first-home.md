# Echo Mobile Live-First Home

## Purpose

This document records the mobile home shift from a feed-first shell to a live-first shell.

It exists because the listener should arrive into motion and sound, not into a wall of social updates.

## Core Decision

Echo mobile home should now behave like this:

1. fixed slim player remains pinned near the top
2. the live-audio layer gets its own Echo name: `Aura`
3. `Aura` becomes the first listener surface
3. friend and discovery updates move into a second layer
4. the update layer stays capped and does not recycle already-seen items in the same session

The main navigation moves to the bottom of the screen.

## Why This Is Better

The listener opening the app should feel:

- there is something happening now
- I can hear people now
- my chosen track is still preserved

The listener should not feel:

- I opened a social dashboard
- I need to read everything first
- my current music selection got replaced by browsing

## Home Structure

### Top

- top shell with three main entries
- fixed slim player directly below it

### Main First Surface

- `Aura` live carousel
- followed creators first
- if none are live, pull a small global set
- hard cap of five live cards at once
- live cards should feel like slim horizontal story strips, not large feed cards
- tapping a live strip should expand the live room inline inside the same home surface

### Second Surface

- updates from friends or discovery
- twenty items at a time
- explicit refresh to advance the batch
- seen items do not return in the same listener session

## Product Rule

Live-first does not mean loud.

The home should stay:

- clean
- audio-first
- fast to scan

## Current Implementation Shape

Echo mobile now includes:

- a live carousel
- a dedicated live-room surface
- hidden-in-second-layer update batches
- a refresh rule for moving past the current batch

## Ecosystem Rule

This pattern is promising for the ecosystem because:

- Echo can be live-first around music and radio
- Pulse can later adapt the same idea around clips or real-time drops
- Lumen can later adapt it around premieres and watch sessions

But the current exact shell remains Echo-specific.

## Decision

The listener home is no longer feed-first.

It is now:

- player-preserving
- `Aura`-first
- updates-second
- bottom-nav based

That is closer to the intended premium direction.
