# Echo Persistent Library Behavior

## Purpose

This document turns the Echo library from a visual concept into a persistent product behavior.

## Core Rule

The library should survive the session.

It should remember what the listener decided to keep:

- offline-ready picks
- public shelves
- borrowed shelves
- shared-room picks

## Product Logic

The library is not only a list of saves.

It is a second layer of listener intent.

That means:

- save says `I liked this`
- public shelf says `this represents me`
- borrowed shelf says `I want this influence nearby`
- shared room says `this belongs in a collective space`
- offline says `I want this available even when I am away`

## Public Shelf Rule

Saved tracks can be moved into public folders.

The current first-pass folder structure is:

- Front row
- After hours
- Soft loop

These folders should feel:

- simple
- personal
- shareable

## Borrowed Shelf Rule

Following a creator is not the same as borrowing them into the library.

Borrowed shelves should stay explicit.

The listener chooses which creators remain visible as a reference inside the library.

## Shared Rule

Shared should be lightweight at first.

The listener can mark tracks as shared-room material before any heavier collaborative model is built.

## Offline Rule

Offline remains a product state, not a raw file download.

The current web preview stores the decision state.

Real offline media caching comes later in the mobile product.

## Current Built State

The current Echo web preview now persists:

- public folder assignments
- offline-ready picks
- shared picks
- borrowed creators

These states survive reloads in the browser preview and are reused by the public library surface.

## Why This Matters

This gives Echo a stronger identity:

- discovery
- taste
- collection
- return

Not only streaming.
