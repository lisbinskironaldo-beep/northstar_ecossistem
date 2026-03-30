# Ecosystem Cost Model

## Purpose

This document gives a practical cost view for the Northstar Ecosystem from domain to content handling.

It is not a finance spreadsheet.

It is a decision guide for:

- when Echo is still lean
- when Pulse starts adding video load
- when Lumen introduces long-form storage and delivery pressure

All ranges below should be treated as planning bands, not guaranteed bills.

Current reference date for external pricing assumptions:

- 2026-03-28

## Core Cost Rule

The ecosystem should be built so that:

- Echo can start cheap
- Pulse only opens when Echo can carry more cost
- Lumen only opens when the system can absorb storage, delivery and processing pressure

The cost problem is not the same across all three fronts:

- Echo is mostly audio and metadata
- Pulse is short video and much higher media delivery
- Lumen is long video and the heaviest cost layer in the whole ecosystem

## Cost Layers

### 1. Identity And Presence

This is the cost of existing publicly.

Includes:

- domains
- DNS
- SSL
- basic CDN presence

Planning band:

- domain: `US$8 to US$20 / year` per main `.com`
- DNS / SSL / basic edge: `US$0 to US$20 / month`

Practical rule:

- keep one main domain first
- do not fragment public domains early

### 2. Product Runtime

This is the cost of keeping the product online.

Includes:

- web app hosting
- admin hosting
- API runtime
- background jobs

Planning band:

- very lean start: `US$0 to US$40 / month`
- safer small production setup: `US$40 to US$150 / month`

Practical rule:

- Echo can start with a very small runtime footprint
- keep public product and admin runtime separated

### 3. Core Data

This is the cost of storing platform state.

Includes:

- PostgreSQL
- Redis / queue backing
- backups

Planning band:

- lean start: `US$10 to US$50 / month`
- more comfortable beta stage: `US$50 to US$150 / month`

Practical rule:

- database cost is not the first danger
- media cost becomes the bigger issue earlier than relational data

### 4. Media Storage

This is where the ecosystem starts to differentiate sharply by front.

Includes:

- audio masters
- image assets
- short videos
- long-form video
- derived/transcoded files

Recommended model:

- metadata in PostgreSQL
- media objects in `Cloudflare R2` or `AWS S3`
- edge delivery through `Cloudflare`

Current official reference for R2:

- standard storage: `US$0.015 / GB-month`
- class A operations: `US$4.50 / million`
- class B operations: `US$0.36 / million`
- free tier: `10 GB-month`, `1 million` class A, `10 million` class B
- egress to Internet: free

Practical examples with R2 standard storage:

- `100 GB` stored: about `US$1.50 / month`
- `1 TB` stored: about `US$15 / month`
- `10 TB` stored: about `US$150 / month`

Practical rule:

- Echo is naturally efficient here
- Pulse multiplies storage and especially reads
- Lumen makes storage class, retention and transcode strategy mandatory

### 5. Media Delivery

This is the cost of actually serving content repeatedly.

Includes:

- audio streaming
- image delivery
- video streaming
- cache misses

Planning logic:

- Echo: low to moderate
- Pulse: medium to high
- Lumen: high

Practical rule:

- do not think only in stored GB
- think in repeated reads and watching behavior

### 6. Processing

This is the cost of transforming or validating uploaded content.

Includes:

- media validation
- waveform or duration extraction
- image processing
- short-video processing
- long-video transcode later

Planning band:

- Echo early: `US$0 to US$30 / month`
- Echo + Pulse: `US$30 to US$200 / month`
- with Lumen: potentially much higher depending on transcode volume

Practical rule:

- Echo should avoid heavy processing early
- Lumen must never launch without explicit media-processing limits

### 7. Operations And Safety

This is the cost of not letting the ecosystem collapse.

Includes:

- monitoring
- logs
- alerting
- moderation support
- transactional email
- operational reviews

Planning band:

- lean start: `US$0 to US$50 / month`
- serious beta: `US$50 to US$200 / month`

Practical rule:

- low cost here is fine at the start
- zero visibility is not fine

### 8. Content Cost

In this ecosystem, content cost is very different from Spotify or Netflix.

Northstar does not need to buy a giant catalog first.

The creator brings the content.

So the early content cost is mostly:

- seed catalog creation
- internal test artists
- onboarding support
- storage
- processing
- review

Planning band:

- minimal internal seed: `US$0 to US$100`
- more polished launch seed: `US$100 to US$500+`

Practical rule:

- content storage and quality review matter more early than licensing spend

## Cost by Front

### Echo Only

Typical early monthly planning band:

- very lean: `US$20 to US$120 / month`
- healthier beta: `US$100 to US$300 / month`

Why Echo is cheaper:

- mostly audio
- smaller files
- lighter delivery
- smaller processing footprint

### Echo + Pulse

Typical monthly planning band:

- `US$300 to US$1,500+ / month`

Why cost jumps:

- short video storage
- much higher media reads
- much more delivery pressure
- more moderation and trust surface

### Echo + Pulse + Lumen

Typical monthly planning band:

- `US$1,500 to US$10,000+ / month`

Why Lumen changes the game:

- long-form video
- higher storage depth
- stronger CDN pressure
- heavier transcoding and retention concerns

## Cost by Stage

### Stage A: Internal Build

Goal:

- keep cost low while structure gets strong

Band:

- `US$20 to US$100 / month`

Main drivers:

- domain
- small runtime
- database
- low media storage

### Stage B: Echo Controlled Beta

Goal:

- prove that the product feels alive
- support a small set of real users and creators

Band:

- `US$100 to US$300 / month`

Main drivers:

- more storage
- more reads
- better runtime margin
- more operational visibility

### Stage C: Echo Real Early Growth

Goal:

- support real recurring use

Band:

- `US$300 to US$1,000+ / month`

Main drivers:

- repeated streaming
- support and moderation pressure
- more catalog
- more analytics

### Stage D: Multi-Front Expansion

Goal:

- absorb Pulse and later Lumen without losing control

Band:

- `US$1,000+ / month`

Main drivers:

- video
- transcode
- storage lifecycle management
- heavier delivery

## Where Costs Explode First

The first major danger is not domain or Postgres.

The first danger is:

- repeated media delivery
- unbounded storage growth
- video

The most expensive mistakes would be:

- opening Pulse too early
- opening Lumen before delivery controls exist
- keeping dead content forever in hot storage
- allowing heavy offline caching without limits

## Cost Control Rules

Northstar should follow these rules:

1. Echo must be able to live alone cheaply.
2. Pulse only opens after Echo proves product value.
3. Lumen only opens with explicit storage and delivery limits.
4. dead content should not stay forever in hot storage.
5. offline should be app-bound cache, not unrestricted download.
6. media storage and delivery must be tracked as first-class metrics in the command layer.

## Recommended Practical Baseline

For the current stage, the most practical baseline is:

- one main domain
- Cloudflare for DNS / SSL / CDN
- PostgreSQL for platform data
- small API runtime
- Upstash or similar for Redis / queue
- Cloudflare R2 for media

Why this fits Northstar:

- keeps Echo cheap
- avoids early egress pain
- leaves room for Pulse and Lumen later
- stays simple enough to operate

## Real Conclusion

Northstar is financially realistic if the order is respected:

1. Echo first
2. Pulse second
3. Lumen last

If the order is ignored, cost grows faster than product proof.

If the order is respected, Echo can validate the ecosystem without forcing a large burn rate.

## Source Notes

Official sources consulted for current pricing reference:

- Cloudflare R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Cloudflare Registrar: https://www.cloudflare.com/products/registrar/
- AWS S3 pricing: https://aws.amazon.com/s3/pricing/
- Vercel pricing: https://vercel.com/pricing
- Upstash Redis pricing: https://upstash.com/docs/redis/overall/pricing

## Important Warning

Numbers in this document are planning ranges.

Actual bills will vary with:

- region
- storage growth
- request volume
- cache hit ratio
- media duration
- video adoption
- moderation load
