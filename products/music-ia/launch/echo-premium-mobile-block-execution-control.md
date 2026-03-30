# Echo Premium Mobile Block Execution Control

## Purpose

This document is the live execution board for the large Echo mobile implementation blocks.

It translates the strategic product base into operational waves with:

- objectives
- dependencies
- work slices
- validation checks
- evidence logging rules

## Strategic Base

The active strategic source of truth is now:

- `echo-mobile-strategic-product-spec.md`

Operational sequencing remains aligned with:

- `echo-premium-mobile-grand-execution-plan.md`
- `echo-premium-mobile-prompt-sequence-execution-plan.md`

## Locked Product Truths

All blocks must stay aligned with these truths:

- Echo is where artists begin and people arrive early
- Echo is not a Spotify clone
- `Aura` is the heart of the app
- the app must keep 3 engines working together: discovery, bonding and creator utility
- the MVP priority is not breadth, but strong ritual, strong shell and low-friction circulation
- early monetization stays creator-led
- `Estreia em Circulo` and `Primeiros ouvintes` are the strongest new product layers beyond the current base

## MVP Priority Stack

The execution board must continue protecting these priorities:

1. polished persistent mini player
2. strong `Aura`
3. live-first home
4. preview separated from the main selected track
5. living artist profile
6. simplified `Studio`
7. clear professional mode
8. `Estreia em Circulo`
9. `Primeiros ouvintes`
10. total dark-premium consistency

## Deliberately Deferred

Do not let the current cycle drift into:

- listener-premium complexity
- live replay archives
- heavy audience analytics
- complex public ranking systems
- deep social backend before product behavior is proven
- competitive social mechanics too early

## Status Legend

- `ready`: sequencing is clear, but implementation has not started
- `in progress`: active implementation block
- `implemented / review pending`: shipped in code, but not yet accepted
- `validated`: implementation and checks accepted
- `blocked`: cannot proceed safely yet

## Block Map

### Block A: Identity Shell And Live-First Home

- wave: `Wave 1`
- status: `validated`
- prompts covered: `8`, `1`, `2`
- engines strengthened: `discovery`, `bonding`
- mission: make Echo unmistakably Echo in the first minute

### Block B: Creator Utility And Discovery Intent

- wave: `Wave 2`
- status: `implemented / review pending`
- prompts covered: `5`, `6`
- engines strengthened: `creator`, `discovery`
- mission: make creation lighter and discovery smarter without inflating the shell

### Block C: Core Ritual And Living Artist World

- wave: `Wave 3`
- status: `ready`
- prompts covered: `3`, `4`
- engines strengthened: `bonding`, `discovery`, `creator`
- mission: make `Estreia em Circulo` the central Echo ritual and turn the artist into a living world

### Block D: Return Memory, Legitimacy And Soft Status

- wave: `Wave 4`
- status: `ready`
- prompts covered: `7`
- engines strengthened: `bonding`
- mission: turn early discovery into return behavior, legitimate memory and lightweight identity

## Operating Rules

Every block must preserve:

- 3 tabs only: `Inicio`, `Buscar`, `Perfil`
- fixed mini player at the top
- `Aura` as the product heart
- listener-first immersion
- controlled creator access inside `Perfil`
- low-noise copy
- local-first state that can migrate later to API persistence

A block is only `validated` when:

- implementation checklist is complete
- validation checklist is complete
- the affected surfaces feel coherent as one product
- the session is logged in `workspace/planning/phase-2-build-notes.md`
## Block A: Identity Shell And Live-First Home

### Outcome

This block is accepted.

### What This Block Locked

- dark-cinematic shell direction
- mini player as the core identity object
- `Aura` before feed
- premiere lane before normal publication lane
- cleaner lower-noise hierarchy across the 3 tabs

### Evidence Already Logged

