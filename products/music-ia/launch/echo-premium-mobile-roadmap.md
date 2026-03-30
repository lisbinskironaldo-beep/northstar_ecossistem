# Echo Premium Mobile Roadmap

## Purpose

This document turns the new mobile direction into a premium product roadmap for Echo.

It keeps the product grounded in:

- low-cost survival
- listener simplicity
- creator-web separation
- social music behavior
- scale-safe growth

It also records the external product patterns being reused on purpose.

The refined execution order for the next premium cycle lives in:

- `echo-premium-mobile-execution-procedure.md`
- `echo-premium-mobile-grand-execution-plan.md`
- `echo-premium-mobile-prompt-sequence-execution-plan.md`

## Premium Direction

Echo should not look like a rough internal system.

It should feel like:

- a premium music app
- a lightweight social music network
- a discovery product with taste
- a calm interface with strong surfaces
- a dark-cinematic music object with its own visual signature
- a live-first discovery ritual centered on `Aura` and `Estreia em Circulo`

Not like:

- an admin dashboard
- a raw data wall
- a generic clone of Spotify or TikTok

## External Reference Signals

### SoundCloud

Official reference:

- SoundCloud Help Center, Feed for Artists  
  https://help.soundcloud.com/hc/en-us/articles/18440849363867-Feed-for-Artists

What matters:

- mobile feed split between `Discover` and `Following`
- artwork shown directly in feed
- preview clip chosen for feed use
- feed meant to keep fans updated with followed artists

Echo-specific inference:

- our mobile home should keep `seguindo` and `descobrir`
- release cards should stay cover-first
- the feed preview should be short and intentional

### Spotify

Official references:

- Managing your Artist Pick  
  https://support.spotify.com/artists/article/artist-pick
- Four Must-Use Spotify Features That Bring You Closer to Your Favorite Artists  
  https://newsroom.spotify.com/2024-09-12/fans-artists-connections-features/

What matters:

- artists can feature what matters most at the top of their profile
- release surfaces connect with live events
- countdown and event layers deepen fan return
- now-playing and artist profile are both discovery surfaces

Echo-specific inference:

- artist profile should have a featured release at the top
- scheduled releases and scheduled live shows should be visible
- the selected track and the artist profile should cooperate instead of fighting each other

### YouTube For Artists

Official references:

- Find music from artists you like  
  https://support.google.com/youtube/answer/7636475
- Official Artist Channel sections  
  https://support.google.com/youtube/answer/9048214?hl=en-BR
- YouTube for Artists  
  https://artists.youtube.com/

What matters:

- the artist has one clear main stage
- releases are ordered by recency and grouped coherently
- subscriptions are a strong update surface
- launch, release day and post-release are treated as distinct phases

Echo-specific inference:

- the artist profile should feel like one coherent home
- new releases must stay easy to find
- the listener should understand quickly where the artist is now and what is coming next

## Premium Mobile Shape

The current premium-mobile cycle is now grouped into 4 waves:

1. shell and hierarchy
2. creator path and search
3. core ritual
4. retention and identity

The detailed block-by-block breakdown for those waves lives in:

- `echo-premium-mobile-prompt-sequence-execution-plan.md`

Current status:

- Wave 1 has now started through a first shell-and-home implementation pass
- that pass is documented in `../listener-experience/echo-wave-1-shell-and-home-pass.md`
- Wave 1 now also has a second premium-perception pass for search, profile and artist-home dark consistency
- that second pass is documented in `../listener-experience/echo-wave-1-premium-perception-pass-02.md`
- Wave 1 now also has a third home-distinction pass that separates Aura behavior from premiere behavior more clearly
- that third pass is documented in `../listener-experience/echo-wave-1-home-distinction-pass-03.md`
- Wave 1 now also has a fourth noise-reduction pass that cuts repeated helper text and lowers repeated card geometry
- that fourth pass is documented in `../listener-experience/echo-wave-1-noise-reduction-pass-04.md`

### Listener Shell

Top-level mobile entries stay:

- home
- search
- profile

That is enough for a premium first pass.

### Home

Home should become:

- live-first `Aura` surface
- second-layer updates feed
- slim player dock
- library grid
- bottom navigation

