# Echo Premium Mobile Execution Procedure

## Purpose

This document refines the execution procedure for the next premium-mobile cycle of Echo.

It exists to answer four things clearly:

1. what should be built next
2. in what order
3. where each responsibility should live in the codebase
4. how to stay aligned with the wider ecosystem without overbuilding too early

The broader premium architecture, identity system and stage plan now also live in:

- `echo-premium-mobile-grand-execution-plan.md`
- `echo-premium-mobile-prompt-sequence-execution-plan.md`

## Current Base Check

The current Echo mobile base is ready for a stronger premium pass because it already has:

- a clean listener shell
- a separated creator path
- a social release feed
- a fixed player dock
- a first premium artist home
- a local audio foundation
- a local social-memory layer
- lightweight live-plan scheduling

That means the next cycle should not rebuild the shell.

It should deepen the surfaces that already exist.

## External Product Signals Used

### SoundCloud

- Feed for Artists  
  https://help.soundcloud.com/hc/en-us/articles/18440849363867-Feed-for-Artists
- Your Feed and how it works  
  https://help.soundcloud.com/hc/en-us/articles/115003568208-Your-Feed-and-how-it-works
- Search on SoundCloud  
  https://help.soundcloud.com/hc/en-us/articles/115003568168-Search-on-SoundCloud

Why these matter:

- split between `Discover` and `Following`
- artist-selected preview logic
- cover-first feed behavior
- discovery by vibe/profile rather than only by rigid menu structures

### Spotify

- Managing your Artist Pick  
  https://support.spotify.com/pg/artists/article/artist-pick/
- Adding concerts to Spotify  
  https://support.spotify.com/tg-fr/artists/article/adding-concerts-to-spotify/
- Managing your artist profile  
  https://support.spotify.com/vu-fr/artists/article/managing-your-artist-profile/

Why these matter:

- artist home needs a top featured area
- event visibility belongs near artist identity
- fan follow and artist updates reinforce each other

### YouTube

- Official Artist Channel sections  
  https://support.google.com/youtube/answer/9048214?hl=en-BR
- Find music from artists you like  
  https://support.google.com/youtube/answer/7636475

Why these matter:

- one coherent artist stage matters more than many loose profile fragments
- subscriptions and recency should drive return behavior
- artist-home structure should feel ordered, not overloaded

### SoundCloud distribution metadata rules

- Distribution Best Practices  
  https://help.soundcloud.com/hc/en-us/articles/360051802133-Distribution-Best-Practices

Why this matters:

- upload metadata discipline should keep growing now
- future distribution quality starts with clean metadata today

## Core Execution Rule

The premium mobile pass should improve perception without inflating infrastructure.

So each change must satisfy:

- cleaner listener experience
- stronger artist identity
- low storage pressure
- low social complexity
- scale-safe placement in the repo

## What Belongs Where

### Mobile app layer

Belongs in `apps/echo-mobile`:

- feed presentation
- artist-home presentation
- fixed player interaction
- local reaction memory
- lightweight live scheduling UX
- listener-side flow and navigation

### API layer

Belongs in `services/api`:

- track reads
- creator reads
- content asset exposure
- playback event writes
- future shared social state reads and writes

### Platform layer

Belongs later in `platform` when it becomes cross-front:

- shared reaction models
- shared live-event model
- shared feed ranking signals
- shared creator-notification model

### Ops layer

Belongs in `operations` and `docs/05-operations`:

- beta reading
- creator weekly checks
- onboarding guidance
- moderation and event rescue process

## Execution Sequence

## Stage 1: Premium Visual Polish

Goal:

Make the mobile app feel expensive without making the system expensive.

Work:

- improve spacing
- strengthen cover treatment
- reduce leftover text density
- unify card rhythm across feed, artist home and profile
- make the fixed player calmer and more premium

Definition of done:

- listener screens feel deliberate
- the app no longer looks like a technical shell
- cards feel like one design system

## Stage 2: Feed-Level Live Visibility

Goal:

Let live radio and scheduled drops matter before the listener enters the artist home.

Work:

- add lightweight live chips to release cards
- surface near-term live plans in `following`
- surface stronger scheduled launches in `discover`
- keep the feed capped and quiet

Definition of done:

- live/show/drop visibility exists in feed
- feed does not become noisy
- listener can notice activity without leaving the main flow

## Stage 3: Better Social Readability

Goal:

Make reactions feel alive, but still audio-first.

Work:

- improve visual treatment of likes
- improve Echo emoji language
- improve comment compactness
- make reminders visible in the artist home and later in feed

Definition of done:

- social signals add life
- social signals do not dominate the product

## Stage 4: Backend-Ready Boundary

Goal:

Prepare the local mobile social layer to migrate later without rework.

Work:

- define backend-ready social payload shapes
- define minimal live-plan read/write model
- keep current local state isolated
- document migration path from local memory to shared state

Definition of done:

- current local state remains useful
- future API migration path is explicit
- no screen needs redesign when persistence moves server-side

## Stage 5: Ecosystem Reuse Check

Goal:

Make sure Echo improvements can inform Pulse and Lumen later without forcing their UI now.

Work:

- mark which mobile patterns are Echo-specific
- mark which patterns are reusable:
  - following/discover split
  - artist/creator home rhythm
  - lightweight live-event visibility
  - horizon strip

Definition of done:

- reusable patterns are visible in docs
- Echo still stays music-first

## Current Recommended Order

1. premium visual polish
2. feed-level live visibility
3. better social readability
4. backend-ready boundary
5. ecosystem reuse check

## Current Status

Stages completed in the current cycle:

- Stage 1: premium visual polish
- Stage 2: feed-level live visibility
- Stage 3: first social-readability pass
- Stage 4: backend-ready boundary
- Stage 5: ecosystem reuse check

Stage still open for deeper product work:

- Stage 3 can keep evolving, but its first premium pass is now complete

## Guardrails

Do not do these in this cycle:

- full backend social network
- heavy image-first timeline
- archived live media
- video-first live
- opening Pulse or Lumen product surfaces in the mobile shell
- forcing platform-level abstractions too early

## Relation To The Bigger Ecosystem

This procedure serves all three fronts indirectly:

- Echo gets better now
- Pulse gets reusable discovery and live-visibility patterns later
- Lumen gets reusable creator-home and event patterns later

But the implementation remains Echo-first.

That is the correct balance.

## Next Concrete Build Block

The next implementation block should be:

1. deepen social readability now that the local social layer is stable
2. decide whether reminder and reaction density belong in feed cards or only in artist homes
3. keep the migration boundary unchanged while evaluating what should become API-backed first
4. move from sample media toward storage-backed creator assets
