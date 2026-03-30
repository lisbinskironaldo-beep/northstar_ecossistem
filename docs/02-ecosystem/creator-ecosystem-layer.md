# Creator Ecosystem Layer

## Purpose

This document defines the creator model for the whole Northstar Ecosystem.

It exists because Echo, Pulse and Lumen will all depend on the same creator logic later.

## Final Decision

Do not create a completely separate account system for creators.

Do not leave creators fully mixed into the normal listener surface either.

Use this model:

- one Northstar account
- one user identity
- optional creator workspace inside that account
- multiple public artist personas inside the creator workspace

## Why This Is The Best Balance

If creators use separate accounts:

- fraud grows faster
- moderation gets harder
- analytics get noisier
- people create endless fake accounts

If creators stay fully mixed with no separation:

- the product becomes confusing
- listener simplicity gets worse
- creator tools clutter the main app

So the correct split is:

- unified account layer
- separated creator workspace layer

## Creator Layer In The Ecosystem

### Account Layer

This is the real identity:

- login
- security
- trust
- billing later
- legal and safety responsibility

### Creator Workspace Layer

This is the operating layer:

- manage artist personas
- upload to Echo
- later manage Pulse and Lumen
- view content state
- manage public libraries
- manage restrictions and release choices

The workspace can hold more than one public artist persona under the same account.

### Public Artist Layer

This is what the public sees:

- artist name
- catalog
- followers
- public libraries
- front-specific content

The public does not need to know whether one account owns one artist or many.

## Sensitive Content Responsibility

The creator workspace is also where restricted choices should live.

That includes:

- parody flags
- clone-inspired flags
- kids publishing choices
- explicit publishing choices
- restricted publishing choices

This keeps sensitive release decisions inside the creator layer instead of scattering them across the listener app.

## Future Cross-Front Logic

The same creator workspace should later manage:

- Echo releases
- Pulse clips
- Lumen works

That makes the creator layer part of the ecosystem, not part of a single app only.

## Future Talent-Business Extension

The creator layer may later connect to a selective business branch for:

- agency
- distribution
- external monetization
- licensing

Important:

- this is not the base product promise
- this only becomes active later
- it belongs to the talent engine, not the primary upload flow

## Robustness Rule

One account can own multiple artist personas.

But:

- trust belongs to the account
- violations in one persona can affect the whole account
- moderation can still see the internal relationship

This protects the platform without exposing internal structure to the public.
