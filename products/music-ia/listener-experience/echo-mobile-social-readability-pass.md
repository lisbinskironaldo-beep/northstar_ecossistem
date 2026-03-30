# Echo Mobile Social Readability Pass

## Purpose

This document records the first premium readability pass over Echo mobile's social layer.

It exists to make sure the social side of Echo feels alive without turning the product into a noisy social wall.

## Why This Pass Matters

The first persisted community layer proved that local reactions, comments and reminders can work.

But without a readability pass, the app risked feeling:

- too textual
- too raw
- too close to a technical shell

This pass focuses on making the social layer:

- shorter
- calmer
- more musical
- easier to scan

## Product Changes In This Pass

### Feed Cards

Feed cards now surface social state through short chips instead of loose text lines.

That includes:

- like state
- comment count
- Echo count
- event hint note

The card keeps the release cover behavior strong while making social state easier to scan.

### Artist Home

The artist home now shows:

- compact pulse chips
- tighter reaction summary
- comment timing labels
- reminder count
- denser agenda readability

This makes the artist feel active without pushing the user into an image-heavy community mode.

### Comment Layer

Short comments now read more like lightweight music reactions than a generic social thread.

That means:

- fewer words on screen
- compact timing
- clearer rhythm between comments and reactions

## Design Rule Confirmed

Echo social should feel like:

- community around music
- quick pulse
- live heat

Not like:

- a timeline app
- a forum
- a general-purpose social network

## Cost And Robustness Rule

This pass stays cheap because it changes readability, not infrastructure.

It does not:

- add heavy media
- add backend persistence
- add new storage pressure

It only improves how already-available state is shown.

## Relation To The Ecosystem

This readability rule is useful beyond Echo:

- Pulse can later reuse compact activity chips
- Lumen can later reuse quiet event and reminder visibility

But the current exact surface remains music-first and Echo-specific.

## Decision

Echo now has a first premium social readability layer.

The next step is not more noise.

The next step is deciding which of these social signals are strong enough to justify shared backend persistence later.
