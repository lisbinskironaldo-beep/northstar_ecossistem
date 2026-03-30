# Phase 2 Build Notes

This workspace now contains the initial implementation skeleton for:

- monorepo root
- API service shell
- jobs service shell
- Echo mobile shell
- Command Center web shell
- Admin web shell
- initial database schema
- Prisma schema baseline
- generated Prisma client

Immediate build order:

1. prepare the controlled beta package
2. deepen the seed catalog for launch
3. onboard the first creators
4. start the first controlled Echo beta
5. define Phase 3 review clocks and operator rhythm

## Validation Notes

- root dependencies installed successfully
- Prisma client generated successfully
- API build passes
- API runtime boots successfully
- command center production build passes
- admin production build passes
- workspace typecheck passes
- Prisma integrated into the API
- auth baseline endpoints implemented
- creator profile baseline endpoints implemented
- Echo content ingest baseline endpoints implemented
- command center multi-route shell implemented
- Echo mobile tab shell implemented
- analytics event endpoints implemented
- Echo overview analytics endpoint implemented
- trust score endpoints implemented
- report endpoints implemented
- moderation action baseline implemented
- alert threshold baseline implemented
- Echo mobile connected to real API endpoints
- Echo track listing endpoint implemented
- recent moderation actions endpoint implemented
- admin moderation routes implemented
- admin trust and analytics summaries implemented
- admin production build still passes after operational expansion
- workspace typecheck still passes after admin operational expansion
- local PostgreSQL workflow documented
- local PostgreSQL bootstrap scripts created
- Prisma validation command stabilized with env loading
- local PostgreSQL bootstrap guardrails verified in no-Docker environment
- analytics instrumentation expanded across auth, creator, content and trust actions
- linked reports now resolve automatically when moderation actions are created
- Echo save endpoint baseline implemented
- Echo follow endpoint baseline implemented
- Echo playback endpoint baseline implemented
- Echo shell wired to save, follow and playback actions
- EXPO_PUBLIC_DEMO_USER_ID added to env example
- EXPO_PUBLIC_DEMO_CREATOR_ID added to env example
- local Echo demo seed script implemented
- Echo saved tracks listing surface implemented
- Echo followed creators listing surface implemented
- Echo upload shell stabilized with creator/category metadata
- Echo live verification script implemented
- Echo live verification document added
- Echo seeded verification checklist added
- Echo demo onboarding baseline added across shell screens
- Echo MVP gap review added
- Echo controlled beta checklist added
- native PostgreSQL 16 installed locally
- local `northstar` database created
- `.env` wired to local PostgreSQL
- Prisma schema pushed to local PostgreSQL
- Echo demo seed executed successfully against local PostgreSQL
- first live Echo verification flow completed successfully against local PostgreSQL
- admin routes validated successfully against live local data
- Echo minimal player surface implemented in the mobile shell
- Echo listener-side report action implemented in the mobile shell
- Echo live verification rerun successfully after the player/report app changes
- Echo creator setup path implemented in the upload flow
- live API smoke test passed for user registration plus creator profile creation
- Echo MVP acceptance review documented
- Echo stable web preview rebuilt as a dedicated Next.js app in `apps/echo-web`
- Echo web production build passed and local server responded on port 3010
- Echo web local demo environment configured through app-local env and verified without startup warnings
- Echo web product-facing UI pass 1 completed
- Echo web product-facing UI pass 2 completed
- Echo web product-facing UI pass 3 completed
- Echo beta ops kickoff document created
- Echo seed catalog plan created
- Echo seed catalog review sheet created
- Echo creator onboarding playbook created
- Echo creator cohort tracker created
- Echo beta operator runbook created
- Echo beta daily review template created
- Echo beta issue log template created
- Echo accepted for MVP build
- API development runtime stabilized by moving away from `tsx watch`
- live Echo seed review baseline documented from local PostgreSQL data
- live Echo creator cohort baseline documented from local PostgreSQL data
- Echo live verification rerun successfully against the stable compiled-watch API runtime
- Echo batch 01 manifest created and applied locally
- local Echo database now includes the first real internal beta catalog layer
- Echo external cohort wave 01 documented with sourcing and outreach material
- first public external creator shortlist documented for Wave 01
- Echo web preview updated to separate listener entry and creator entry more clearly
- Echo web listener mode improved again with stronger artist discovery framing
- Echo beta readiness gates documented
- Echo beta week-01 plan documented
- public shortlist reviewed into a practical priority order for outreach
- first outreach execution sheet documented
- Echo mobile local phone testing path documented and prepared
- Echo mobile upgraded from Expo SDK 52 to SDK 54
- repository architecture documented and folder boundaries expanded for future fronts

