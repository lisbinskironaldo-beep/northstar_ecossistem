param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('validate', 'push')]
  [string]$Command
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$envFile = Join-Path $projectRoot '.env'
$envExampleFile = Join-Path $projectRoot '.env.example'
$schemaPath = Join-Path $projectRoot 'infra\database\prisma\schema.prisma'

function Import-EnvFile {
  param([string]$Path)

  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()

    if (-not $line -or $line.StartsWith('#')) {
      return
    }

    $parts = $line -split '=', 2

    if ($parts.Length -ne 2) {
      return
    }

    $name = $parts[0].Trim()
    $value = $parts[1].Trim().Trim('"')

    if ($name) {
      [System.Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
  }
}

if (Test-Path $envFile) {
  Import-EnvFile -Path $envFile
} elseif (Test-Path $envExampleFile) {
  Import-EnvFile -Path $envExampleFile
}

if (-not $env:DATABASE_URL) {
  throw 'DATABASE_URL nao foi encontrado em .env nem em .env.example'
}

if ($Command -eq 'validate') {
  cmd /c npx prisma validate --schema "$schemaPath"
}

if ($Command -eq 'push') {
  cmd /c npx prisma db push --schema "$schemaPath"
}

if ($LASTEXITCODE -ne 0) {
  throw "Prisma command failed: $Command"
}
