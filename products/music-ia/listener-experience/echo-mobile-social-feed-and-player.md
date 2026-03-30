# Echo Mobile Social Feed And Player

## Purpose

This document defines the next listener-facing step for Echo mobile:

- social release feed
- fixed slim player
- discovery toggle without clutter

## Listener Feed Rule

The default listener feed should feel social, not technical.

That means:

- release cards from followed artists
- cover-first presentation
- muted state while scrolling
- the listener chooses what actually opens in the player

## Two Feed States

The first mobile feed should switch between:

- following
- discover

`following` shows the work of artists the listener already follows.

`discover` shifts the same area into stronger recent artists and releases.

This creates a cleaner rhythm than mixing both at once.

## Main Feed Limit

The main feed should stay finite and clean.

The first rule is:

- show only the 20 most recent releases at once

This protects the listener from an endless wall and keeps the product lighter.

## Feed Preview Rule

The feed itself should never hijack the main player.

The rule is:

- only a twenty-second cut plays inside the release card
- the full track does not start from the feed card
- tapping outside the action buttons opens the artist profile

If the fixed player was already playing a selected full track:

- the fixed player pauses
- the twenty-second feed preview starts
- when that preview ends, the fixed player stays paused
- the selected full track remains preserved in the dock

That gives discovery without losing context.

## Artist Profile Entry

When the listener opens an artist from the feed:

- the app opens a slim artist profile
- the selected feed release is already preselected there
- the fixed player selection does not change automatically

Inside the artist profile the listener can later:

- follow the artist
- save playlists
- borrow albums
- like tracks
- comment
- send Echo emojis
- see scheduled launches
- see scheduled shows or live radio

That artist surface is now moving into a stronger premium-home pattern instead of a raw detail sheet.

## Fixed Slim Player

The player should stay visible while the listener keeps navigating.

The first pass behavior is:

- slim and fixed near the top
- shows title, artist and current selected release
- opens into a larger card on tap
- never hijacks the whole app

## Live Layer

Artists may later open scheduled live radio sessions.

That live layer should stay cheap:

- audio only
- no permanent storage
- lightweight public counter
- very short comments or Echo-only emojis

This keeps the feature expressive without turning Echo into a heavy video platform.

## Feed Behavior

The release feed should not autoplay while the user scrolls.

Instead:

- cards stay visually alive
- audio is muted in the feed
- real listening starts only when the listener selects a release

This keeps the product calmer and more intentional.

## Relation To The Rest Of Echo

The social feed does not replace:

- worlds
- library
- fixed picks

It becomes the primary surface of the home tab, while those other layers keep helping discovery and memory.

## Ecosystem Note

This listener pattern is useful beyond Echo.

Later, the same split can inform:

- Pulse release feed
- Lumen premiere feed

without collapsing all fronts into one design.
