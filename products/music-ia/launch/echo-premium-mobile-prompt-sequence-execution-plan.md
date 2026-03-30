# Echo Premium Mobile Prompt-Sequence Execution Plan

## Purpose

This document turns the approved premium-mobile prompt sequence into one official execution plan.

It exists to answer:

1. what order the work should happen in
2. what each block is trying to achieve
3. what depends on what
4. what belongs to app, service, platform or ops
5. how to introduce the new Echo ritual without creating rework

This plan does **not** replace the broader premium-mobile roadmap.

It translates the current approved prompt sequence into:

- strategy
- work blocks
- execution boundaries
- risk controls
- definition of done

The live large-block execution board for this sequence now also lives in:

- `echo-premium-mobile-block-execution-control.md`

The updated strategic product base for the mobile front now also lives in:

- `echo-mobile-strategic-product-spec.md`

## Current Execution State

Current status:

- approved
- documented
- Wave 1 validated
- Wave 2 opened

Validation note:

- `npm run typecheck --workspace @northstar/echo-mobile` passed
- `npx expo export --platform android --clear` passed when run from `apps/echo-mobile`

Wave 1 now includes:

- Wave 1 shell and home pass
- Wave 1 premium-perception pass 02
- Wave 1 home-distinction pass 03
- Wave 1 noise-reduction pass 04

That pass is documented in:

- `../listener-experience/echo-wave-1-shell-and-home-pass.md`

## Strategic Center

The mobile premium cycle should no longer be treated as a pure visual cleanup.

The product center is now:

- live-first discovery
- emerging artists
- AI-assisted music creation
- social presence through music behavior
- a repeatable ritual around launch participation

The strongest new product ritual is:

## `Estreia em Circulo`

This should be treated as the central Echo ritual, not as a side feature.

Why:

- it gives Aura a real reason to exist
- it gives the artist a reason to schedule and return
- it gives the listener a reason to arrive early
- it creates status without toxic competition
- it creates a native sharing reason

## External Product Signals

This plan stays aligned with the previously documented external references:

- Apple navigation and iOS interaction discipline
- SoundCloud feed and discovery behavior
- Spotify artist and event prominence
- YouTube artist-home and subscription logic

The plan also absorbs the strongest product insight from the latest specialist feedback:

- Echo still lacks one central loop
- Aura should become the product heart
- the app should feel like the place where listeners arrive before the rest of the market

## Product Thesis

Echo should not try to win on:

- total catalog
- endless feed volume
- clone behavior of major streaming platforms

Echo should try to win on:

- artist birth
- live discovery
- early participation
- premium identity
- community around emergence

The app should make the user feel:

- I discover first
- I was there early
- I belong to the circle around this sound
- this is where people arrive before the rest of the market

## Execution Order

The approved prompt sequence is correct and should be executed in this order:

1. visual consistency
2. structural direction
3. home redesign
4. studio simplification
5. better search
6. `Estreia em Circulo`
7. artist profile refactor
8. retention and light social status

This order stays correct because:

- blocks 1 and 2 remove chaos before feature work
- block 3 puts the new hierarchy where it matters most
- block 4 prepares creator flow before launch ritual exists
- block 5 improves discovery without overcomplicating architecture
- block 6 introduces the ritual only after the shell is ready
- blocks 7 and 8 then turn the ritual into lasting product value

## Cross-Block Rules

Every block in this sequence must obey:

- listener mode stays immersive
- professional mode stays controlled
- Aura stays music-first, not comment-first
- text stays low-noise
- no screen gets more tabs
- no backend-heavy abstraction gets introduced early
- all local-first state must remain migratable to API persistence later

## Block 1: Visual Consistency

### Objective

Turn the current mobile shell into one coherent visual system.

### Strategy

Start by freezing the visual language before adding new product ritual surfaces.

The app cannot feel premium if:

- cards belong to different design systems
- text contrast changes too much between screens
- one screen is dark-cinematic and another still looks transitional

### Work

- define and freeze explicit global tokens:
  - color
  - typography
  - spacing
  - glass
  - shadow
  - glow
  - border line
  - accent behavior
- standardize the three surface families already defined elsewhere:
  - `Hero`
  - `Lane`
  - `Utility`
- remove remaining light-theme residues
- unify glass opacity and contrast
- standardize the slim top accent logic
- make the mini player the signature identity object of the app

### Architecture

App:

- `apps/echo-mobile/src/components/mobile-ui.tsx`
- listener-facing shared presentation components

State:

- none beyond visual state

Service:

- none required

Ops:

- none required

### Risks

- over-styling without hierarchy
- inconsistent reuse across screens
- too much glow reducing readability

### Definition Of Done

- every listener screen looks like the same product
- no bright stray surfaces remain
- the mini player is unmistakably Echo

## Block 2: Structural App Direction

### Objective

Make the information architecture obey one product thesis:

`live discovery of emerging artists`

