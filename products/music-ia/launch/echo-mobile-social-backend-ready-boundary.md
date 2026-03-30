# Echo Mobile Social Backend-Ready Boundary

## Purpose

This document defines the migration boundary between the current lightweight local social layer in Echo mobile and the later shared backend social layer.

It exists so the mobile product can keep evolving now without forcing a redesign later.

## Current Rule

The current mobile social layer is intentionally:

- local
- lightweight
- cheap
- reversible
- isolated from the rest of the mobile shell

That is correct for the current phase.

Echo should not build a heavy backend social network before:

- the premium listener flow feels strong
- the first beta behavior is real
- creator cadence is proven
- cheap operations are still under control

## What Is Local Right Now

The current local social layer lives in:

- `apps/echo-mobile/src/lib/use-echo-community-state.ts`

It currently stores:

- likes per track
- Echo emojis per track
- short comments per track
- live reminders per artist
- creator-side live plans

That local layer is useful because it already proves:

- which interactions feel alive
- which ones are noise
- which payloads will matter later

## What Must Not Be Mixed Yet

Do not mix backend social persistence into:

- player components
- feed-card layout logic
- artist-home layout logic
- creator-form state

Those screens should consume social state.
They should not become the source of truth for it.

## Migration Boundary

The boundary is simple:

- app keeps rendering and local interaction UX
- API later becomes the source of truth
- platform later owns reusable social models when they stop being Echo-only

## Backend-Ready Payload Shapes

The app should already think in these shapes even while local.

### Track Reaction

```ts
type EchoTrackReactionPayload = {
  trackId: string;
  userId: string;
  liked: boolean;
  emojiCodes: string[];
  updatedAt: string;
};
```

### Track Comment

```ts
type EchoTrackCommentPayload = {
  id: string;
  trackId: string;
  userId: string;
  body: string;
  emojiCodes: string[];
  createdAt: string;
};
```

### Artist Reminder

```ts
type EchoArtistReminderPayload = {
  creatorId: string;
  userId: string;
  enabled: boolean;
  updatedAt: string;
};
```

### Creator Live Plan

```ts
type EchoLivePlanPayload = {
  id: string;
  creatorId: string;
  mode: 'radio' | 'show' | 'drop';
  title: string;
  note: string;
  scheduledFor: string | null;
  audienceHint: string | null;
  createdAt: string;
  updatedAt: string;
};
```

## API Responsibility Later

When backend social persistence becomes worth the cost, it should enter `services/api` as:

- track reaction read/write
- track comment read/write
- creator reminder read/write
- creator live-plan read/write

Not as:

- giant social feed backend
- generic social graph platform
- image-first community system

Echo should remain music-first.

## Platform Responsibility Later

These only move into `platform` after they are clearly reusable across fronts:

- reminder model
- live-event model
- lightweight reaction model
- notification hooks

If they stay Echo-specific for a while, they should remain in Echo-facing service code.

## UI Contract Rule

These mobile screens should survive the migration without redesign:

- home feed
- fixed player dock
- artist profile panel
- creator studio panel

Only the data source should change.

That means:

- no screen should depend on AsyncStorage details
- no screen should invent its own social shape
- no screen should hide essential IDs from the layer below

## Step-By-Step Migration Path

### Step 1

Keep the current local state.

Purpose:

- validate product shape
- validate language
- validate interaction density

### Step 2

Add API endpoints that mirror the local payload shapes.

Purpose:

- avoid rewriting screens
- let local and remote states coexist briefly during migration

### Step 3

Move write actions first:

- like
- emoji
- reminder
- live plan

Purpose:

- easiest path to shared state
- smallest moderation risk

### Step 4

Move comments after the lighter actions are stable.

Purpose:

- comments create more moderation pressure
- comments should arrive only when the product already knows it wants them

### Step 5

Only later connect:

- notifications
- friend-driven live visibility
- cross-front event presence

## Cost Rule

Backend social persistence is allowed only when:

- the social layer is helping retention
- the product already feels premium enough to deserve it
- the added ops burden is acceptable for a lean team

If not, the local layer stays the correct choice.

## Relation To Pulse And Lumen

This boundary is designed so Echo can mature first.

Later:

- Pulse can reuse reminder and lightweight reaction patterns
- Lumen can reuse event scheduling and creator-home event surfaces

But neither front needs to inherit Echo's full UI.

They only inherit the reusable model.

## Decision

The current local social layer is not a hack.

It is a deliberate first stage.

The backend-ready boundary now exists so the product can keep growing without:

- collapsing into one code path
- overbuilding too early
- forcing a redesign later
