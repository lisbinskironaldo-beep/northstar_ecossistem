# Domain Model

## Purpose

This document defines the initial domain and data model for the Northstar Ecosystem.

It focuses on the entities required to support the core platform and the first public front, Echo.

## Modeling Principles

1. Users and creators are related but not identical concepts.
2. Content must be product-aware but platform-owned.
3. Trust and lifecycle states must be first-class fields.
4. Events drive analytics, ranking and command-center visibility.
5. The model must support future Pulse and Lumen growth without forcing product implementation now.

## Core Entities

### User

Key fields:

- user_id
- email_or_provider_key
- account_status
- country
- preferred_language
- created_at
- last_active_at
- trust_level

### CreatorProfile

Key fields:

- creator_id
- user_id
- display_name
- handle
- bio
- avatar_asset_id
- creator_status
- creator_tier
- primary_front
- follower_count_cached
- published_content_count_cached
- created_at

### ContentItem

Key fields:

- content_id
- creator_id
- product_surface
- content_type
- content_state
- visibility_state
- trust_state
- title
- description
- primary_category_id
- created_at
- published_at
- archived_at

### ContentAsset

Key fields:

- asset_id
- content_id
- asset_role
- storage_provider
- storage_key
- mime_type
- duration_ms
- file_size_bytes
- checksum
- transcoded_state
- created_at

### Track

Echo-specific extension of ContentItem.

Key fields:

- track_id
- content_id
- artist_name_display
- explicit_flag
- bpm_optional
- release_type
- lyrics_present_flag
- ai_declaration
- source_tool_optional

### Category

### Follow

### Save

### PlaybackSession

Key fields:

- playback_id
- user_id_optional
- content_id
- product_surface
- started_at
- ended_at
- listened_ms
- completion_ratio
- replay_count_in_session
- source_context

### EventLog

Key fields:

- event_id
- event_name
- actor_user_id_optional
- actor_creator_id_optional
- content_id_optional
- product_surface
- occurred_at_utc
- payload_json

### Report

### ModerationAction

### TrustScore

### Alert

### ChangeLedgerEntry

## Relationship Summary

- one User may own one CreatorProfile initially
- one CreatorProfile may own many ContentItems
- one ContentItem may have many ContentAssets
- one User may follow many CreatorProfiles
- one User may save many ContentItems
- one ContentItem may generate many PlaybackSessions

## Lifecycle Model

### Account lifecycle

- active
- limited
- suspended
- banned

### Creator lifecycle

- inactive
- active
- restricted

### Content lifecycle

- draft
- processing
- ready
- published_test
- published_public
- suppressed
- archived
- removed

## Ranking Inputs For Echo

- play starts
- completion ratio
- total listened time
- replay behavior
- saves
- follows after listen
- reports
- trust score modifiers

## Trust And Safety Baseline

### Upload caps

Initial Echo baseline:

- new creator: 3 uploads per 24h
- established creator: 5 uploads per 24h

### Initial reach caps

All newly published content starts in limited test distribution.

### Duplicate handling

The model must support:

- exact file checksum matches
- probable duplicate detection metadata
- repeated low-variation content flags later

### Report reasons baseline

- not_ai_content
- duplicate_or_spam
- abusive
- impersonation
- rights_or_ownership_issue
- adult_or_prohibited
- low_quality_spam

### Dead-content policy baseline

Initial threshold recommendation:

- review at 30 days
- archive candidate at 60 days if no meaningful traction

### AI-declaration baseline

Each track must capture:

- creator-declared AI usage yes or no
- optional source tool
- optional human-collaboration note

## Event Baseline For Phase 1

Required events:

- account_created
- creator_profile_created
- content_upload_started
- content_upload_completed
- content_published
- track_play_started
- track_play_completed
- track_saved
- creator_followed
- report_submitted
- moderation_action_created
- alert_triggered

## Phase 1 Outcome

This model is sufficient to support architecture, ranking, trust baseline, Echo PRD and command-center requirements.
