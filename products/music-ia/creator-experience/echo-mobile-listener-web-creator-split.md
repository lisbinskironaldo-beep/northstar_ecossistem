# Echo Mobile Listener / Web Creator Split

## Purpose

This document defines the most practical split between listener and creator access for Echo at the current stage.

## Final Rule

Echo should support:

- mobile-first listening
- browser-first creator management

That means:

- the listener can use Echo as a music app
- the creator can open a browser workspace to manage the publishing side

## Why This Works

At the current stage, this split is stronger than forcing everything into one mobile app.

It helps because:

- the listener journey stays simple
- the creator workflow stays cheaper to build
- upload, classification and workspace complexity stay outside the lightweight listener app
- the system remains easier to operate with one founder

## Listener Side

The listener experience should trend toward:

- mobile-first
- feed
- player
- save
- follow
- exclusion center
- private and public library behavior

The listener should not see heavy creator controls all the time.

## Creator Side

The creator side should begin as:

- browser workspace
- account activation
- persona management
- upload
- release-room classification
- artist-level organization

This keeps the creator side:

- cheaper
- clearer
- easier to extend later across Echo, Pulse and Lumen

## Account Rule

This split does not mean separate accounts.

It still uses:

- one account
- optional creator workspace
- multiple artist personas under the same account

So the split is:

- by experience
- not by identity

## Product Advantage

This model gives Echo three benefits:

1. mobile can stay clean and intuitive
2. creator operations can stay robust without bloating the listener app
3. the creator workspace can later become ecosystem-wide

## Future Cross-Front Expansion

The same creator workspace should later manage:

- Echo releases
- Pulse uploads
- Lumen publishing

That is why the creator side should live as a proper web workspace, not as a rushed mobile-only upload form.

## Final Decision

For the current Northstar stage:

- mobile-first for listener
- web-first for creator
- same account underneath
- separate experience above
