# Echo Listener Feed Engine

## Purpose

This file defines the first extracted feed engine for the Echo listener experience.

## Core Rule

Listener feed ordering should not live as raw logic inside the main screen forever.

The listener shell can consume the feed engine, but it should not own the whole ranking and filtering shape.

## What The Feed Engine Handles

The current Echo feed engine is responsible for:

- main-room filtering
- hidden track filtering
- muted creator filtering
- hidden category filtering
- repeated-skip penalties
- save and follow boosts
- category deprioritization
- reserve track selection
- separated-room selection

## Why This Matters

This keeps Echo safer to evolve because:

- listener rendering stays lighter
- feed logic becomes easier to inspect
- recommendation adjustments stop being buried inside UI code
- future growth can move this logic again without rewriting the full screen

## Current Built State

The current Echo web app now has a dedicated listener feed engine module for:

- feed scoring
- main feed assembly
- reserve track assembly
- separated-room assembly

## Future Direction

Later, this logic can evolve into:

- stronger shared ranking logic
- server-side recommendation support
- cross-front reuse where it makes sense

without needing to re-collapse everything back into the page shell.
