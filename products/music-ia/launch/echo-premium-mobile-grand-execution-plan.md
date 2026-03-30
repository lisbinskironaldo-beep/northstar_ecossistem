# Echo Premium Mobile Grand Execution Plan

## Purpose

This document defines the next major premium-execution cycle for Echo mobile.

It exists to answer:

1. what still feels weak
2. what premium should mean for Echo
3. how to improve interaction, organization and identity without breaking the current base
4. where each responsibility should live in the architecture

This is not a redesign fantasy.

It is the execution plan for turning the current mobile shell into:

- a premium music product
- a live-first discovery product
- a low-noise social music network
- a scale-safe front for the wider ecosystem

The prompt-sequence implementation order that now operationalizes this master plan lives in:

- `echo-premium-mobile-prompt-sequence-execution-plan.md`

The updated strategic product base for Echo mobile now also lives in:

- `echo-mobile-strategic-product-spec.md`

## External Reference Signals

The direction below is grounded in strong external precedents, but it is not meant to clone them.

### Apple

- Designing for iOS  
  https://developer.apple.com/design/human-interface-guidelines/designing-for-ios
- Explore navigation design for iOS  
  https://developer.apple.com/videos/play/wwdc2022/10001/

What matters:

- fewer controls visible at once
- clear hierarchy between primary and secondary actions
- strong use of familiar navigation placement
- discoverable depth instead of crowded first surfaces

### SoundCloud

- Feed for Artists  
  https://help.soundcloud.com/hc/en-us/articles/18440849363867-Feed-for-Artists
- Your Feed and how it works  
  https://help.soundcloud.com/hc/en-us/articles/115003568208-Your-Feed-and-how-it-works
- Search on SoundCloud  
  https://help.soundcloud.com/hc/en-us/articles/115003568168-Search-on-SoundCloud

What matters:

- feed split by followed versus discovery logic
- cover-first release cards
- short preview logic for feed consumption
- fast artist discovery without deep menu overhead

### Spotify

- Managing your Artist Pick  
  https://support.spotify.com/artists/article/artist-pick
- Adding concerts to Spotify  
  https://support.spotify.com/ws/artists/article/concerts-and-festivals/

What matters:

- artist home needs one strong focal area
- live/event visibility belongs near artist identity
- release and event surfaces should reinforce return behavior

### YouTube

- YouTube for Artists  
  https://artists.youtube.com/
- Official Artist Channel sections  
  https://support.google.com/youtube/answer/9048214?hl=en-BR
- Find music from artists you like  
  https://support.google.com/youtube/answer/7636475

What matters:

- one coherent artist stage beats many fragmented panels
- recency and subscriptions drive return
- the artist must feel alive, not merely listed

## Honest Diagnosis Of The Current Echo Mobile

The current mobile app already has:

- a clean 3-entry shell
- a fixed player
- a live-first home
- artist-home structure
- lightweight social memory
- separated professional access

But it still does not feel fully premium because:

- surface hierarchy is not strict enough yet
- some screens still carry old white-card residues
- too much explanatory text remains visible
- artist identity is stronger than before but still not a true stage
- search is cleaner but still not powerful enough in perception
- social presence exists, but still feels attached instead of native
- motion and transition language are still too weak

## What Premium Must Mean For Echo

Premium for Echo does **not** mean:

- more clutter
- more tabs
- heavier feeds
- more expensive infrastructure

Premium for Echo means:

- stronger visual hierarchy
- cleaner movement
- larger and more deliberate targets
- fewer but more meaningful actions
- identity through shape, glass, music and motion
- confidence without dashboard feel
- a distinctive dark-cinematic listener shell instead of a generic light app

## Premium Identity System

## Core Visual Rule

Every major mobile surface must belong to one of three families only:

### 1. Hero

Use for:

- expanded player
- artist featured release
- expanded Aura session

Properties:

- bigger visual gravity
- strongest cover treatment
- most contrast
- one primary action

### 2. Lane

Use for:

- release cards
- live strips
- library blocks
- artist launch rows
- category entry tiles

Properties:

- cut-corner frame
- slim top accent
- medium information density
- one clear tap behavior

### 3. Utility

Use for:

- counters
- toggles
- back controls
- mode switches
- micro status chips

Properties:

- smallest footprint
- no decorative overload
- never competes with Hero or Lane

If a component does not clearly fit one of these three families, it should be redesigned.

## Echo Color Direction

The app should feel like:

- dark cinematic glass
- violet-blue neon
- cooled chrome highlights
- opaque readable text

Not like:

- generic white fintech UI
- loud gamer UI
- a Spotify clone painted purple

### Primary palette

- `Void`: `#060816`
- `Night glass`: `rgba(10, 14, 30, 0.58)`
- `Midnight panel`: `rgba(17, 24, 39, 0.82)`
- `Ink light`: `#e5eefc`
- `Ink soft`: `#9fb0d1`
- `Neon violet`: `#8b5cf6`
- `Neon blue`: `#38bdf8`
- `Blue glow`: `rgba(56, 189, 248, 0.28)`
- `Violet glow`: `rgba(139, 92, 246, 0.24)`
- `Chrome line`: `rgba(201, 214, 255, 0.22)`

### Accent logic

- player and premium listening surfaces lean `neon blue`
- Aura and live surfaces can lean `violet-blue`
- warnings stay rare and muted
- text stays bright and opaque over dark glass

### Contrast rule

The app should be mostly semi-transparent and dark,
but readability must come from:

- bright text
- strong spacing
- stronger title weights
- reduced competing text blocks
- glow reserved for emphasis, never everywhere

## Interaction Identity

## Navigation Rule

Bottom navigation remains:

- `Inicio`
- `Buscar`
- `Perfil`

Top navigation should not return as a competing system.

## Player Rule

The fixed player should act like a calm anchor:

- always present
- ultra-slim by default
- one dominant action in slim state
- expansion as a separate action
- never visually confused with feed actions
- half-moon or oval profile instead of a generic rectangle
- integrated album art instead of a detached icon
- translucent blur-glass body with opaque controls and text

Expanded player should become the only place for:

- previous
- next
- stronger progress reading
- richer artwork state
- full cinematic treatment
- morph animation from mini state into full player

## Signature Player Rule

The Echo mini player is the first truly unique product surface.

It should become:

- half-moon / oval
- ultra-thin
- fixed at the top
- smooth lateral curves
- translucent dark glass
- one large central play-pause action
- integrated cover art
- minimal typography
- soft blue-violet neon accents

This surface should be treated as Echo's signature object, not just another component.

## Aura Rule

Aura is not a generic live room.

It should feel like:

- signal
- presence
- radio pulse

Aura strip behavior:

- slim and wide
- avatar-driven
- expands in place
- can be dismissed
- next live can slide in horizontally

Aura expanded behavior:

- no heavy archived media
- tiny reaction layer
- short comments only
- audience count visible
- strong audio identity

## Search Rule

Search must feel like a global command surface.

It should support:

- artist names
- track names
- fragments of text
- mood/category language
- access-room language
- local and global ranking surfaces later

But the first screen of search must still feel simple:

- one search field
- two big doors
- artists
- categories

## Artist Home Rule

The artist page must become a stage.

It should always answer:

1. who this artist is
2. what is the main release right now
3. what is coming next
4. what the listener can do now

That means:

- one featured release
- one live/schedule band
- one slim list of launches
- one compact social reaction area

Not:

- many equal blocks competing

## Social Rule

Echo should feel social through music behavior.

That means:

- what is playing
- what is new
- who is live
- who reacted
- what is worth returning to

It should not feel like:

- a comment-first app
- a media-wall app
- a profile vanity app

## Information-Density Rule

Every listener-facing screen should obey:

- one dominant area
- one secondary lane
- utility at the edge

If a screen has:

- many equal blocks
- too much explanation
- too many actions with equal emphasis

it is not premium yet.

## Architectural Execution Plan

## Layer 1: Mobile Presentation

Lives in:

- `apps/echo-mobile/app/*`
- `apps/echo-mobile/src/components/*`

Responsibilities:

- screen composition
- player surfaces
- Aura surfaces
- artist-home surfaces
- search and profile surfaces

Rule:

This layer should decide **how it looks**, not **how the business works**.