## Functional Testing Note

The auth, creator, content, analytics and trust endpoints are implemented and compile successfully.

The local PostgreSQL workflow is now validated through a native PostgreSQL 16 install on this machine, including:

- Prisma push
- demo seed
- live Echo request chain
- trust reads
- analytics reads

## Known Environment Note

Next.js falls back to `@next/swc-wasm-nodejs` on this Windows environment because the native `@next/swc-win32-x64-msvc` binary is not loading correctly.

This is currently non-blocking because builds still complete successfully.



## 2026-03-27 - Architecture And Objective Consolidation

- formalized the Echo account-and-multi-artist model
- formalized the Echo sensitive-content access model
- linked both models back into ecosystem and platform architecture
- updated Echo objective planning to reflect multi-artist and sensitive-access priorities

## 2026-03-27 - Echo Objective Block Implementation Start

- extracted the creator area into a dedicated `CreatorWorkspace` component
- separated creator experience into workspace, artists and release-room layers
- added a visible listener exclusion center to the Echo web preview
- added hide-track and mute-artist controls as the first negative-taste layer

## 2026-03-27 - Sensitive Access First Pass

- added `accessRoom` to the track model in Prisma and backend content flow
- release creation now classifies tracks into a room at upload time
- main listener feed now stays standard-only by default
- explore now exposes separated rooms through explicit listener activation

## 2026-03-27 - Negative Taste And Library Surfaces

- listener category rejection now affects visible feed selection through hidden and deprioritized category states
- Echo track responses now expose `primaryCategory` to the web product surface
- added a dedicated `ListenerLibrary` component to keep library product logic out of the main shell
- Echo web now includes first-pass private, public, borrowed and shared library surfaces
- this block is validated by `npm run typecheck` and `npm run build:echo`

## 2026-03-27 - Session Signal First Pass

- listener session ordering now reacts to save, follow and playback events
- short plays now reduce track/category weight while stronger plays increase future session priority
- save and follow actions now reinforce category and creator signals in the web preview
- this block is validated by `npm run typecheck` and `npm run build:echo`

## 2026-03-28 - Growth And Self-Sufficiency Consolidation

- documented the survival-first growth model for the ecosystem
- documented Echo organic growth through artist pages, public libraries and shareable discovery
- documented the low-cost sidecar rule: utility-first, not a second heavy content feed
- documented live audio as a later ephemeral layer instead of an early storage-heavy feature
- locked the strategic split: listener-mobile first, creator-web first

## 2026-03-28 - Future Agency And Distribution Layer

- documented a future selective agency and distribution branch for standout creators
- kept that layer explicitly outside the base Echo promise
- placed the future branch inside the ecosystem talent engine, not inside the basic upload flow

## 2026-03-28 - Shareable Surfaces And Local Carryover

- added local browser persistence for listener memory states
- added public artist page route in the Echo web app
- added public library page route in the Echo web app
- linked the main listener experience to those shareable surfaces
- validated with `npm run typecheck`, `npm run build:echo` and `npm run build:api`

## 2026-03-28 - Repeated Skip Memory And Persistent Library Behavior

