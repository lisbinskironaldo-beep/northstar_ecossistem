# Echo Premium Mobile Prompt Sequence Plan

## Status

This document is now superseded by:

- `echo-premium-mobile-prompt-sequence-execution-plan.md`

Use the newer file as the canonical execution reference.

## Purpose

This document turns the agreed premium-mobile prompt sequence into an execution-ready plan.

It exists so the next implementation cycle can begin without ambiguity.

It answers:

1. what each prompt block is really trying to solve
2. in what order the blocks should be executed
3. what must be true before each block starts
4. what belongs to presentation, interaction state, API or platform
5. what "done" means for each block

This plan is Echo-first and respects the current ecosystem rules:

- Echo evolves now
- Pulse and Lumen stay visible as future fronts
- creator and listener stay separated in use, not in identity
- robustness and self-sufficiency remain mandatory

## Confirmed Execution Sequence

The approved sequence is:

1. visual consistency
2. app structural direction
3. new home
4. simplified studio
5. better search
6. key feature: `Estreia em Circulo`
7. artist profile refactor
8. retention and social status

This order is correct.

It works because:

- blocks `1` and `2` unify the base
- blocks `3`, `4` and `5` prepare the core surfaces
- block `6` creates the product ritual
- blocks `7` and `8` convert that ritual into attachment and return

## Strategic Rule

This cycle should not be treated as "add more features".

It should be treated as:

**build the ritual, then build the surfaces around the ritual**

That ritual is:

- `Aura`
- `Estreia em Circulo`
- `primeiros ouvintes`

This is the center of the new Echo identity.

## Architectural Guardrail

Each block must respect these boundaries:

### Presentation layer

Lives in:

- `apps/echo-mobile/app/*`
- `apps/echo-mobile/src/components/*`

Owns:

- visual composition
- gestures and transitions
- display states
- surface hierarchy

### Mobile interaction state

Lives in:

- `apps/echo-mobile/src/lib/*`

Owns:

- local playback coordination
- local social memory
- local launch/live state until backend migration
- listener flow state

### API contract

Lives in:

- `services/api`

Owns:

- reads and writes that become shared truth
- future `Estreia em Circulo` state persistence
- track and creator identity
- future status and presence reads

### Platform

Lives later in:

- `platform/*`

Owns later:

- reusable live-event model
- reusable social markers
- reusable status/badge model
- reusable discovery signals

### Ops

Lives in:

- `docs/05-operations`
- `operations/*`

Owns:

- moderation and trust rules
- creator onboarding
- event rescue procedure
- beta reading

## Execution Strategy

## Phase A: Stabilize The Product Identity

Includes:

- Prompt 1
- Prompt 2

Goal:

Make the app feel like one product before adding its strongest ritual.

Outcome:

- one consistent visual system
- one clear product core
- one listener shell identity

## Phase B: Strengthen The Main Surfaces

Includes:

- Prompt 3
- Prompt 4
- Prompt 5

Goal:

Make home, studio and search strong enough to carry the ritual.

Outcome:

- stronger listener entry
- faster creator publishing path
- more useful discovery

## Phase C: Build The Ritual

Includes:

- Prompt 6

Goal:

Give Echo a behavior that strong catalog apps do not naturally own.

Outcome:

- launch as event
- participation as status
- Aura as true center

## Phase D: Build Memory And Return

Includes:

- Prompt 7
- Prompt 8

Goal:

Turn one-time launch participation into identity and recurrence.

Outcome:

- artist home as living stage
- social memory that matters
- non-toxic discovery status

## Block 1: Visual Consistency

### Prompt

Review the full Echo mobile visual system and unify color, border, radius, shadow, glow and typography.

### Why it comes first

Because feature work on top of a broken design language multiplies rework.

### Scope

- mini player
- bottom navigation
- home cards
- artist home
- search
- profile
- creator plan surfaces
- studio surfaces

### Additional details added to the prompt

- define and freeze a token table before applying
- define which surfaces belong to `Hero`, `Lane` and `Utility`
- eliminate all leftover light-theme residues in listener mode
- keep text readable with strong opaque contrast

### Done means

- no obvious theme collisions
- no random rounded white cards in the listener shell
- one premium visual family across the app

### Risk

- can accidentally make creator screens too decorative

### Guardrail

- listener gets the full premium treatment first
- professional can stay cleaner and slightly more utilitarian

## Block 2: App Structural Direction

### Prompt

Refactor the UX structure so Echo clearly feels like live discovery of emerging artists.

### Why it comes second

Because home, search and profile need one shared logic before being deepened.

### Scope

- define the job of each tab
- define Aura as product center
- clarify listener versus professional experience
- reduce repeated blocks

### Additional details added to the prompt

- define one primary focus and one primary CTA for each tab
- define what must always stay visible versus what can open as sheet/panel
- keep listener mode immersive and professional mode operational

### Done means

- `Inicio`, `Buscar` and `Perfil` each feel unmistakably different
- Aura is not a secondary widget anymore
- the app no longer feels like stacked experiments

