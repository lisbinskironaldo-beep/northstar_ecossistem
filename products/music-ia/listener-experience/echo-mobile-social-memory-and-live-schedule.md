# Echo Mobile Social Memory And Live Schedule

## Purpose

This document records the first persistent lightweight social layer for Echo mobile.

The goal is not to turn Echo into a heavy social network.

The goal is to make the app feel alive through:

- music reactions
- short comments
- Echo emojis
- light live scheduling

## What Is Implemented

Echo mobile now has a local persistent community state layer based on app storage.

That layer currently keeps:

- liked tracks
- Echo emoji reactions per track
- short comments per track
- reminder toggles for live or release timeline items
- creator-side live plans

## Why This Layer Matters

Without persistence:

- reactions feel fake
- artist homes feel decorative
- live scheduling feels like placeholder copy

With persistence:

- the artist home has memory
- reactions survive navigation
- creator live plans can surface back in the listener path

## Product Shape

### Listener side

The artist home now supports:

- like
- Echo emoji
- short comment
- reminder on live or release moments

This keeps Echo social through music behavior, not through image clutter.

### Creator side

The creator workspace now supports:

- lightweight live scheduling
- radio/show/drop modes
- a small active agenda list per creator persona

This keeps the live layer:

- visible
- cheap
- operationally light

## Robustness Rule

This social layer is intentionally isolated from:

- feed ordering
- core content reads
- upload logic

It lives as a separate mobile community-state layer so it can later:

- move to backend persistence
- sync with real users
- stay optional in listener surfaces

without forcing a rewrite of the mobile shell.

## Current Storage Shape

The current state is local-only and development-safe.

That means:

- good for internal product shaping
- good for flow validation
- not yet the final multi-user backend model

## Next Build Order

1. move the strongest social signals into backend-ready models later
2. turn live schedule from local memory into shared artist state
3. connect schedule visibility back into feed ranking and event visibility
4. keep the layer light and audio-first