### Strategy

Each of the 3 tabs must have one focus and one primary CTA.

### Tab Focus

`Inicio`

- focus: enter the live discovery pulse
- primary CTA: enter a live or launch surface

`Buscar`

- focus: intentionally open a world
- primary CTA: discover by artist, category or live intent

`Perfil`

- focus: identity and control
- primary CTA:
  - listener: understand your pulse and library state
  - professional: manage access and publishing

### Work

- remove residual duplicated blocks
- reduce equal-weight surfaces in the same viewport
- keep Aura as the center of `Inicio`
- keep the creator path explicitly secondary inside `Perfil`
- keep `Buscar` as a command/discovery surface, not a content wall

### Architecture

App:

- `apps/echo-mobile/App.tsx`
- `apps/echo-mobile/app/index.tsx`
- `apps/echo-mobile/app/explore.tsx`
- `apps/echo-mobile/app/profile.tsx`

State:

- local screen-state helpers only

Service:

- none required in first pass

### Risks

- making the app too sparse
- keeping too many old blocks because they are already built

### Definition Of Done

- each tab has one obvious purpose
- first scroll does not feel crowded
- listener and creator no longer visually fight each other

## Block 3: Home Redesign

### Objective

Make `Inicio` feel alive, premium and clearly musical.

### Strategy

Home should become a rhythm, not a stack.

Before first meaningful scroll, the user should understand:

- something is live
- something is premiering
- something is new
- my library is one tap away

### Target Structure

1. mini player
2. `Aura agora`
3. `Estreias de hoje`
4. `Novas publicacoes`
5. `Biblioteca`
6. ecosystem horizon

### Work

- make `Aura` the first strong content layer
- add a distinct `Estreias de hoje` lane
- keep new-publication feed separate from the player state
- limit visible vertical clutter before scroll
- keep live cards slim, horizontal and event-aware
- ensure each live card shows:
  - artist
  - session type
  - circle/global source
  - live count
  - remaining time
  - `entrar` or `lembrar`

### Architecture

App:

- `apps/echo-mobile/app/index.tsx`
- `live-room-card.tsx`
- `live-room-panel.tsx`
- `social-release-card.tsx`
- `home-library-grid.tsx`

State:

- local live strip state
- reminder state

Service:

- later live feed/event reads

### Risks

- too many vertical sections
- Aura still feeling like a widget instead of a core surface

### Definition Of Done

- home feels alive in under one minute
- Aura is clearly the heart of the screen
- the feed no longer feels like the main identity object

## Block 4: Studio Simplification

### Objective

Reduce creator friction and increase completion rate.

### Strategy

Split the flow into 3 clear steps and show progress.

Simple mode should come first.
Advanced controls should collapse behind explicit expansion later.

### Target Steps

1. `Faixa`
2. `Classificacao`
3. `Lancamento`

### Work

`Faixa`

- titulo
- artista
- capa
- audio
- preview start point

`Classificacao`

- categoria
- idioma
- mood
- entrada/tipo
- declaracao de IA

`Lancamento`

- publicar agora
- agendar
- `Estreia em Circulo`
- vincular ao ao-vivo quando fizer sentido

Also add:

- visible progress
- clear validation
- preview of the card that will hit the feed

### Architecture

App:

- `creator-studio-panel.tsx`
- profile/professional entry flow

State:

- local wizard state

Service:

- existing submission contract
- later event-launch metadata

Ops:

- acceptance/legal gate stays outside the form wizard itself

### Risks

- turning simplification into hidden complexity
- mixing launch logic with legal acceptance

### Definition Of Done

- the creator no longer sees one long raw form
- progress is obvious
- launch options are understandable

## Block 5: Better Search

### Objective

Make search feel like intelligent discovery, not plain lookup.

### Strategy

Keep the search visually simple, but widen its intent model.

### Work

- keep the main field
- add quick-intent surfaces:
  - artistas pequenos
  - ao vivo agora
  - estreia hoje
  - dark
  - treino
  - noite
  - experimental
  - do meu circulo
  - subindo rapido
- group results by:
  - artists
  - tracks
  - live/events
  - categories
- when idle, show:
  - `Artistas`
  - `Categorias`
  - `Descoberta ao vivo`

### Architecture

App:

- `apps/echo-mobile/app/explore.tsx`
- search tiles and grouped result components

State:

- local search scope/intention state

Service:

- keep first version simple
- no heavy semantic search yet

### Risks

- a busy search screen that stops feeling premium
- pretending to have AI-level search too early

### Definition Of Done

- search feels more powerful without getting noisy
- the user can discover by intent, not only by typed name

## Block 6: Estreia em Circulo

### Objective

Introduce Echo's central ritual.

### Strategy

Ship this in phases.

Do not begin with heavy backend complexity.

### Product Logic

An artist can mark a launch as `Estreia em Circulo`.