## Block 3: New Home

### Prompt

Redesign the home to feel premium, alive and desirable.

### Confirmed structure

1. mini player
2. Aura agora
3. Estreias de hoje
4. Novas publicações
5. Biblioteca
6. horizonte do ecossistema

### Additional details added to the prompt

- limit what is visible before first scroll
- make Aura the first emotional draw
- separate event surfaces clearly:
  - radio
  - estreia
  - drop
  - show
- keep the player independent from feed previews

### Done means

- first screen feels alive in under one minute
- Aura is the emotional center
- the home no longer feels like equal stacked cards

## Block 4: Simplified Studio

### Prompt

Turn the professional submission flow into 3 steps:

- Faixa
- Classificacao
- Lancamento

### Why it comes before `Estreia em Circulo`

Because the ritual needs a clean launch pipeline first.

### Additional details added to the prompt

- create `modo simples` first
- keep `modo avancado` collapsed or secondary
- show progress clearly
- show validation clearly
- show a visual preview of the resulting feed card
- keep metadata discipline without burying the creator in fields

### Done means

- creators understand the flow in one reading
- completion rate should clearly improve
- `Estreia em Circulo` can be inserted naturally into `Lancamento`

### Risk

- oversimplifying can lose metadata quality

### Guardrail

- preserve metadata discipline, but progressively disclose it

## Block 5: Better Search

### Prompt

Improve search beyond text-only lookup.

### Scope

- artists
- tracks
- live now
- estreia today
- dark
- treino
- noite
- experimental
- do meu circulo
- subindo rapido

### Additional details added to the prompt

- when results are mixed, group them visually by type
- preserve fast entry with no heavy ranking engine yet
- use simple filters and intent chips first
- keep search opening clean even after improvement

### Done means

- search feels useful even before typing exact names
- users can search by intention, not only by term
- no heavy AI dependency is required

## Block 6: Key Feature - Estreia em Circulo

### Prompt

Implement `Estreia em Circulo` as a social-live launch state.

### This is the central product ritual

This is not just another feature.

This is the strongest candidate for Echo's core loop.

### Core states

- `agendada`
- `ao vivo`
- `liberada`
- `encerrada`

### Required listener behavior

- enter Aura before full release
- hear preview
- react
- comment in short form
- follow
- save
- set reminder

### Required artist behavior

- schedule release as `Estreia em Circulo`
- bring audience to the event
- release full track at scheduled time

### Additional details added to the prompt

- implement this in stages
- first stage can be UI + local state + surface transitions
- second stage can become persistent/shared
- comments must use cooldown and short-length rule
- first-listener attribution must require real presence

### Done means

- launch feels like an event, not only publication
- users can participate before full release
- the event state is visible and understandable

### Risk

- this can sprawl into a full live platform too early

### Guardrail

- keep it lightweight
- no heavy archived media
- no long discussion threads

## Block 7: Artist Profile Refactor

### Prompt

Turn the artist profile into a mini-world.

### Required structure

1. hero
2. featured track
3. slim launches
4. live agenda
5. reactions
6. upcoming events

### Additional details added to the prompt

- the hero and featured track cannot compete equally
- the page should answer "what matters now?"
- first-listener and estreia signals should become visible here
- activity should feel current, not archival

### Done means

- artist home feels memorable
- users understand what to do next immediately
- launches, live and social all reinforce one another

## Block 8: Retention And Social Status

### Prompt

Create a light social-retention system around early discovery.

### Confirmed direction

Use positive status only:

- `voce ouviu antes`
- `primeiro circulo`
- `presente na estreia`

### Additional details added to the prompt

- keep these signals visible only in:
  - user profile
  - library
  - shareable cards later
- do not build toxic ranking
- do not make it competition-first

### Done means

- discovery creates pride
- listeners have a reason to come back
- status stays tasteful and non-toxic

## Cross-Block Dependencies

### Hard dependencies

- Block 1 before 3, 6 and 7
- Block 2 before 3 and 6
- Block 4 before 6
- Block 6 before 7 and 8

### Soft dependencies

- Block 5 helps 6, but does not block it
- Block 7 and 8 can overlap once `Estreia em Circulo` states exist

## Definition Of Ready

This execution cycle is ready to start when:

- the sequence is accepted
- the design direction is locked
- `Estreia em Circulo` is treated as a staged feature, not a giant one-shot build
- the team agrees that listener premium comes before backend social complexity

## Definition Of Done For The Whole Cycle

The cycle is complete when:

- Echo feels like one premium product
- Aura is the heart of discovery
- studio is easier to finish
- search is more useful
- `Estreia em Circulo` exists as a working ritual
- artist pages feel alive
- early discovery creates identity and return

## Recommended Implementation Rhythm

### Wave 1

- Block 1
- Block 2
- Block 3

### Wave 2

- Block 4
- Block 5

### Wave 3

- Block 6

### Wave 4

- Block 7
- Block 8

This is the safest and strongest order.
