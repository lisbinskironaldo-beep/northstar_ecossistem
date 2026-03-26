# Technical Architecture

## Purpose

This document defines the initial technical architecture for the Northstar Ecosystem.

It is designed to support:

- one internal platform
- three public products
- one founder-facing command layer
- low-cost controlled beginnings
- scalable evolution without full re-architecture

## Architecture Principles

1. One core, many products.
2. Build for global distribution, not only local launch.
3. Start lean, but avoid dead-end choices.
4. Separate product-facing apps from platform services.
5. Treat media storage and delivery as first-class design concerns.
6. Track every important user and content event from day one.
7. Build operational visibility as part of the product, not as an afterthought.

## Recommended Initial Stack

### Product Clients

- Mobile apps: `React Native` with `Expo`
- Founder/admin web: `Next.js`

### Backend Services

- API and service layer: `NestJS` on `Node.js`
- Background jobs: `BullMQ` with `Redis`

### Data Layer

- Primary relational database: `PostgreSQL`
- Cache and queue backing: `Redis`
- Search later if needed: start with PostgreSQL text and category indexing, add dedicated search only when usage proves need

### Media Layer

- Object storage: `Cloudflare R2` or `AWS S3`
- CDN and edge delivery: `Cloudflare`
- Media processing workers: backend-triggered worker jobs

### Analytics Layer

- MVP event storage: PostgreSQL event tables plus aggregated metrics tables
- Growth path: move event-heavy analytics to `ClickHouse` when scale justifies it

## Monorepo Structure

Recommended workspace layout:

- `apps/echo-mobile`
- `apps/pulse-mobile`
- `apps/lumen-mobile`
- `apps/command-center-web`
- `apps/admin-web`
- `services/api`
- `services/jobs`
- `packages/types`
- `packages/config`
- `packages/ui`

## Service Modules

- Identity Service
- Creator Service
- Content Service
- Media Processing Service
- Discovery And Ranking Service
- Trust And Safety Service
- Analytics Service
- Command Center Service

## Content Flow

1. user uploads content
2. content service creates draft record
3. media processing validates and stores media
4. trust and safety applies initial checks
5. content enters limited distribution
6. analytics collect performance signals
7. ranking recalculates exposure
8. content is promoted, suppressed, archived or removed based on rules

## Database Strategy

Core relational tables:

- users
- accounts
- creator_profiles
- content_items
- content_assets
- tracks
- categories
- follows
- saves
- playback_sessions
- event_log
- reports
- moderation_actions
- trust_scores
- release_reviews
- alerts
- change_ledger

## Infrastructure Environments

- local development
- staging
- production

## Observability Baseline

Must capture:

- API errors
- job failures
- media-processing failures
- feed latency
- playback start failures
- storage growth
- alert counts
- report counts

## Build Recommendation

Start implementation with:

1. monorepo setup
2. core API skeleton
3. database schema baseline
4. auth and creator profiles
5. content ingest for Echo
6. analytics event capture
7. command center MVP web shell

## Phase 1 Outcome

This architecture is sufficient to begin implementation of the core platform and Echo without violating the broader ecosystem strategy.