- extracted listener memory into a dedicated web library module
- extracted persistent library state into a dedicated web library module
- added repeated short-session carryover by track, creator and category
- repeated skip patterns now reduce similar lines across reloads instead of only inside one view
- library now persists public folder assignment, offline-ready picks, shared picks and borrowed creators
- the public library page now reflects curated public folders instead of only auto-grouped saves
- validated with `npm run typecheck`, `npm run build:echo` and `npm run build:api`

## 2026-03-28 - Seed Batch 02 And Creator Slot Visibility

- added a second real seed manifest for Echo with 6 creators and 18 tracks
- expanded seed coverage for kids, parody, clone-inspired and explicit rooms
- applied batch 02 successfully to local PostgreSQL
- live Echo verification still passed after the larger seed layer
- creator workspace now shows active, cold and dormant release counts
- creator workspace now exposes account-level slot policy in the product surface
- validated with `npm run typecheck`, `npm run build:echo`, `npm run seed:echo:batch-02` and `npm run verify:echo:demo`

## 2026-03-28 - Repeat Publishing And Scale-Safe Growth Notes

- extracted creator release-state logic into a dedicated helper module
- added quick publish actions for the creator flow
- added reuse-latest-release template behavior inside the release room
- setup can now be skipped more naturally once the workspace already has a creator
- documented scale-safe evolution boundaries so future growth can add layers without collapsing current structure
- validated with `npm run typecheck` and `npm run build:echo`

## 2026-03-28 - Creator Next-Action Feedback

- extended creator workspace helpers to produce focus cards and per-track advice
- release room now gives next-action guidance instead of only raw slot counts
- repeat-publishing loop is now represented as a product behavior, not only documentation
- validated with `npm run typecheck` and `npm run build:echo`

## 2026-03-28 - Creator Beta Readiness Feedback

- added beta-readiness status and checklist items for the selected persona
- connected creator workspace guidance to the intake logic used by beta operations
- updated beta docs and cohort tracker to match the product-facing readiness bar
- validated with `npm run typecheck` and `npm run build:echo`

## 2026-03-28 - Creator Week 01 Pulse

- added first-pass week-one creator metrics inside the workspace
- added creator goal and operator watchlist for first-wave onboarding
- documented the minimal creator-side metrics for beta week one
- aligned the week-one plan and intake checklist with the new pulse model
- validated with `npm run typecheck` and `npm run build:echo`

## 2026-03-28 - Public Track Surface

- added a dedicated public track route in the Echo web app
- added backend support for single-track reads
- linked feed, public artist and public library surfaces back into the public track page
- documented the public track surface as part of Echo's cheap sharing model
- validated with `npm run typecheck`, `npm run build:echo` and `npm run build:api`

## 2026-03-28 - Creator Onboarding State Model

- documented accepted versus onboarded as separate operational states
- expanded the creator cohort tracker to capture invite, acceptance, intake and week-one pulse
- aligned outreach execution and operator runbook with the new state transitions
- this block is documentation and operator-logic focused; no new code validation was required

## 2026-03-28 - Onboarding Path In Product

- added onboarding-state label and onboarding-path steps inside the creator workspace
- release room now reminds the creator that accepted is not yet onboarded
- aligned intake docs and launch checks with the product-facing onboarding path

## 2026-03-28 - First-Wave Onboarding Pack

- documented the founder sequence for the first real creator wave
- documented the accepted-creator packet
- documented rescue boundaries so product friction is not hidden by hand-holding
- aligned the daily review template and runbook with accepted-versus-onboarded tracking

## 2026-03-28 - Creator Week 01 Scorecard

- documented a per-creator week-one scorecard template
- linked the scorecard into the runbook and daily review flow
- marked week-one live reading as a concrete operational artifact, not only a future idea

## 2026-03-28 - Listener Feed Engine Extraction

- extracted listener feed scoring and feed assembly into a dedicated Echo web module
- kept reserve-track and separated-room selection inside the same feed engine layer
- reduced logic density inside the main Echo shell without changing the product shape

## 2026-03-28 - Mobile Expo Bootstrap Alignment

