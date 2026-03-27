# Echo Mobile Local Testing

## Purpose

This file explains the simplest current path to open Echo on a real phone without App Store or Play Store publishing.

## What Is Possible Right Now

Right now, Echo mobile can be tested on a real phone in development mode.

That means:

- no public store is needed
- no APK download flow is needed yet
- the phone can open the app through Expo Go on the same network
- the mobile app is now aligned to `Expo SDK 54`

## What It Is Not Yet

This is not yet:

- a Play Store release
- an App Store release
- a final installable production build

It is a real phone test path for the current MVP.

## Local Network Requirement

The phone and the development machine must be on the same Wi-Fi network.

The local machine address currently used for Echo mobile is:

- `10.0.0.149`

If that local IP changes later, update:

- [apps/echo-mobile/.env.local](/c:/dev/northstar_ecosystem/apps/echo-mobile/.env.local)

## Start Order

### 1. Start the API

```powershell
cd C:\dev\northstar_ecosystem
cmd /c npm run dev:api
```

The API now listens on the local network, not only on localhost.

### 2. Start Echo mobile in LAN mode

```powershell
cd C:\dev\northstar_ecosystem
cmd /c npm run dev:echo:mobile:lan
```

### 3. Open on the Phone

Install `Expo Go` on the phone.

Then:

- scan the QR code shown in the terminal
- open the project in Expo Go

## What Should Work In This Mobile Test

- feed load
- save
- playback registration
- report
- explore
- creator setup
- upload

## If The Phone Opens But Data Does Not Load

Check these first:

- is the API still running on port `3001`?
- is the phone on the same Wi-Fi?
- is `EXPO_PUBLIC_API_BASE_URL` still pointing to the correct local IP?

## Next Step After Local Phone Testing

After the local phone test is stable, the next upgrade path is:

- create a real Android test build
- install that build directly on the phone

That is the step where Echo starts behaving more like a downloadable app instead of a development session.
