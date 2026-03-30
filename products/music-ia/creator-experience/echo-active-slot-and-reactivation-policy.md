# Echo Active Slot And Reactivation Policy

## Purpose

This document defines how Echo should limit creator volume without looking weak or hostile.

The goal is:

- protect cost
- protect discovery quality
- avoid spam
- still let creators build real catalogs

## Core Rule

Do not limit creativity first.

Limit active circulation first.

That means:

- creators can keep work
- creators can upload beyond the active limit
- but only a controlled set of tracks should stay active at the same time

## Recommended Policy

### Free Account

Use:

- `1` creator workspace
- up to `3` artist personas stored in the account
- only `1` artist active at a time
- up to `6` active tracks at a time
- up to `18` dormant tracks across the account

This creates a total free catalog ceiling of:

- `24` tracks per account

That is much healthier for a self-sufficient early product than allowing `36` tracks per artist for free.

## Why This Recommendation Is Better

If free users get:

- `3` artists
- `36` tracks per artist

then one free account could hold:

- `108` tracks

For a very early ecosystem, that is generous enough to create:

- storage growth
- moderation growth
- catalog clutter
- weak quality pressure

For Echo at this stage, that is too generous.

## Recommended Upgrade Direction

### Paid Creator Tier Later

Allow:

- up to `2` active artists in the first paid tier
- up to `36` active tracks per artist
- larger dormant capacity
- more reactivation freedom

This is the first meaningful premium jump because it increases:

- visible presence
- publishing flexibility
- active catalog power

## Reactivation Rule

Dormant tracks should be reactivatable.

But reactivation should not be infinite or chaotic.

Recommended controls:

- cooldown before reactivation
- limit on frequent reactivation loops
- track must replace another active slot if the limit is full

## Product Framing Rule

Never present this as:

- lack of capacity
- small project weakness
- hard punishment

Present it as:

- active catalog management
- release slots
- cleaner discovery
- stronger launch focus for each track

## Product Copy Direction

Good framing:

- each artist has a limited active catalog
- dormant releases remain محفوظ and can return later
- activating a new release may require putting another release to sleep

Bad framing:

- you uploaded too much
- the system cannot support your music
- we are too small for your catalog

## Final Recommendation

For the current stage of Echo:

- `6` active tracks is a better free limit for the first self-sufficient phase
- `1` active artist in free is a good limit
- `3` artist personas stored is acceptable
- `24` total tracks per free account is a healthier free ceiling
- `108` total tracks per free account is too generous right now

This keeps Echo open enough for creators, but disciplined enough to survive.

## Current Built State

The current Echo web preview now reflects this policy through:

- visible account-level workspace limits
- visible active-artist count
- visible active-track count
- visible cold-track and dormant-track counts
- first-pass release map for the selected persona

This is still a product-facing read model, not yet full slot-management automation.