- changed the Echo mobile entry point to a standard Expo `index.js`
- removed the unused expo-router plugin from app config
- revalidated Android export against the new mobile bootstrap path

## 2026-03-28 - Mobile React Version Realignment

- aligned the Echo mobile workspace back to a single React version
- confirmed `react` and `react-dom` now resolve consistently for the mobile workspace
- revalidated Android export after the React tree cleanup

## 2026-03-28 - Mobile LAN API Auto-Refresh

- confirmed the latest mobile failure was caused by a stale LAN IP in the Echo mobile env file
- added a dedicated LAN startup script that resolves the current active IPv4 address before Expo starts
- the LAN startup path now rewrites the mobile API base URL automatically for the current network

## 2026-03-28 - Mobile Clean Listener And Professional Split

- replaced the old four-tab shell with a cleaner `Inicio`, `Buscar` and `Perfil` structure
- moved the professional path behind the profile mode switch
- reshaped the mobile home screen around a single focus track, world cards and fixed picks
- reshaped mobile explore into artists, categories, moments and outside-catalog worlds
- replaced the raw upload screen with a structured creator workspace that captures release metadata

## 2026-03-28 - Mobile Social Feed And Fixed Player

- turned the mobile home into a social release feed instead of a technical list
- added a clean `seguindo` versus `descobrir` feed switch
- added a fixed slim player dock so the selected release persists while navigating
- kept the feed muted while scrolling so listening still starts by user choice

## 2026-03-28 - Mobile Feed Preview And Artist Profile Layer

- limited the main mobile feed to the 20 most recent releases at once
- changed feed playback to a twenty-second preview instead of the full selected track
- made feed preview pause the fixed player without clearing the preserved full-track selection
- added a slim artist profile view with the clicked release already preselected
- added first-pass scheduled show and live-radio visibility inside the artist profile

## 2026-03-28 - Premium Mobile Direction

- documented a premium mobile roadmap for Echo
- grounded that roadmap in official reference patterns from SoundCloud feed behavior, Spotify artist/event surfaces and YouTube artist-home structure
- kept the premium direction explicitly tied to low-cost survival and scale-safe growth

## 2026-03-28 - Mobile Audio Foundation

- added a first real audio foundation to Echo mobile using `expo-av`
- exposed `ContentAsset` summaries in Echo track reads from the API
- added local static media serving through `/media/*` in the API runtime for internal validation
- added pooled local sample audio assets to the second Echo seed batch and backfilled them into already existing tracks
- moved mobile playback state into a dedicated `use-echo-audio-player` hook so future player growth does not spread logic across screens
- updated creator mobile metadata capture so preview cut now defaults to `00:20`
- validated with `npm run seed:echo:batch-02`, `npm run build:api`, `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-28 - Premium Artist Home And Ecosystem Horizon

- extracted a stronger mobile artist home into its own dedicated component
- gave the artist home a featured release, launch list, lightweight reactions and live timeline
- kept the fixed-player selection preserved while navigating the artist home
- added a subtle horizon strip so Echo shows that Pulse and Lumen exist without adding dead listener tabs
- reused the same horizon logic differently for listener and creator surfaces to stay aligned with the ecosystem plan
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-28 - Social Memory And Live Scheduling Layer

- added a dedicated persisted community-state layer for Echo mobile with AsyncStorage
- mobile artist homes now keep likes, Echo emojis, short comments and live reminders between sessions
- mobile creator workspace now supports lightweight persistent live-plan scheduling per creator persona
- artist-home timelines now merge those creator live plans back into the listener-facing surface
- kept the whole layer local and isolated so backend socialization can happen later without collapsing the mobile shell
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-28 - Refined Premium-Mobile Procedure

- documented a staged execution procedure for the next Echo mobile premium cycle
- checked that procedure against the current project base instead of planning in the abstract
- anchored the procedure to official product signals from SoundCloud, Spotify and YouTube
- made the procedure explicit about what stays in app, what belongs later in service/platform and what must not be overbuilt now
- updated launch checks and handoff so the next block can continue without rereading the whole conversation

## 2026-03-29 - Backend-Ready Social Boundary And Front Reuse

- documented the backend-ready migration boundary for Echo mobile social memory, reminders and creator live plans
- recorded explicit payload shapes so future API persistence can mirror current local state without redesigning the mobile shell
- documented which premium-mobile patterns are reusable across Echo, Pulse and Lumen and which ones stay music-specific
- marked the premium visual polish and feed-level live visibility cycle as completed in the Echo launch checklist

## 2026-03-29 - Mobile Social Readability Pass

- tightened the social treatment of mobile feed cards with compact state chips instead of loose text rows
- tightened artist-home social summary, reminder visibility and comment readability
- kept the product audio-first and low-noise while making the community layer feel more alive
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Storage-Backed Asset Path Preparation

- separated preview and full-track asset roles more clearly in the mobile playback model
- updated the second Echo seed batch so existing tracks now backfill dedicated `audio_preview` assets
- updated the API media decoration so the same mobile contract can consume either local media paths or direct remote URLs later
- documented the migration path from local sample media toward creator-backed or storage-backed assets
- validated with `npm run seed:echo:batch-02`, `npm run build:api`, `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Live-First Mobile Home

