$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$mobileEnvPath = Join-Path $projectRoot 'apps\echo-mobile\.env.local'

function Get-PrimaryLanIp {
  $defaultRoute = Get-NetRoute -AddressFamily IPv4 -DestinationPrefix '0.0.0.0/0' |
    Sort-Object RouteMetric, InterfaceMetric |
    Select-Object -First 1

  if (-not $defaultRoute) {
    throw 'Unable to find the default IPv4 route for the current network.'
  }

  $ipAddress = Get-NetIPAddress -AddressFamily IPv4 -InterfaceIndex $defaultRoute.InterfaceIndex |
    Where-Object {
      $_.AddressState -eq 'Preferred' -and
      $_.IPAddress -notlike '127.*' -and
      $_.IPAddress -notlike '169.254*'
    } |
    Select-Object -ExpandProperty IPAddress -First 1

  if (-not $ipAddress) {
    throw 'Unable to resolve the active LAN IPv4 address for Echo mobile.'
  }

  return $ipAddress
}

function Read-QuotedEnvValue {
  param(
    [string]$Name,
    [string]$Path
  )

  if (-not (Test-Path $Path)) {
    return $null
  }

  $pattern = "^\s*$Name\s*=\s*""?(.*?)""?\s*$"
  foreach ($line in Get-Content -Path $Path) {
    if ($line -match $pattern) {
      return $matches[1]
    }
  }

  return $null
}

function Get-AvailableMetroPort {
  $candidatePorts = @(8082, 8083, 8084, 8085)

  foreach ($candidatePort in $candidatePorts) {
    $isListening = Get-NetTCPConnection -LocalPort $candidatePort -State Listen -ErrorAction SilentlyContinue

    if (-not $isListening) {
      return $candidatePort
    }
  }

  throw 'Unable to find a free Metro port for Echo mobile LAN mode.'
}

$lanIp = Get-PrimaryLanIp
$apiBaseUrl = "http://$lanIp`:3001"
$metroPort = Get-AvailableMetroPort
$demoUserId = Read-QuotedEnvValue -Name 'EXPO_PUBLIC_DEMO_USER_ID' -Path $mobileEnvPath
$demoCreatorId = Read-QuotedEnvValue -Name 'EXPO_PUBLIC_DEMO_CREATOR_ID' -Path $mobileEnvPath

$envLines = @(
  "EXPO_PUBLIC_API_BASE_URL=""$apiBaseUrl"""
)

if ($demoUserId) {
  $envLines += "EXPO_PUBLIC_DEMO_USER_ID=""$demoUserId"""
}

if ($demoCreatorId) {
  $envLines += "EXPO_PUBLIC_DEMO_CREATOR_ID=""$demoCreatorId"""
}

Set-Content -Path $mobileEnvPath -Value ($envLines -join "`r`n") -Encoding ASCII

$env:EXPO_PUBLIC_API_BASE_URL = $apiBaseUrl

if ($demoUserId) {
  $env:EXPO_PUBLIC_DEMO_USER_ID = $demoUserId
}

if ($demoCreatorId) {
  $env:EXPO_PUBLIC_DEMO_CREATOR_ID = $demoCreatorId
}

Write-Host "Echo mobile LAN mode will use API base: $apiBaseUrl"
Write-Host "Echo mobile LAN mode will use Metro port: $metroPort"

Set-Location $projectRoot
cmd /c npm run start --workspace @northstar/echo-mobile -- --lan --clear --port $metroPort
exit $LASTEXITCODE
