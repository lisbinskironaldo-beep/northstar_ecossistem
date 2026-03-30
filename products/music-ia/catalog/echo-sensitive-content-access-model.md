# Echo Sensitive Content Access Model

## Purpose

This document defines how Echo should handle content that cannot live in the normal listener path.

Echo should support creative freedom without letting special or sensitive content pollute the main feed.

## Core Rule

Sensitive content is not only a category problem.

It is also an access problem.

That means Echo needs:

- creative classification
- access classification
- separated surfaces when needed
- explicit listener activation for restricted lanes

## Sensitive Access Groups

Echo should support at least these upload-time groups:

- clone or strongly inspired by an existing voice or catalog
- parody
- kids
- explicit
- restricted or censored

These groups are separate from normal mood or sound categories.

## Upload Rule

During upload, the creator must classify the release across two dimensions:

### Creative Layer

What kind of track it is in Echo terms:

- mood
- sound identity
- session role
- regular genre metadata

### Access Layer

How the track can enter listener surfaces:

- standard
- kids
- parody
- clone-inspired
- explicit
- restricted

The creator chooses this first.

Trust and safety can later review, confirm or correct it.

## Listener Rule

The normal Echo listener path should default to:

- standard content only

Other access groups should require explicit activation by the listener.

That means:

- explicit should stay off until enabled
- parody should stay outside the main feed until enabled
- clone-inspired content should stay outside the main feed until enabled
- kids should live in its own room or lane
- restricted should require explicit access behavior

## Product Structure

Echo should not solve this by dropping everything into one feed with warnings.

Instead it should use separated rooms or lanes:

- main
- kids
- parody
- clone-inspired
- explicit
- restricted

This keeps the default product clean while still supporting more creative output.

## Why This Matters

This model protects:

- listener trust
- first-session clarity
- moderation quality
- future rights management
- future ecosystem expansion

It also creates a structure that can later be reused by:

- Pulse clips
- Lumen works

## Future Cross-Front Rule

The access layer should live in platform logic, not only Echo UI logic.

That way the same access model can later govern:

- music releases in Echo
- short-form clips in Pulse
- long-form works in Lumen

## Product Rule

Sensitive content can exist.

It just should not take over the normal listener surface.
