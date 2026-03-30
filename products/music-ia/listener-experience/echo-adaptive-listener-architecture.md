# Echo Adaptive Listener Architecture

## Purpose

This document defines how Echo should adapt to the listener without turning into a noisy or over-engineered app.

The goal is:

- simple on the surface
- intelligent underneath
- fast to understand
- easy to correct when recommendations go wrong

## Core Rule

Echo should learn as much from rejection as it learns from engagement.

That means:

- saves matter
- replays matter
- follows matter
- skips matter
- explicit rejection matters even more

## The Listener Loop

Echo should treat each listener session as a living signal:

1. start with strong openers
2. observe what the listener skips
3. reduce similar tracks in the same session
4. keep variety without breaking mood
5. remember clear dislikes across sessions

## The Negative Preference Layer

This is one of the most important parts of Echo.

Every listener must have strong negative controls:

- hide this track
- less like this
- hide this artist
- hide this style
- never play this again

These should not be buried.

They should be visible and easy.

## The Exclusion Center

Echo should have a visible personal area for exclusions.

Suggested product name:

- `Hidden`
- `Muted`
- `No More`

Recommended function:

- list blocked tracks
- list blocked artists
- list blocked styles
- allow restore
- explain in simple visual form what is being filtered

This gives the user confidence that the app is adapting to them on purpose, not randomly.

## Session Adaptation

Within a single listening session, Echo should react quickly.

Examples:

- if the listener skips two dark atmospheric tracks in a row, reduce that lane immediately
- if the listener saves two calm instrumental tracks, strengthen that lane for the rest of the session
- if the listener hides one artist, stop showing that artist right away

## Long-Term Adaptation

Across multiple sessions, Echo should build a personal taste map.

The system should learn:

- preferred energy
- preferred mood
- preferred vocal/instrumental balance
- preferred density
- disliked patterns
- artists already accepted or rejected

## Current Built State

The current Echo web preview already includes:

- visible exclusion center
- local carryover memory between reloads
- repeated short-session memory
- lane reduction after repeated short-session rejection
- softer recovery when a line starts getting accepted again

## UI Rule

Most adaptation should be invisible.

Only the corrective controls should be visible.

Do not expose heavy settings screens unless needed.

The listener should feel:

- this app gets me
- I can correct it easily
- it does not trap me in one lane

## What Echo Should Never Do

- overfit after one like
- spam similar tracks too fast
- hide why the feed feels wrong
- make rejection tools hard to find