- kept the slim fixed player directly below the top shell
- moved the listener home to a live-first structure with a capped live-radio carousel
- pushed friend and discovery updates into a second-layer batch flow instead of the first screen surface
- added a dedicated live-room surface with lightweight interactions and quiet navigation to next or dismiss
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`
- refined live cards into slimmer horizontal strips and changed live-room expansion to happen inline on the same home screen
- renamed the live-audio layer in-product to `Aura`
- moved the main mobile navigation to the bottom and kept the player fixed near the top

## 2026-03-29 - Global Search Screen Rebuild

- rebuilt the second mobile screen as a true global-search layer
- added one main search field with accent-insensitive matching across artist, track and category language
- reduced the major entry points to only `Artistas` and `Categorias`
- made artist and category discovery render as compact three-per-row grids
- removed redundant borrowed-library, professional and ecosystem blocks from the second screen
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Search Tab Alignment Pass

- fixed the second tab so bottom-nav entry now opens in a neutral default state instead of inheriting an older subsection
- removed extra framing so the screen now shows only the global field and two major blocks first
- kept artist and category drill-down behind explicit tap instead of mixing them into the default state
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Profile Pulse And Creator Gate

- rebuilt the third mobile screen around a quieter listener profile pulse instead of a stack of loose cards
- added one main listener stats block with a fairer level system that rewards steady use over raw spam
- moved the professional mobile entry to a plan-first flow with locked creator acceptance before opening management
- lowered the free creator mobile tier to 1 active artist and 6 active tracks for a lighter self-sufficient start
- kept artist management behind a separate `Gerenciar artistas` entry so the profile itself stays lighter
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Creator Flow Payment And Split Refinement

- paid creator tiers now open a dedicated payment step before the plan is treated as changed
- creator management now separates `Studio` from `Ao vivo` instead of mixing live scheduling into the upload form
- the release form now keeps artist name fully editable and no longer auto-suggests the public release name
- scheduled release defaults to at least one week ahead in the mobile flow
- the preview cut now uses a start-point selector instead of a raw manual text field
- `Observacoes` was replaced by distinct `Coautoria` and `Compositor` fields
- the fixed player was tightened into a slimmer dock with previous, play-pause and next controls
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Slim Player Control Cleanup

- removed previous and next from the slim fixed player
- kept only play-pause in the slim state so title, artist and cover breathe better
- moved previous and next up into the expanded player instead
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Cut-Glass Visual Language Pass

- replaced the generic rounded-card language with a cut-corner block system across the main mobile UI kit
- added slim top accents to the main block family and action surfaces
- pushed the palette toward pastel green, pastel blue and glassy contrast instead of flat white cards
- aligned the feed cards, live strips, library blocks, search tiles, player pieces and bottom navigation with the same visual family
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Slim Player Premium Rebalance

- rebuilt the slim fixed player away from the heavy dark-block look
- enlarged the left cover square and made play-pause the dominant slim action
- separated expansion into its own lighter control so it no longer competes with playback
- moved the dock toward semi-transparent glass with darker text for stronger readability
- kept previous and next only in the expanded state
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Search And Profile Consistency Cleanup

- removed leftover rounded white controls from the search screen and profile screen
- aligned search field, result tiles, back controls, profile metrics, plan cards and profile rails with the cut-glass rule
- kept flow behavior intact while reducing the feeling of mixed visual systems
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Grand Premium-Mobile Execution Planning

- documented the full premium-mobile execution plan for Echo with diagnosis, external product signals, visual identity and architectural staging
- defined Hero, Lane and Utility as the three allowed mobile surface families
- defined the Echo premium color direction around sea-glass, pale sky, cool mint and dark-ink text
- recorded which parts belong to app, mobile state, API, platform and ops so the premium pass stays scale-safe
- updated roadmap, checklist, work plan, README and handoff continuity around this new premium master plan

## 2026-03-29 - Dark-Cinematic Premium Pivot

- updated the premium mobile master plan to reflect a darker and more distinctive listener-shell identity
- locked the fixed mini player as Echo's signature object: half-moon / oval, ultra-slim, translucent dark glass, blue-violet neon restraint
- updated the cut-glass visual language and roadmap so the next premium pass no longer drifts back toward a generic light pastel app

## 2026-03-29 - Signature Mini Player And Dark Shell Pass

- documented the first execution block for the signature mini player and dark listener shell
- rebuilt the fixed top player into a more oval dark-glass object with integrated cover, stronger play control and separate expand control
- darkened the bottom navigation and aligned it with the same blue-violet premium family
- moved the listener home, release cards, Aura strips, library blocks and horizon strip closer to the same dark-cinematic shell
- kept build safety by preserving the existing audio and state boundaries while only changing the visual/presentation layer
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Prompt-Sequence Premium Execution Planning

- turned the approved 8 premium-mobile prompts into one formal execution plan
- grouped that sequence into 4 waves: shell and hierarchy, creator path and search, core ritual, retention and identity
- locked `Estreia em Circulo` as the central Echo ritual instead of treating it as a side feature
- documented dependencies, architecture ownership, risks and definition of done for each block
- updated roadmap, objectives, checklist, tracker, handoff and README so the next large implementation wave can start without ambiguity

## 2026-03-29 - Wave 1 Shell And Home Pass

- executed the first implementation pass of Wave 1 from the prompt-sequence plan
- refined the bottom shell and the signature mini player without breaking audio/state boundaries
- reorganized the listener home into `Aura agora`, `Estreias de hoje`, `Novas publicacoes`, `Biblioteca` and `novidades`
- gave Aura cards clearer event semantics: source, type, timing and CTA
- added a dedicated premiere lane to prepare the product for `Estreia em Circulo`
- rebalanced release cards, library tiles and horizon strip into the darker premium family
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Wave 1 Premium Perception Pass 02

- darkened and aligned the global search screen with the same cinematic listener shell
- darkened and aligned the profile screen, including mode switch, pulse card, plan cards and manager controls
- darkened and aligned the artist stage so featured release, launches, reactions and agenda no longer feel like a separate theme
- added dark-aware support to `TinyStatus` so micro-metrics remain readable inside premium glass surfaces
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Wave 1 Home Distinction Pass 03

- separated `Estreias de hoje` from the normal release feed by giving it a dedicated event-card surface
- shortened home copy again so Aura, premieres, publications and library explain themselves more through structure
- tightened the expanded Aura panel so it reads more clearly as live signal and less like another release card
- kept the normal publication cards as the longer-form release surface while premieres now feel event-first
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-29 - Wave 1 Noise Reduction Pass 04

- removed one more helper line from the normal publication cards
- kept premieres compact and event-first instead of explanatory
- removed repeated `biblioteca` labeling from every library tile and replaced it with quieter internal glow treatment
- turned the ecosystem horizon from a card deck into a slimmer ribbon so the lower home feels less repetitive
- validated with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

## 2026-03-30 - Premium Mobile Block Execution Control

- created a dedicated large-block execution control board for the 8-prompt Echo mobile cycle
- mapped the official prompt order into 4 operational blocks: shell/home, creator/search, core ritual, retention/status
- marked Block A as implemented but still pending final acceptance checks across tabs and mini-player transitions
- marked Blocks B, C and D as sequenced with explicit entry gates, implementation checklists, validation checklists and evidence logging rules
- linked the new control board from the canonical prompt-sequence execution plan so future work can be resumed from one operational document

## 2026-03-30 - Block A Validation And Block B Opening

- validated Block A after a final manual consistency read across `Inicio`, `Buscar`, `Perfil` and the mini-player states
- confirmed `npm run typecheck --workspace @northstar/echo-mobile` passes for the current mobile shell
- confirmed `npx expo export --platform android --clear` passes when run from `apps/echo-mobile`
- clarified that the earlier root-level Expo export failure was a monorepo invocation issue, not a Block A product failure
- marked Block A as `validated` in the large-block execution control board
- opened Block B as the active mobile implementation wave with Studio simplification and search-intent work as the first practical slice
- updated the prompt-sequence plan, handoff and execution tracker so the next session resumes from Wave 2 instead of repeating Wave 1 checks

## 2026-03-30 - Strategic Planning Refresh From Consolidated Product Direction

- audited the current Echo mobile planning base against the updated consolidated product definition
- found the existing plan partially aligned but missing some now-central decisions: the 3 product engines, formal MVP priority stack, deliberate deferrals, the `Comecando` premiere state and stronger legitimacy rules for `Primeiros ouvintes`
- created a new strategic source-of-truth spec for Echo mobile covering positioning, engines, MVP priorities, ritual states, Aura, home/search/profile/studio rules, monetization boundaries, visual system and execution doctrine
- rewrote the large-block execution control board so every wave now maps explicitly to the updated product base instead of relying on implied direction
- linked the strategic spec into the grand execution plan and prompt-sequence plan so future planning and implementation stay anchored to the same base

## 2026-03-30 - Block B First Implementation Slice

- implemented the first real Wave 2 slice across the mobile Studio and search surfaces
- turned the Studio into a staged 3-step flow: `Faixa`, `Classificacao` and `Lancamento`
- added explicit step progress, per-step staging, completeness checks and a launch-preview card inside the final stage
- kept `Ao vivo` conceptually separate while making `Estreia em Circulo` a first-class launch mode in the Studio flow
- redesigned `Buscar` to open through `Artistas`, `Categorias` and `Descoberta ao vivo` plus intent-led discovery shortcuts
- added lightweight discovery intent entries for small artists, live now, premiere today, circle, night, training and experimental
- kept text search accent-insensitive while mixing artists, tracks, events, categories and intent entries into one result layer
- validated this first Block B slice with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`
- marked Block B as implemented pending review in the large-block execution board so the next step is product review instead of re-opening Wave 1
## 2026-03-30 - Block B Refinement Pass

- completed a second Block B pass to make the Wave 2 surfaces feel more intentional instead of just structurally present
- finished the remaining search-intent routes by wiring `dark` and `subindo rapido` to concrete result sets inside `Buscar`
- kept the search experience lightweight while ensuring every visible intent now has a meaningful first response from the current data base
- hardened the Studio progression so a creator cannot advance to the next stage without closing the current one first
- added per-stage checklists in `Faixa` and `Classificacao` so missing pieces are explained inside the flow instead of only at submit time
- tightened final submit validation so incomplete track setup returns the creator to the right stage instead of failing late
- validated the refinement pass with `npm run typecheck --workspace @northstar/echo-mobile` and `npx expo export --platform android --clear`

