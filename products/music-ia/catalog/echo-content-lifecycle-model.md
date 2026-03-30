# Echo Content Lifecycle Model

## Purpose

This document defines what happens to a track after upload.

The goal is:

- do not delete too early
- do not keep everything equally active
- do not let cold catalog flood the product
- keep storage and delivery under control

## Core Rule

Echo should control cost and quality through lifecycle, not through blind deletion.

That means a track can exist without staying active forever.

## Track Lifecycle States

### 1. Draft

The track exists inside the creator workspace but is not public.

Use for:

- upload not yet published
- incomplete release setup
- waiting for creator choice

### 2. Active

The track is live and eligible for distribution.

This is the expensive state in product attention terms.

An active track can:

- appear in feed
- appear in discovery
- be recommended
- count as part of the active catalog limit

### 3. Cold

The track remains public but is no longer pushed normally.

A cold track can:

- still exist on artist profile
- still work through direct access
- stay visible in deeper library and catalog surfaces

But it should not stay in normal rotation by default.

### 4. Dormant

The track is removed from active public circulation but preserved.

A dormant track:

- is not deleted
- is not part of normal distribution
- can be reactivated later
- can move to cheaper storage handling later

This is the correct answer for low-performing catalog that should not vanish forever.

### 5. Removed

The track is intentionally removed.

Use for:

- creator deletion
- rights violation
- trust and safety decision

## State Movement Rules

Recommended flow:

- `Draft -> Active`
- `Active -> Cold`
- `Cold -> Dormant`
- `Dormant -> Active` through controlled reactivation
- `Any state -> Removed` when needed

## Why This Matters

If Echo leaves everything active:

- feeds get noisy
- creators over-upload
- listeners see too much weak catalog
- cost grows without product value

If Echo deletes too fast:

- creators feel punished
- catalog history disappears
- reactivation and learning become impossible

The right path is lifecycle control.

## Product Rule

The system should limit:

- active catalog
- active artist exposure
- repeated reactivation abuse

The system should not over-limit:

- storage of dormant work
- creator experimentation
- catalog history
