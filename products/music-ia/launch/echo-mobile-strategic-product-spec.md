# Echo Mobile Strategic Product Spec

## Purpose

This document is the updated strategic source of truth for Echo mobile.

Use it to decide:

1. what Echo mobile is
2. what Echo mobile is not
3. what must exist in the MVP
4. what must wait
5. how the large execution blocks should be sequenced

This file now guides:

- `echo-premium-mobile-grand-execution-plan.md`
- `echo-premium-mobile-prompt-sequence-execution-plan.md`
- `echo-premium-mobile-block-execution-control.md`

## Product Positioning

Echo mobile must not be treated as `Spotify for AI music`.

That can help internally as a rough reference, but it must not become product identity.

The correct positioning is:

- Echo is where emerging artists begin
- Echo is where listeners arrive early
- Echo is the place where sounds start circulating before the rest of the market notices

Echo does not compete on:

- giant catalog size
- mainstream artist concentration
- mature platform breadth

Echo does compete on:

- early discovery
- live momentum
- lightweight social proximity
- artist emergence
- first-circulation energy
- a distinct identity that does not feel like a clone

## Product Guide Phrase

`Echo is the place where artists begin and people arrive early.`

## Strategic Core

The core of Echo mobile is:

`live discovery of emerging artists`

That core is reinforced by:

- `Aura`
- live radio
- scheduled premieres
- social preview behavior
- a living artist world
- a simple creator flow
- a persistent mini player as the main identity object

## The Three Required Engines

Echo mobile must ship with three structural engines working together.

### 1. Discovery Engine

Includes:

- `Aura`
- live-first home
- release feed
- search
- artist profile
- categories and fast-entry discovery

### 2. Bonding Engine

Includes:

- follow artist
- save track
- persistent main track in the mini player
- `Estreia em Circulo`
- `Primeiros ouvintes`
- reminders
- library memory

### 3. Creator Engine

Includes:

- `Studio`
- professional mode
- plans
- artist management
- live agenda
- lightweight publishing
- first circulation and featured launch paths

If these three engines are not present, the app may look good but still lack product sustainability.

## MVP Priorities

The Echo mobile MVP should prioritize:

1. polished persistent mini player
2. strong `Aura`
3. live-first home
4. preview separated from the main selected track
5. living artist profile
6. simplified `Studio`
7. clear professional mode
8. `Estreia em Circulo`
9. `Primeiros ouvintes`
10. total dark-premium visual consistency

## Deliberately Too Early

These ideas are valid, but should stay out of the early Echo mobile phase:

- premium listener complexity
- live replay archives
- advanced audience analytics
- multiple paid listener layers
- complex social ranking
- heavy competitive mechanics
- deep social backend too early
- sophisticated reputation systems in the first phase

Early monetization should stay creator-led.
## Central Gold Feature

The strongest new product layer is:

- `Estreia em Circulo`
- supported by `Primeiros ouvintes`

This is the most important addition outside of what already exists.

## Estreia em Circulo

### Definition

A track does not enter only as a cold publication.
It enters as a lightweight live event inside `Aura` and the artist ecosystem.

### Concept Structure

- artist schedules a premiere
- before full release, the track lives as an event
- listeners enter the premiere room
- listeners hear the preview
- listeners react
- listeners leave short controlled comments
- listeners follow the artist
- listeners save the track
- listeners set a reminder
- when the release time arrives, the state changes automatically

### Required States

The premiere flow must use these states:

1. `Agendada`
2. `Comecando`
3. `Ao vivo`
4. `Liberada`
5. `Encerrada`

### State Rules

`Agendada`

- visible in `Aura`
- visible in the artist profile
- eligible for `Estreias de hoje`
- user can set a reminder

`Comecando`

- short warmup state
- visible countdown pressure
- stronger visibility than a normal scheduled state

`Ao vivo`

- live preview room
- fast reactions
- short controlled comments
- lightweight join and exit

`Liberada`

- full track now available
- card changes state automatically
- full listening path opens

`Encerrada`

- premiere is over
- event memory remains
- participation markers can persist

### Why This Feature Matters

It unifies:

- discovery
- event energy
- belonging
- exclusivity
- social proof
- return motivation
- creator invitation power
- product memorability

The target feeling is:

`I took part in the beginning.`

## Primeiros Ouvintes

### Definition

`Primeiros ouvintes` marks people who legitimately participated early in a track or artist rise.

### Example Language

- `voce ouviu antes`
- `presente na estreia`
- `primeiro circulo`
- `um dos primeiros`
- `descoberta pioneira`

### Initial Surfaces

This should initially appear only in:

