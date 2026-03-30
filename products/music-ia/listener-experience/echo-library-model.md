# Echo Library Model

## Purpose

This document defines the library system for Echo.

The library should be one of the strongest parts of the product.

It should make listeners feel that music is not only consumed, but organized, shared and returned to.

## Core Rule

Echo should not have only one library.

It should have four.

## 1. Private Library

This is the listener's personal space.

Use it for:

- saved tracks
- personal folders
- offline saved music
- hidden and excluded items

Rule:

This is private by default.

## 2. Public Library

Every registered listener can choose to expose a public library in their profile.

This makes music taste itself part of the social layer.

Use it for:

- public folders
- signature collections
- visible taste identity

People should be able to:

- open another user's public library
- save a whole folder to their own library
- borrow that structure without being able to edit the original

## 3. Borrowed Library

This is where a listener keeps collections copied from another user's public library.

Rule:

- the borrowed version can be kept as reference
- the original owner remains visible
- the borrowed collection cannot alter the original

This creates lightweight social music discovery without turning Echo into a noisy social feed.

## 4. Shared Library

This is a collaborative library.

Use it for:

- friend groups
- couples
- study playlists
- mood libraries for multiple people

Rule:

- selected people can add tracks
- selected people can listen
- permission should be explicit

## Offline Rule

Echo should not offer raw download.

It should offer:

- save for offline listening

That means:

- encrypted or app-bound offline cache
- playable offline inside Echo
- not exported as loose files

## Why This Matters

Most music apps stop at:

- save
- like
- playlist

Echo can go further by making libraries feel:

- personal
- social
- collectible
- reusable

## UX Rule

The library system must stay simple on the surface.

Do not show all four layers at once.

Show:

- private
- public
- shared

Let borrowed appear as a state inside the library, not as a giant extra menu.

## Current Built State

The current Echo web preview now persists:

- public folder assignments
- offline-ready picks
- borrowed creators
- shared-room picks

This persistence currently lives in the web preview state and already feeds the public library surface.
