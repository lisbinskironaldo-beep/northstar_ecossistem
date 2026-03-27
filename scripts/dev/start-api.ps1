$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')

Set-Location $projectRoot

cmd /c npm run build:api

if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

node services/api/dist/main.js