- listener profile
- library
- eventually the artist profile
- lightweight track history

Do not begin with heavy ranking systems.

### Legitimacy Rules

The system must protect against:

- fraud
- spam
- automation
- fake engagement
- superficial counting

A minimum valid marking should require a combination of:

- meaningful presence time
- minimum listening threshold
- at least one legitimate action such as save, reminder or controlled interaction
- anti-abuse signals

## Aura

`Aura` is the heart of Echo.

Its job is to:

- open discovery
- create a sense of a living flow
- carry live radio
- host premieres
- show drops
- signal lightweight shows
- mix personal-circle and global activity
- make Echo feel more alive than a static feed

### Aura Card Types

- `radio`
- `estreia`
- `drop`
- `show`

### Minimum Information Per Aura Card

- artist name
- handle
- session type
- source: `do seu circulo` or `global`
- live count
- remaining time or temporal status
- clear CTA: `entrar`, `lembrar` or `abrir artista`

### Aura Behavior

Aura must:

- stay inside home, not become a separate tab
- remain compact first, expandable second
- support dismissing or advancing
- reinforce the feeling of a living product
## Home Structure

`Inicio` remains the main product entry.

The macro order is:

1. fixed mini player
2. short Echo identity intro
3. `Aura agora`
4. `Estreias de hoje`
5. `Novas publicacoes`
6. library shortcuts
7. ecosystem horizon
8. bottom navigation

### Home Rule

Home must be `live-first`.

It must not feel like:

- a cold list
- a catalog wall
- bureaucratic scrolling

It must feel:

- alive
- moving
- early
- close to artist circulation

### New Publications Lane

The release feed still matters, but it is no longer the conceptual top of the product.

Current baseline remains valid:

- 10 items per batch
- prioritize followed artists
- complete with recent global items
- keep preview separate from the main selected track

### Library On Home

The library should behave like a product layer, not only a saved-items list.

Current base surfaces remain valid:

- `Privadas`
- `Compartilhadas`
- `Emprestadas`
- `Minhas publicacoes`

## Search

Search must stay global, but it cannot depend only on text.

### Text Search Still Matters

It must still cover:

- artist
- track
- category
- catalog terms

with:

- normalization
- accent-insensitive matching
- fast reading

### Intent Search

Search must also add lightweight guided intent such as:

- artistas pequenos
- ao vivo agora
- estreia hoje
- dark
- treino
- noite
- experimental
- do meu circulo
- subindo rapido

This should start light.
No heavy AI is required now.

### Empty Search State

When the user has typed nothing, `Buscar` must show quick entry for:

- `Artistas`
- `Categorias`
- `Descoberta ao vivo`

## Profile

The two-profile-mode structure remains valid and differentiating:

- `Ouvinte`
- `Profissional`

### Listener Mode

The `Seu pulso` block remains valid.
It should show:

- clean account summary
- usage
- library
- followers
- favorites
- level

The level system should remain light, not aggressively competitive.

### Professional Mode

Professional mode must feel more like:

- a tool
- an operational flow
- a controlled creator workspace

and less like:

- one giant form
- mixed surfaces
- a generic panel

## Studio

`Studio` must be simplified into 3 steps.

### Step 1: `Faixa`

- title
- public artist name
- cover
- audio
- preview start point for the 20-second cut

### Step 2: `Classificacao`

- category
- language
- mood
- entry type
- AI declaration
- other essential classifications only

### Step 3: `Lancamento`

- publish now
- schedule
- launch as `Estreia em Circulo`
- release state visibility
- completeness check
- visual preview of the feed card when helpful

### Simplification Goal

The creator should feel:

- speed
- clarity
- control
- low friction

Avoid:

- bureaucratic feeling
- abandonment through overload
- too many fields visible at the same time

## Live Layer

The split between `Studio` and `Ao vivo` remains correct.

`Ao vivo` exists for:

- radio
- show
- drop

It must not be merged into normal track upload.
## Artist Profile

The artist profile remains a `mini-world`.

### Macro Structure

1. artist hero
2. featured track
3. slim launches
4. reactions
5. live agenda
6. next events

### Hero

- name
- handle
- short bio
- social signals
- follow CTA
- lightweight reactions

### Featured Track

This answers:

`what matters now for this artist?`

It should show:

- current focus track
- short description
- category
- access type
- social signal
- premiere status when relevant

### Live Agenda

This remains essential and should show:

- radio
- show
- drop
- reminders
- activity status

## Monetization

Early monetization should focus mainly on the creator side.

Do not prioritize yet:

- strong listener premium layers
- multiple paid audience perks
- complex consumption monetization

Prioritize on creator side:

