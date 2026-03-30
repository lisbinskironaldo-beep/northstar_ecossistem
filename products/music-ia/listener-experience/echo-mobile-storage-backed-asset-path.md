# Echo Mobile Storage-Backed Asset Path

## Purpose

This document records how Echo mobile moves from local sample media toward creator-backed or storage-backed assets without redesigning playback.

It exists to keep the product realistic now while protecting the future path.

## Current State

Echo mobile already has:

- real playback foundation
- feed preview behavior
- fixed full-track player
- local sample media served by the API

That was the correct first step.

Now the product also has:

- separate `audio_stream` and `audio_preview` roles in practice
- seed coverage for both roles
- API decoration that can serve local media or direct remote URLs

## Why This Matters

The product should not stay forever tied to local sample files.

But it also should not jump straight into heavy upload infrastructure before:

- the listener experience feels strong
- creator behavior is proven
- the team is ready for storage and moderation cost

## Current Asset Roles

### `audio_stream`

Purpose:

- full-track playback
- fixed player dock
- artist-home full listening

### `audio_preview`

Purpose:

- feed-only preview
- short discovery clip
- cheaper and more controlled playback behavior

## Current API Behavior

The API now decorates assets like this:

- local assets become `/media/...`
- remote assets can already pass through as direct URLs

That means the mobile app does not need a redesign when storage moves from:

- `local_static`

to:

- `remote_url`
- later cloud-backed storage such as `cloudflare_r2`

## Current Seed Behavior

The second Echo seed batch now backfills:

- stream assets
- preview assets

That gives the mobile app a more realistic playback model for internal testing.

## Migration Path

### Step 1

Use local sample assets for internal validation.

Status:

- complete

### Step 2

Keep the mobile app consuming asset roles instead of assuming one audio file does everything.

Status:

- complete

### Step 3

Allow the API to expose either local media paths or direct remote URLs without changing the player contract.

Status:

- complete

### Step 4

Later connect creator-uploaded assets or storage-backed assets to the same contract.

Status:

- next

## Cost Rule

This path keeps the product lean because:

- local samples prove playback cheaply
- preview clips can stay shorter than full tracks
- the app can later read remote storage without changing the player surface

## Relation To The Wider Ecosystem

This pattern is reusable:

- Echo uses `audio_preview` and `audio_stream`
- Pulse can later use `clip_preview` and `full_clip`
- Lumen can later use `teaser` and `full_media`

The exact media types differ.

The contract pattern stays useful.

## Decision

Echo mobile is no longer locked to fake shell playback.

It now has a clean path from:

- local sample validation

to:

- creator-backed or storage-backed real media

without throwing away the current player model.
