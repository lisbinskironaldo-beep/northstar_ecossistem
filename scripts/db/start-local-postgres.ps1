$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$composeFile = Join-Path $projectRoot 'infra\database\docker-compose.yml'
$envFile = Join-Path $projectRoot '.env'
$envExampleFile = Join-Path $projectRoot '.env.example'

Write-Host 'Northstar local database bootstrap'

if (-not (Test-Path $composeFile)) {
  throw "Compose file not found at $composeFile"
}

$dockerCommand = Get-Command docker -ErrorAction SilentlyContinue

if (-not $dockerCommand) {
  Write-Host 'Docker nao esta disponivel neste ambiente.'
  Write-Host 'Instale Docker Desktop ou exponha um PostgreSQL local antes de rodar este script.'
  Write-Host 'Quando Docker estiver disponivel, rode novamente:'
  Write-Host '  cmd /c npm run db:local:up'
  exit 0
}

if (-not (Test-Path $envFile) -and (Test-Path $envExampleFile)) {
  Copy-Item $envExampleFile $envFile
  Write-Host '.env criado a partir de .env.example'
}

Write-Host 'Subindo PostgreSQL local via docker compose...'
& docker compose -f $composeFile up -d

if ($LASTEXITCODE -ne 0) {
  throw 'Falha ao subir o PostgreSQL local'
}

Write-Host 'Aguardando healthcheck do container northstar-postgres...'
for ($attempt = 1; $attempt -le 20; $attempt++) {
  $status = & docker inspect --format "{{json .State.Health.Status}}" northstar-postgres 2>$null

  if ($status -match 'healthy') {
    Write-Host 'PostgreSQL local pronto.'
    break
  }

  Start-Sleep -Seconds 2

  if ($attempt -eq 20) {
    throw 'PostgreSQL local nao ficou healthy a tempo'
  }
}

Write-Host 'Gerando client Prisma...'
cmd /c npm run db:generate

if ($LASTEXITCODE -ne 0) {
  throw 'Falha ao gerar o client Prisma'
}

Write-Host 'Aplicando schema no banco local...'
cmd /c npm run db:push

if ($LASTEXITCODE -ne 0) {
  throw 'Falha ao aplicar schema no banco local'
}

Write-Host 'Banco local pronto para verificacao ponta a ponta.'