- free plan
- intermediate plan
- premium creator plan
- more artists
- more active tracks
- featured launch capacity
- featured premiere capacity
- creator-priority utilities

A payment UX can exist before the real payment gateway is wired.

## Product Self-Sufficiency

Echo becomes self-sustaining when three loops reinforce each other.

### Listener Loop

enter -> discover -> react -> save -> follow -> return for premieres

### Artist Loop

upload -> schedule premiere -> bring people -> gain social signals -> return to launch again

### Growth Loop

artist invites people -> people discover other artists -> people return -> a network effect begins

## Natural Self-Promotion

Echo should later support naturally shareable objects such as:

- premiere cards
- `voce ouviu antes` cards
- `agora no Aura` cards
- premiere deep links
- artist deep links
- launch-track deep links

This is not the first implementation priority, but the product should be designed so these objects make sense later.

## Risk And Care Points

### Premiere moderation

`Estreia em Circulo` needs lightweight moderation:

- short comments
- cooldowns
- simple control
- fast reactions
- anti-spam handling

### First-listener legitimacy

`Primeiros ouvintes` must require real presence, not passive inflation.

### Future distribution clarity

If future external distribution becomes a layer later, it must stay clearly separate from the present Echo promise.

## Visual Direction

Echo mobile must move toward one coherent dark-premium system.

It should feel:

- dark cinematic
- premium
- glass-based
- softly glowing
- blue-violet accented
- deep
- elegant rather than gamer-aggressive

It must not feel like:

- a Spotify clone
- a generic dashboard
- an overly cyberpunk interface
- a soulless startup utility shell

## Color Direction

Use this direction:

- primary background: `#060816`, `#070B1A`, `#08101D`
- secondary background: `#0B1224`, `#0E152A`, `#10182E`
- dark surfaces: `rgba(14, 22, 40, 0.82)`, `rgba(12, 18, 34, 0.88)`
- elevated surfaces: `#121C33`, `#14203A`
- electric blue: `#37B8FF`, `#45C2FF`
- neon violet: `#8E5CFF`, `#9B6DFF`
- bridge blue-violet: `#5E7BFF`
- controlled success green: `#67D6A3`
- occasional magenta: `#FF5CA8`
- primary text: `#F3F7FF`
- secondary text: `#A9B4C9`
- tertiary text: `#7C879D`
- inactive text: `#5E667A`

Keep gradients restrained and glow selective.
## Mini Player

The mini player is the main visual identity object of Echo mobile.

### Position

- fixed at the top
- below safe area
- above content
- always present

### Shape

It must read as:

- slim oval
- slim half-moon object
- wide and refined
- not a generic rectangular bar
- not a generic capsule with no identity

### Material

- dark translucent glass
- blur when appropriate
- soft highlight
- controlled glow
- thin illuminated edge

### Slim State Content

- integrated cover art
- track title
- artist name
- main play/pause action
- expand action
- thin progress bar

### Behavior

- stores the main selected track
- feed preview never replaces the main selected track
- preview may pause the main track, but does not steal its slot
- expansion must feel like the same object evolving

## Expanded Player

The expanded player must keep the DNA of the slim player.

It should contain:

- larger cover
- full timeline
- play/pause
- previous / next
- shuffle
- repeat
- premium background treatment from the same material family

## Typography, Borders And Glow

Typography should feel:

- modern
- premium
- clean
- light
- digital but human

Use:

- strong but not excessive headlines
- small uppercase only for short labels
- slightly open tracking for labels
- good spacing between blocks

System rules:

- large surfaces use medium or high radius consistently
- chips use medium radius
- borders stay thin and low-contrast
- cut-corner usage stays rare and consistent
- shadows remain atmospheric, not heavy
- glow remains soft and selective

## UX Rule

Every screen must answer four things clearly:

1. what is the primary focus?
2. what is the primary action?
3. what is secondary?
4. what can stay hidden, expanded or staged?

## Emotional Target

Echo should make the user feel:

- discovery
- proximity
- soft exclusivity
- beauty
- participation
- being early
- positive curiosity
- identity
- movement
- natural return

Echo should avoid:

- toxicity
- heavy competition too early
- purpose confusion
- visual pollution
- generic social-network behavior with music on top

## Large Execution Doctrine

The correct large execution order remains:

1. lock identity and shell coherence
2. strengthen creator utility and discovery intent
3. build the central ritual and the living artist world
4. add lightweight status, return memory and later shareable objects

This sequencing matters because:

- shell chaos must be removed before feature depth
- creator and search structure must settle before the ritual grows
- the ritual must exist before status systems become meaningful
- shareable identity should come after real participation exists