- dark-cinematic premium pivot
- signature mini player pass
- Wave 1 shell and home pass
- Wave 1 premium-perception pass 02
- Wave 1 home-distinction pass 03
- Wave 1 noise-reduction pass 04
- final validation session on `2026-03-30`

### Validation Evidence

- `npm run typecheck --workspace @northstar/echo-mobile`
- `npx expo export --platform android --clear` from `apps/echo-mobile`
- final manual read across `Inicio`, `Buscar`, `Perfil` and mini-player states

## Block B: Creator Utility And Discovery Intent

### Product Objective

Make the creator path feel short, clear and useful while making search feel like an opening into the Echo world instead of a text-only utility.

### Engines Touched

- creator engine
- discovery engine

### Entry Gate

- [x] Block A validated
- [x] no active Wave 1 cleanup still changing the shell
- [x] current creator metadata model understood before simplification

### Large Work Slice 1: Studio Information Architecture

Goal:

Turn the creator flow into a 3-step publishing path with less friction and stronger launch clarity.

Included:

- [x] freeze the 3-step structure: `Faixa`, `Classificacao`, `Lancamento`
- [x] define what stays visible in each step and what becomes staged
- [x] keep `Ao vivo` separate from normal publishing
- [x] define the release-preview object shown in `Lancamento`
- [x] define the completeness and validation states before visual polishing starts

### Large Work Slice 2: Studio Interaction Pass

Goal:

Make the creator feel speed, clarity and control.

Included:

- [x] keep title, artist name, cover, audio and preview start in `Faixa`
- [x] keep category, language, mood, entry type and AI declaration in `Classificacao`
- [x] keep publish now, schedule and `Estreia em Circulo` in `Lancamento`
- [x] reduce long-form and bureaucratic feeling
- [x] keep artist-name editing free and explicit
- [x] keep preview-cut choice clear and non-technical
- [x] add per-step checklist feedback so each stage explains what is still missing
- [x] block forward progression when the current stage is still incomplete

### Large Work Slice 3: Search Intent Foundation

Goal:

Make `Buscar` useful even before text is typed.

Included:

- [x] reshape the default search state around `Artistas`, `Categorias` and `Descoberta ao vivo`
- [x] add lightweight intent entries such as small artists, live now, premiere today, circle, dark, night, training, rising fast and experimental
- [x] keep text search fast and accent-insensitive
- [x] keep mixed results across artists, tracks, events and categories
- [x] avoid turning search into a noisy content wall
- [x] give each intent a concrete first-response result set instead of leaving empty placeholders

### Validation Checklist

- [x] `npm run typecheck --workspace @northstar/echo-mobile`
- [x] `npx expo export --platform android --clear` from `apps/echo-mobile`
- [ ] manual read: a new creator understands the 3-step flow without rescue
- [ ] manual read: `Buscar` feels useful before a term is typed
- [ ] manual read: intent shortcuts feel native to Echo discovery, not generic filters
- [ ] manual read: professional mode still feels secondary to the listener shell

### Evidence To Log

- [x] update `workspace/planning/phase-2-build-notes.md`
- [ ] create or update a creator-experience note if the Studio shape changes materially
- [ ] create or update a listener-experience note if the search shape changes materially
- [ ] update handoff and tracker docs when Block B reaches `implemented / review pending` or `validated`
## Block C: Core Ritual And Living Artist World

### Product Objective

Turn `Estreia em Circulo` into the repeatable Echo ritual and make the artist profile feel like a place where something is happening now.

### Engines Touched

- bonding engine
- discovery engine
- creator engine

### Entry Gate

- [ ] Block B validated
- [ ] premiere vocabulary frozen: `Agendada`, `Comecando`, `Ao vivo`, `Liberada`, `Encerrada`
- [ ] reminder and legitimacy assumptions defined before UI growth starts

### Large Work Slice 1: Premiere State Model

Goal:

Define and represent the full premiere lifecycle clearly.

Included:

