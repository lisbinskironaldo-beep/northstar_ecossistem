# Command Center MVP

## Purpose

This document defines the minimum viable version of the Northstar Command Center.

The command center is the founder's operating retaguarda.

Its first version must help manage Echo launch and platform stability without needing the full future AI-ops vision on day one.

## MVP Goal

Give the founder one place to see:

- ecosystem health
- Echo health
- creator supply health
- trust and fraud pressure
- cost and storage pressure
- exact review times and launch clocks
- what needs action now

## MVP Screens

### 1. Executive Overview

Must show:

- current ecosystem status
- current Echo status
- active alerts
- launch clock countdowns
- top recommended actions

### 2. Echo Health

Must show:

- new users
- returning users
- new creators
- active creators
- uploads
- plays
- saves
- average listen depth
- top categories
- top and worst content cohorts

### 3. Trust And Safety

Must show:

- upload spikes
- suspicious account spikes
- duplicate alerts
- report volume
- moderation actions
- low-trust creators count

### 4. Cost And Media Health

Must show:

- storage growth
- top storage consumers
- failed uploads
- media processing failures
- estimated monthly burn baseline

### 5. Review Clock

Must show exact milestones for launches and releases:

- T-72h
- T-24h
- T+6h
- T+24h
- T+72h
- T+7d
- T+14d
- T+30d
- T+45d
- T+60d
- T+90d

### 6. Change Ledger

Must show:

- what changed
- when it changed
- who approved it
- what was expected
- what happened after

## MVP Alert Types

- retention_drop
- creator_supply_drop
- upload_spike
- duplicate_spike
- report_spike
- storage_growth_spike
- playback_failure_spike
- processing_failure_spike
- category_quality_drop

## Founder Briefings

### Daily Pulse Briefing

Delivery time:

- 08:30 America/Sao_Paulo

### Weekly Operations Briefing

Delivery time:

- Monday 09:00 America/Sao_Paulo

### Monthly Executive Briefing

Delivery time:

- first business day at 10:00 America/Sao_Paulo

## MVP Recommendation Engine

In the MVP, recommendations can be rule-based, not fully AI-native yet.

Recommendation output format:

- problem
- evidence
- urgency
- probable cause
- recommended action
- expected effect
- confidence level

## Decision Queue MVP

The queue should support:

- pending decision title
- linked alert or metric
- urgency score
- suggested owner
- deadline
- status

## Data Inputs Required

- event log
- playback session aggregates
- upload counts
- save counts
- creator activation counts
- trust score updates
- reports
- moderation actions
- storage metrics
- release review records

## Build Recommendation

Build the command center MVP as a Next.js internal app with:

- server-side protected routes
- API access to aggregated metrics
- dashboard cards
- alert tables
- review schedule pages
- change ledger table

## Phase 1 Outcome

This MVP is enough to support Echo launch governance and founder visibility from day one.
