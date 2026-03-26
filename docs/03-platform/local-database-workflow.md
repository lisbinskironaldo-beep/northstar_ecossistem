# Local Database Workflow

## Purpose

This document defines the reproducible local PostgreSQL workflow for Northstar implementation and end-to-end verification.

It exists so another Codex or programmer can move from build-only validation into live database testing without guessing setup steps.

## Local Database Standard

- database engine: `PostgreSQL`
- local runtime: `native PostgreSQL` or `Docker Compose`
- connection source of truth: `.env`
- Prisma schema path: `infra/database/prisma/schema.prisma`

## Required Environment

- one of:
  - PostgreSQL installed locally
  - Docker Desktop or a compatible Docker runtime
- Node.js 20+
- npm workspace dependencies already installed

## Default Local Connection

`.env.example` currently defines:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/northstar"
PORT=3001
NORTHSTAR_API_BASE_URL="http://localhost:3001"
EXPO_PUBLIC_API_BASE_URL="http://localhost:3001"
```

## Commands

Bring local PostgreSQL up:

```powershell
cmd /c npm run db:local:up
```

Stop local PostgreSQL:

```powershell
cmd /c npm run db:local:down
```

Validate Prisma schema:

```powershell
cmd /c npm run db:validate
```

Push schema manually:

```powershell
cmd /c npm run db:push
```

## What `db:local:up` Does

1. checks whether Docker is available
2. creates `.env` from `.env.example` when missing
3. starts `infra/database/docker-compose.yml`
4. waits for the Postgres healthcheck
5. runs Prisma client generation
6. applies the schema with `prisma db push`

## Current Validated Native Setup

This machine now has a validated native PostgreSQL setup for Northstar:

- PostgreSQL version: `16`
- service name: `NorthstarPostgreSQL16`
- database name: `northstar`
- default local port: `5432`

This native setup has already been used successfully for:

- Prisma client generation
- Prisma schema push
- Echo demo seed
- first live end-to-end Echo verification flow

Docker remains optional for teams that prefer containerized local development.

## Next Verification Target

The next required session should:

1. validate admin against live local seeded data
2. complete the remaining Echo MVP blockers
3. rerun the seeded acceptance checklist