- [ ] implement `Agendada`
- [ ] implement `Comecando`
- [ ] implement `Ao vivo`
- [ ] implement `Liberada`
- [ ] implement `Encerrada`
- [ ] ensure state changes feel automatic and clear to the user

### Large Work Slice 2: Aura Ritual Layer

Goal:

Make `Aura` materially more useful because premieres live there.

Included:

- [ ] keep the pre-release room inside `Aura`
- [ ] support preview listening, reminders, reactions, follows and saves from the ritual
- [ ] keep comments short and controlled
- [ ] keep join and leave behavior lightweight
- [ ] make the event visible in `Estreias de hoje` when relevant

### Large Work Slice 3: Living Artist World

Goal:

Make the artist profile feel alive around releases and events.

Included:

- [ ] keep the structure: hero, featured track, slim launches, reactions, live agenda, next events
- [ ] make the featured track answer `what matters now?`
- [ ] expose premiere state and recent activity without making the screen heavy
- [ ] connect reminders, live agenda and event status to artist identity

### Validation Checklist

- [x] `npm run typecheck --workspace @northstar/echo-mobile`
- [x] `npx expo export --platform android --clear` from `apps/echo-mobile`
- [ ] manual read: `Estreia em Circulo` feels like a core ritual, not a side badge
- [ ] manual read: `Aura` becomes stronger because the ritual lives there
- [ ] manual read: artist profile feels like a living world, not a static sheet
- [ ] if API contracts change, run the relevant API build and type checks too

### Evidence To Log

- [ ] update `workspace/planning/phase-2-build-notes.md`
- [ ] create a dedicated launch note for `Estreia em Circulo`
- [ ] update the relevant artist-profile note when the world model changes materially
- [ ] update handoff and tracker docs when Block C status changes materially

## Block D: Return Memory, Legitimacy And Soft Status

### Product Objective

Turn early participation into legitimate return memory and soft identity without creating toxic competition.

### Engines Touched

- bonding engine

### Entry Gate

- [ ] Block C validated
- [ ] first-listener legitimacy rules frozen enough to reuse across profile and library
- [ ] no unresolved confusion remains around premiere state language

### Large Work Slice 1: Legitimate Early-Listener Logic

Goal:

Ensure status markers mean something real.

Included:

- [ ] define minimum valid presence threshold
- [ ] define minimum listening threshold
- [ ] define required legitimate actions where needed
- [ ] define anti-abuse signals

### Large Work Slice 2: Soft Status Surfaces

Goal:

Expose early-discovery identity without turning it into a ranking obsession.

Included:

- [ ] use lightweight markers such as `voce ouviu antes`, `primeiro circulo` and `presente na estreia`
- [ ] show them in profile calmly
- [ ] show them in library where memory matters
- [ ] optionally expose them in artist context only where it stays lightweight
### Large Work Slice 3: Shareable Discovery Objects

Goal:

Prepare later natural self-promotion without forcing it too early.

Included:

- [ ] define which discovery objects can become shareable cards later
- [ ] keep them native to Echo identity
- [ ] avoid vanity spam mechanics

### Validation Checklist

- [x] `npm run typecheck --workspace @northstar/echo-mobile`
- [x] `npx expo export --platform android --clear` from `apps/echo-mobile`
- [ ] manual read: the status system feels proud, not stressful
- [ ] manual read: profile and library become more alive without becoming dashboards
- [ ] manual read: legitimacy remains stronger than superficial counting

### Evidence To Log

- [ ] update `workspace/planning/phase-2-build-notes.md`
- [ ] create a dedicated note if the status system becomes a first-class product layer
- [ ] update handoff and tracker docs when Block D status changes materially

## Current Recommended Next Step

The next correct move is:

1. review the new Block B surfaces in the running mobile preview and collect UX corrections
2. decide whether Block B can be accepted or needs one cleanup pass
3. keep Block C blocked until Block B stops moving structurally
4. keep Block D blocked until the ritual and legitimacy model become stable