### Search

Search should stay a world-opening layer:

- global search field first
- artists as one major lane
- categories as one major lane
- fewer but stronger entry points

### Profile

Profile should stay the mode switch:

- listener
- professional

The listener stays clean.
The professional path stays powerful but contained.

Current status:

- the listener profile is now centered on one pulse card plus a slim utility rail
- the professional profile now opens with plan selection, creator-gate acceptance and a separate `Gerenciar artistas` entry
- the creator acceptance step is now treated as a locked unlock instead of a loose reversible checkbox
- paid tiers now open a payment step before the plan switch is treated as complete
- artist management now separates `Studio` from `Ao vivo`
- the fixed player is now slimmer and already carries previous, play/pause and next controls
- the mobile visual language now moves toward cut-corner glass blocks with pastel top accents instead of generic rounded cards

## Premium Execution Blocks

### Block A: Premium Feed

Goal:

Make the release feed feel rich without becoming noisy.

Work:

- keep 20 releases max per feed pass
- strengthen artwork treatment
- reduce text weight
- build better spacing and hierarchy
- improve following versus discover logic

### Block B: Premium Player

Goal:

Make the fixed player feel elegant and dependable.

Work:

- real audio state
- feed preview versus full-track separation
- fixed paused state preservation
- larger expanded player surface
- cleaner cover and progress behavior

Current status:

- first real audio foundation is now in place for local mobile validation
- Echo mobile can now evolve on top of actual media assets instead of simulated-only playback behavior

### Block C: Premium Artist Home

Goal:

Turn the artist profile into a convincing mini-world.

Work:

- featured release area
- slim release list
- reactions and comments
- follow state
- scheduled release state
- scheduled live-show state

Current status:

- first premium artist-home pass is now implemented in Echo mobile
- the artist surface already preserves the fixed-player selection while the listener explores launches and schedule

### Block D: Premium Social Layer

Goal:

Make Echo feel alive through music actions, not image-heavy social clutter.

Work:

- lightweight comments
- Echo emojis
- likes
- friend-follow signal
- library sharing
- borrowed album motion

Current status:

- first persistent local social-memory layer is now in place in Echo mobile
- artist-home reactions now survive navigation
- creator-side live schedule entries can now be created locally and reflected in artist surfaces
- first premium social-readability pass is now in place for feed cards and artist homes
- the migration boundary from local social memory to later backend state is now explicitly documented
- reusable-versus-Echo-only mobile patterns are now marked for future Pulse and Lumen work
- the asset path from local sample media toward storage-backed media is now explicitly documented and partly implemented
- the listener home is now organized as live-first with updates pushed into a second layer
- the listener home now brands live audio as `Aura`, keeps the player fixed near the top and moves main navigation to the bottom
- the second mobile screen is now a cleaner global-search surface with only `Artistas` and `Categorias` as major entry blocks

### Block E: Premium Live Audio Layer

Goal:

Add social energy without heavy storage cost.

Work:

- artist live-radio button
- scheduled sessions
- lightweight live room
- audio only
- audience count
- short comments or Echo emojis only
- no permanent replay in the first version

## Design Rules

- fewer controls per screen
- stronger cards
- larger visual targets
- cover-first behavior
- less text
- no mixed language in the main shell
- one main action per area
- no listener-facing admin language

## Cost Rule

Premium feel must not mean premium infrastructure too early.

So:

- no autoplaying heavy full streams in feed
- no image-heavy social timeline
- no saved live archives in the first pass
- no video-first social layer

Echo should feel premium by product discipline, not by expensive waste.

## Next Recommended Build Order

1. connect real creator-backed or storage-backed assets to the current stream/preview contract
2. refine ecosystem horizon visibility without adding noise
3. decide when local social persistence is strong enough to justify API-backed social reads and writes
4. strengthen live-radio schedule visibility in the feed with real beta behavior
5. keep improving social readability only where it helps music discovery
6. keep the mobile profile fair, quiet and reusable across future creator fronts

## Reference Note

Echo is not copying these products directly.

The references above are used to validate that the product principles already chosen here have working precedents in strong music platforms.
