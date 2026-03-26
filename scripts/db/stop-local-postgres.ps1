$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$composeFile = Join-Path $projectRoot 'infra\database\docker-compose.yml'

Write-Host 'Northstar local database shutdown'

if (-not (Test-Path $composeFile)) {
  throw "Compose file not found at $composeFile"
}

$dockerCommand = Get-Command docker -ErrorAction SilentlyContinue

if (-not $dockerCommand) {
  Write-Host 'Docker nao esta disponivel neste ambiente.'
  exit 0
}

& docker compose -f $composeFile down

if ($LASTEXITCODE -ne 0) {
  throw 'Falha ao desligar o PostgreSQL local'
}

Write-Host 'PostgreSQL local desligado.'