The ritual state model must explicitly include: `Agendada`, `Comecando`, `Ao vivo`, `Liberada` and `Encerrada`.

Before the full release:

- the track lives inside Aura as a social-live event
- listeners can join the room
- hear the preview
- react
- send short comments
- save
- follow
- set a reminder

When the release opens:

- the card changes state
- the full track is available
- presence and participation convert into `primeiros ouvintes` signals

### States

- agendada
- ao vivo
- liberada
- encerrada

### Phase Logic

Phase 6A:

- UI states
- local interaction model
- scheduled/home/artist visibility

Phase 6B:

- persistent state via API
- event timestamps
- reminder payloads

Phase 6C:

- basic anti-spam presence validation
- first-listener attribution safety

### Live Interaction Rules

- short comments only
- cooldown between sends
- emoji-first reactions
- no heavy thread model

### Architecture

App:

- Aura strips and expanded room
- artist profile schedule band
- home premiere lane
- studio launch step

State:

- premiere lifecycle state
- presence timer/state
- first-listener local marking before server truth

Service:

- event status
- participation writes
- reminder writes
- first-listener truth later

Ops:

- moderation rules for live comments

### Risks

- overbuilding live before the ritual is understood
- fake participation or spam
- making comments heavier than music

### Definition Of Done

- the user can feel a real event lifecycle
- the artist can schedule it
- the listener can participate in it
- the product now has a repeatable ritual

## Block 7: Artist Profile Refactor

### Objective

Turn the artist profile into a living stage.

### Strategy

Keep only one strong hero and one strong featured track.

The hero cannot compete with the featured release.

### Target Structure

1. hero
2. featured track
3. slim launch list
4. agenda viva
5. compact reactions
6. next events

### Work

- strengthen artist identity
- strengthen featured release clarity
- show current relevance:
  - now live
  - premiere today
  - recently dropped
- show first-listener and premiere signals
- keep the list slim and emotional

### Architecture

App:

- `artist-profile-panel.tsx`

State:

- selected featured release
- local reactions
- reminder state

Service:

- later schedule and reaction reads

### Risks

- overloading the page with social metrics
- too many equal-weight sections

### Definition Of Done

- the artist feels like a destination
- the listener can understand the artist in seconds

## Block 8: Retention And Light Social Status

### Objective

Create positive return loops through early discovery.

### Strategy

Reward presence and taste, not raw competition.

### Core Signals

- `voce ouviu antes`
- `primeiro circulo`
- `presente na estreia`

These should appear first in:

- profile
- library
- shareable cards

Not in:

- public harsh ranking boards
- toxic competition surfaces

### Work

- mark listeners who joined premieres
- mark listeners who saved emerging artists early
- surface these signals in profile and library
- prepare shareable premium cards

### Architecture

App:

- profile pulse
- library surfaces
- artist/track share cards later

State:

- local-first signal memory

Service:

- later truth and history persistence

### Risks

- status feeling fake or inflated
- gamification becoming spammy

### Definition Of Done

- the user feels pride in discovery
- the product gains a non-toxic reason to return

## Recommended Phase Grouping

To reduce rework, these 8 blocks should be grouped into 4 larger execution waves.

### Wave 1: Shell And Hierarchy

Includes:

- Block 1
- Block 2
- Block 3

Outcome:

- premium coherent shell
- live-first home
- stronger hierarchy

### Wave 2: Creator Path And Search

Includes:

- Block 4
- Block 5

Outcome:

- simpler studio
- clearer discovery

### Wave 3: Core Ritual

Includes:

- Block 6
- Block 7

Outcome:

- `Estreia em Circulo`
- artist stage that can hold the ritual

### Wave 4: Retention And Identity

Includes:

- Block 8

Outcome:

- discovery pride
- first-listener identity
- social return loop

## Technical Sequencing Rule

For every wave:

1. freeze UX intent
2. freeze component boundaries
3. implement local-first states
4. validate interaction logic
5. document migration boundary
6. only then expand service/API where needed

## Documentation Rule

After each wave:

- update `echo-premium-mobile-roadmap.md`
- update `echo-evolution-checklist.md`
- update `execution-tracker.md`
- update `project-handoff-status.md`
- update `phase-2-build-notes.md`

## What Stays Out Of Scope For This Sequence

- public launch of Pulse
- public launch of Lumen
- full backend social network
- replay archive of live sessions
- advanced monetization for listeners
- toxic rankings
- heavy AI search

## Ready-To-Start Condition

This sequence is ready to start when:

- the 8-block order above is accepted
- `Estreia em Circulo` is accepted as the central ritual
- implementation can begin with Wave 1 instead of isolated micro-tweaks

## Final Rule

Echo should not become:

- a clone of Spotify
- a clone of TikTok
- a clone of Instagram

Echo should become:

- a premium dark music app
- a live-first discovery network
- a place where artists begin in public
- a place where listeners arrive early and remember that they did



