# Project Repository Architecture

## Purpose

This document defines how the repository must stay organized as Northstar grows.

The goal is simple:

- keep the system robust
- make problems easier to locate
- stop product code, platform code and operations from collapsing into one place
- leave a clear home for Echo, Pulse and Lumen before they are all fully built

## Core Rule

Every concern must have a home.

Do not mix:

- product experience
- platform capability
- operational process
- temporary research

## Main Repository Layers

### `apps`

This is where runnable app surfaces live.

Use this for:

- public web or mobile surfaces
- admin surfaces
- founder command surfaces

Current examples:

- `apps/echo-web`
- `apps/echo-mobile`
- `apps/admin-web`
- `apps/command-center-web`

Rule:

An app should only contain app-facing UI, routing and product orchestration.

It should not become the place where business logic is invented.

### `services`

This is where executable backend services live.

Use this for:

- API runtime
- jobs runtime
- future ranking/media services if they become independent

Rule:

If it runs as a service, queue consumer or backend process, it belongs here.

### `packages`

This is where shared code lives.

Use this for:

- shared types
- shared UI primitives
- shared config
- future shared client SDKs

Rule:

Only put something here if at least two apps or services should reuse it.

### `platform`

This is the internal architecture map of the central system.

It is not the same thing as a deployable app.

Use this for:

- core platform capabilities
- data system boundaries
- trust and safety boundaries

Subareas:

- `platform/core`
- `platform/data`
- `platform/trust-safety`

### `products`

This is the product intelligence layer by public front.

Use this for:

- Echo-specific product work
- Pulse-specific product work
- Lumen-specific product work

Subareas:

- `products/music-ia`
- `products/shorts-ia`
- `products/watch-ia`

Rule:

If the work belongs to one front only, keep it here instead of burying it in general docs.

### `operations`

This is where the company learns how to run the ecosystem.

Use this for:

- creator operations
- growth operations
- finance controls
- policy and rights handling

Rule:

If the question is "how do we operate this well?" it belongs here, not inside product folders.

### `infra`

This is where environment and infrastructure assets live.

Use this for:

- database schema
- migrations
- infra compose files
- future deployment manifests

### `scripts`

This is for repeatable automation.

Use this for:

- seed scripts
- verification scripts
- local environment scripts
- maintenance scripts

### `workspace`

This is the temporary working layer.

Use this for:

- planning notes
- logs
- research fragments
- throwaway support files

Rule:

Nothing in `workspace` should become canonical without being promoted into `docs`, `products`, `platform` or `operations`.

## How To Decide Where Something Goes

### Put it in `apps` when:

- it changes what the user or operator directly sees

### Put it in `services` when:

- it changes runtime backend behavior

### Put it in `packages` when:

- two or more apps/services should share it

### Put it in `platform` when:

- it defines a platform capability or boundary

### Put it in `products` when:

- it is specific to Echo, Pulse or Lumen

### Put it in `operations` when:

- it describes how people run the system

## Reserved Product Homes

### Echo

Primary working home:

- `products/music-ia`

Runtime surfaces:

- `apps/echo-web`
- `apps/echo-mobile`

### Pulse

Reserved product home:

- `products/shorts-ia`

Future runtime surfaces should live under:

- `apps/pulse-web`
- `apps/pulse-mobile`

Do not create these runtime apps until Echo readiness gates justify it.

### Lumen

Reserved product home:

- `products/watch-ia`

Future runtime surfaces should live under:

- `apps/lumen-web`
- `apps/lumen-mobile`

Do not create these runtime apps until Pulse and ecosystem maturity justify it.

## Separation Rules

### Keep product-specific logic out of general platform docs

Example:

- Echo catalog strategy belongs in `products/music-ia/catalog`
- not inside the generic platform folder

### Keep operational rules out of UI code

Example:

- creator cohort handling belongs in `operations/creator-ops`
- not inside app components

### Keep platform boundaries stable

Example:

- trust and moderation concerns stay inside `platform/trust-safety`
- not spread across random folders

## Debugging Rule

A contributor should be able to ask:

- is this a product problem?
- a platform problem?
- an operations problem?

And know where to look first.

If a file placement makes that harder, the placement is wrong.
