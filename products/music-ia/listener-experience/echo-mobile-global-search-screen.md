# Echo Mobile Global Search Screen

## Purpose

This document records the new shape of the second mobile screen in Echo.

It exists to keep search separate from home and separate from profile.

## Core Rule

The second screen is now the global search entry for the whole app.

It should do one job well:

- open anything in Echo through search or structured discovery

It should not:

- repeat the home layout
- repeat the library blocks from the first screen
- repeat creator prompts
- repeat ecosystem horizon hints

## Screen Order

From top to bottom:

1. the fixed player remains visible above everything as part of the app shell
2. a global search field
3. two square entry blocks:
   - `Artistas`
   - `Categorias`
4. bottom navigation stays the same

When the listener enters `Buscar` from the bottom navigation, this neutral state should open first.

The screen should not accidentally reopen inside an old subsection.

## Search Rule

Search should work across:

- artist name
- handle
- track title
- track fragment or partial term
- category
- style
- environment
- sensitive or outside-catalog surfaces

Search should be:

- accent-insensitive
- partial-term friendly
- global inside Echo

## Artist Entry

Inside `Artistas`:

- show a compact three-per-row grid
- prioritize followed artists
- if the circle is empty, fall back to recent creators
- opening an artist should reuse the same artist profile already agreed in the mobile flow

## Category Entry

Inside `Categorias`:

- show a compact three-per-row grid
- expose large discovery lanes, not tiny tags

Current lanes:

- fora do catalogo
- ambientes
- estilos
- 50 mais Brasil
- 50 mais perto
- 50 mundo
- lançamentos

## What Was Removed On Purpose

The second screen no longer carries:

- borrowed-library block
- professional prompt
- ecosystem strip
- large world walls
- extra redundant labels

That keeps the screen focused.

## Current Built State

The current mobile build now opens `Buscar` with:

- one global field
- one large `Artistas` block
- one large `Categorias` block

Drill-down happens only after explicit tap:

- `Artistas` opens the smaller artist grid
- `Categorias` opens the smaller category grid

## Decision

The second mobile screen is now:

- global search first
- artists second
- categories second
- clean enough to open the rest of the app without competing with the first screen
