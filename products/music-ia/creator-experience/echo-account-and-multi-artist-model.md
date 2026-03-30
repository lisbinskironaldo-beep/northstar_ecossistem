# Echo Account And Multi-Artist Model

## Purpose

This document defines how identity should work inside Echo.

It resolves the problem of fake artist proliferation without forcing users into many separate accounts.

## Final Rule

Echo should use:

- one Northstar account
- one real internal identity
- one optional creator workspace
- multiple public artist personas inside that workspace

Do not force:

- one account per artist
- one artist per account

## Why This Fits Echo

In Echo, becoming an artist is easy.

That means many people will:

- listen and publish from the same account
- test multiple styles
- create multiple fictional artists
- want separation between their public personas

If Echo forces multiple accounts, it creates:

- more fraud
- more moderation noise
- more fake registrations
- weaker trust scoring

## Product Layers

### Layer 1: Account

The real internal identity.

Owns:

- login
- security
- trust score
- private library
- billing later
- policy responsibility

### Layer 2: Creator Workspace

The operating layer.

Owns:

- artist creation
- upload
- release state
- front targeting later
- public library configuration
- restricted content choices

### Layer 3: Public Artist Personas

The public-facing layer.

Each persona has:

- own name
- own image
- own public profile
- own catalog
- own public libraries
- own followers

## Product Limits

Echo should not allow unlimited artist creation by default.

Current direction:

- up to `3` artist personas can exist inside one account
- only `1` artist should stay active in the free tier
- additional active artist capacity should belong to paid or advanced creator tiers

This keeps the structure flexible without making abuse too easy.

## Trust Rule

The public can see separate artists.

The platform can still see that they belong to the same account.

That means:

- trust belongs to the account
- abuse in one artist can affect the whole account
- moderation can audit the relationship internally

## Future Cross-Front Rule

The same creator workspace should later manage:

- Echo releases
- Pulse uploads
- Lumen works

That makes the workspace an ecosystem layer, not a one-app trick.

## Product Rule

Keep the public identities flexible.

Keep the internal identity strong.

That is how Echo stays open without becoming chaos.
