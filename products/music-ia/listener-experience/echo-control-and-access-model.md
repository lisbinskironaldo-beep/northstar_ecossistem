# Echo Control And Access Model

## Purpose

This document defines the control model for playback, offline use and voice access.

## Playback Rule

Playback should feel immediate and low-friction.

That means:

- player always easy to reach
- lock-screen media controls supported
- headphone controls supported
- quick save and hide actions supported

## Voice Control Rule

Echo should support voice where it is realistic and safe.

### What Echo Should Aim For

- in-app voice commands
- playback voice controls while the app is active
- lock-screen media controls through OS media integration

### What Echo Should Not Promise

Echo should not promise its own always-listening wake phrase outside Siri or Google Assistant.

That is not a realistic cross-platform promise for a normal app because the operating system controls that level of background access.

So the practical approach is:

- native media controls on lock screen
- headset actions
- optional in-app microphone controls when the app is active

## The Correct Promise

Do promise:

- fast control
- simple hands-free actions when the app is already in use
- lock-screen control through standard OS playback controls

Do not promise:

- custom always-on wake word independence

## Listener Control Set

Echo should expose these controls clearly:

- play
- pause
- next
- previous
- save
- hide
- less like this
- mute artist
- mute style
- offline save

This is the practical control system that makes Echo feel personal and responsive.