## Layer 2: Mobile Interaction State

Lives in:

- `apps/echo-mobile/src/lib/use-echo-audio-player.ts`
- `apps/echo-mobile/src/lib/use-echo-community-state.ts`
- `apps/echo-mobile/src/lib/mobile-social.ts`
- future dedicated screen-state helpers

Responsibilities:

- audio state
- preview versus main-track coordination
- local reaction memory
- local live-plan state
- listener-side UI state machines

Rule:

This layer should decide **how it behaves locally**, not **what the server ultimately owns**.

## Layer 3: API Contract

Lives in:

- `services/api`

Responsibilities:

- track reads
- creator reads
- asset URLs
- future social persistence
- future live reads and writes

Rule:

This layer should expose clean contracts for Echo first, but remain reusable later.

## Layer 4: Platform Readiness

Lives later in:

- `platform/*`

Responsibilities for future cross-front extraction:

- shared live event model
- shared social reaction payloads
- shared notification rules
- shared ranking signals

Rule:

Do not extract too early.
Extract only when Echo patterns are proven and Pulse/Lumen genuinely need them.

## Layer 5: Operations

Lives in:

- `docs/05-operations`
- `operations/*`

Responsibilities:

- beta reading
- creator onboarding
- event rescue rules
- trust and moderation procedure

Rule:

Operator logic should never leak into listener UI.

## Grand Execution Stages

## Stage A: Premium Perception Pass

Goal:

Make the app feel expensive without becoming expensive.

Work:

- remove visible explanatory copy from listener screens where possible
- unify all remaining screens under Hero/Lane/Utility
- eliminate leftover light-theme residues
- strengthen cover hierarchy
- tighten spacing rhythm
- pivot the listener shell toward dark-cinematic glass with blue-violet neon restraint
- make the top mini player the visual signature of the app

Definition of done:

- no screen looks like a dashboard
- no screen looks like it belongs to another theme

## Stage B: Artist Home 2.0

Goal:

Make artist pages feel like a world.

Work:

- stronger hero release
- clearer schedule band
- tighter launch rows
- more compact social layer
- better follow state prominence

Definition of done:

- the artist page feels like a destination, not a list

## Stage C: Aura Refinement

Goal:

Make live feel original, lightweight and memorable.

Work:

- stronger Aura strip identity
- better inline expansion behavior
- calmer live interaction treatment
- scheduled Aura visibility in home and artist pages

Definition of done:

- Aura feels like a native Echo idea, not a borrowed generic live widget

## Stage D: Search 2.0

Goal:

Make search feel useful and premium.

Work:

- group results by type
- highlight strongest match
- improve category scope logic
- prepare local versus near versus world discovery later

Definition of done:

- search feels powerful without becoming noisy

## Stage E: Motion And Transition Pass

Goal:

Make surfaces feel connected.

Work:

- animate player expand/collapse better
- animate Aura open/close better
- improve transitions into artist home
- improve perceived continuity between feed and artist

Definition of done:

- the app feels intentional in movement, not static blocks swapping

## Stage F: Backend-Ready Premium Boundaries

Goal:

Make all this premium work safe for future growth.

Work:

- keep local social state isolated
- keep live-plan local state isolated
- define migration payloads clearly
- keep artist-home and player state independent from backend timing

Definition of done:

- later API migration will not force a redesign

## Ecosystem Rule

This premium cycle is Echo-first.

But it should leave reusable patterns for:

- Pulse discovery
- Pulse creator-home logic
- Lumen release/event structure

Reusable later:

- Hero/Lane/Utility surface system
- live-event visibility rhythm
- creator-home stage structure
- bottom-navigation calm shell

Echo-only for now:

- 20-second music preview logic
- Aura radio identity
- library borrowing behavior
- music-first artist stage

## What Should Not Be Built In This Cycle

- more tabs
- heavy comment threads
- image-first social feed
- archived live sessions
- full backend social network
- premature shared platform abstractions

## Success Criteria

The premium cycle is successful when:

- the app feels calmer and more expensive
- the first screen feels alive in under one minute
- artist home feels memorable
- search feels purposeful
- Aura feels original
- nothing important needs a destructive rewrite later

