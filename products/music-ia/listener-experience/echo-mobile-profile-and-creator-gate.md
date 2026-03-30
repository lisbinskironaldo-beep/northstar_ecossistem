# Echo Mobile Profile And Creator Gate

## Purpose

This document defines the third mobile screen of Echo.

It keeps one account for everything, but splits the visible experience into:

- listener mode
- professional mode

The split exists to keep the app light for listeners while still letting creators manage release work from the same identity.

## Fixed Player Rule

The slim fixed player should stay extremely clean.

In slim mode it shows:

- cover at the left
- track name
- artist line
- one play-pause control

Previous and next controls should appear only in the expanded player, not in the slim dock.

## Listener Side

The listener side of profile should stay quiet.

It should not feel like:

- an account settings wall
- a dashboard
- a noisy social panel

It should feel like:

- one clean pulse card
- one fair progress signal
- two narrow utility rails

### Main Listener Card

The main listener card shows:

- published tracks
- following
- library count
- favorites count
- followers
- profile level

It also explains what the next level requires without turning progress into spam pressure.

## Profile Levels

The level system should reward healthy use, not raw volume.

### Sem nivel

The account has not yet shown stable listening or publishing behavior.

### Bronze / Nivel III

The account already shows:

- first real listening pulse
- saved or followed signal
- or first published track

### Prata / Nivel II

The account already shows:

- at least a few published tracks
- recurring interaction
- some library depth
- no noisy suspicious pattern

### Ouro / Nivel I

The account already shows:

- strong published catalog
- stronger reaction depth
- stable recurring use
- quality over raw upload volume

## Professional Side

The professional side should open in this order:

1. plan selection
2. creator acceptance gate
3. plan summary
4. button to manage artists

The release studio itself should stay behind `Gerenciar artistas`.

That keeps the profile screen lighter.

## Plan Logic

### Gratis

- 1 active artist
- 6 active tracks
- 18 dormant or stored tracks
- 24 total tracks in the account

### Creator

- US$4.99
- 2 active artists
- up to 36 tracks per artist

### Premium

- US$14.99
- unlimited artists
- wider catalog freedom
- early access to Pulse and Lumen beta surfaces later

## Creator Acceptance Gate

The acceptance gate should be visually separate and should block the studio until accepted.

It records:

- no monetization promise now
- creator responsibility for rights and ownership
- creator responsibility for legal consequences of abusive or unlawful publication

The acceptance should not behave like a soft checkbox that is casually undone.

It should behave like a recorded unlock step.

## Plan Change Payment Step

Paid tiers should not switch instantly.

When the account taps a paid plan:

- a payment step should open first
- the target tier and value should be shown clearly
- only after that should the app treat the plan as changed

In the current mobile pass, Echo already exposes this as a dedicated payment surface before real gateway wiring.

## Artist Management Split

Inside `Gerenciar artistas`, the professional path should stay split into:

- `Studio`
- `Ao vivo`

Live scheduling should not live inside the same block as track submission.

That keeps the upload path lighter and easier to scan.

## Track Submission Details

Inside the mobile studio:

- artist name stays fully editable
- the app does not auto-suggest the public artist name in the release form
- scheduled release defaults to at least one week after the upload attempt
- the 20-second preview uses a start-point selector instead of raw typing
- coauthorship and composer metadata exist as distinct fields

## Verification Policy

Echo should not force heavy document verification on every creator in the first lightweight phase.

But the product should state clearly that:

- document verification may be requested
- face or selfie verification may be requested
- editorial review may be requested

This should happen only for:

- suspicious behavior
- rights disputes
- trust escalation
- future distribution or monetization pathways

## Ecosystem Boundary

This profile structure is Echo-first, but the shape is reusable later:

- Echo keeps listening and music publishing
- Pulse can reuse the same creator gate and tier logic
- Lumen can reuse the same creator gate and tier logic

The product should still avoid exposing Pulse and Lumen controls directly inside the Echo profile before those fronts are ready.
