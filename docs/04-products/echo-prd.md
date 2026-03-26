# Echo PRD

## Product Name

- Codename: `Echo`
- Public category: `Music IA`

## Product Role In The Ecosystem

Echo is the first public front of the Northstar Ecosystem.

It is the first place where creator supply, discovery quality and repeat audience behavior will be tested in the real market.

## Problem Statement

AI music creators struggle to be discovered in mainstream platforms.

Users who are curious about AI music do not have a dedicated place to browse, save and return to AI-native music with a clear product promise.

## Product Thesis

If Northstar launches a focused AI music product with easy creator entry, strong discovery loops and strict reach control, it can build an early catalog, attract creators and validate the ecosystem's core ranking model.

## Goals

- attract AI music creators
- attract users interested in AI music as a category
- create a repeat listening habit
- validate ranking quality
- prepare the ecosystem for future expansion

## Non-Goals

- no short video launch in Echo MVP
- no long-form streaming in Echo MVP
- no advanced monetization in Echo MVP
- no creator payout in Echo MVP
- no desktop-first experience priority

## Primary Users

### Listener

Wants to:

- discover AI music quickly
- save favorite tracks
- follow promising artists
- return for more

### Creator

Wants to:

- upload music easily
- be heard without platform prejudice
- build visibility
- track if the music is getting traction

## MVP Feature Set

### Listener-facing

- vertical discovery feed for tracks
- simple player
- save track
- follow creator
- creator profile
- category explore view
- report content

### Creator-facing

- creator account creation
- creator profile setup
- track upload
- metadata entry
- category assignment
- publish to limited distribution

### Internal-facing

- review metrics in command center
- track launch health
- monitor reports and suspicious activity

## Core Screens

### 1. Entry And Onboarding

### 2. Home Feed

### 3. Expanded Player

### 4. Explore

### 5. Creator Profile

### 6. Upload Flow

Required fields:

- track title
- creator display name if not already set
- category
- AI declaration
- optional source tool
- cover image optional in MVP

## Suggested MVP Categories

- lo-fi
- trap
- electronic
- ambient
- dark
- pop IA
- instrumental
- experimental

## Discovery Logic

Every new track enters test distribution first.

Expansion depends on:

- completion ratio
- total listened time
- replay behavior
- saves
- follows after listen
- trust modifiers
- report burden

## Ranking Logic For MVP

Use a rule-based weighted model.

Initial weighted inputs:

- completion ratio: high weight
- listened time: high weight
- replay behavior: medium weight
- saves: medium weight
- follows after listen: medium weight
- reports: negative weight
- low trust: negative weight

## First Launch Success Metrics

### User metrics

- D1 retention
- D7 retention
- D30 retention
- average listened time per session
- save rate
- follow rate

### Creator metrics

- creator activation rate
- creator week-1 return rate
- creator month-1 return rate
- average uploads per active creator

### Catalog metrics

- percent of tracks with meaningful plays
- percent of tracks saved at least once
- archive candidate ratio

## Launch Constraints

- launch controlled, not mass open
- seed catalog required before public exposure
- command center must be operational
- trust baseline must be active

## Biggest Risks

- empty-feeling catalog
- too much generic content
- weak first-session value
- upload abuse
- creators posting once and disappearing

## Mitigations

- seed 100 to 300 tracks
- use tight upload caps early
- tune feed quickly after launch
- improve onboarding and creator progress cues
- clean low-value content aggressively

## Readiness To Hand Off To Engineering

Echo is ready for implementation when:

- architecture is approved
- domain model is approved
- command center MVP is approved
- backlog is split into engineering work
