param(
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$envFile = Join-Path $projectRoot '.env'
$envExampleFile = Join-Path $projectRoot '.env.example'

function Import-EnvFile {
  param([string]$Path)

  if (-not (Test-Path $Path)) {
    return
  }

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

    $existingValue = [System.Environment]::GetEnvironmentVariable($name, 'Process')

    if ($name -and -not $existingValue) {
      Set-Item -Path "Env:$name" -Value $value
    }
  }
}

Import-EnvFile -Path $envExampleFile
Import-EnvFile -Path $envFile

$apiBaseUrl = $env:NORTHSTAR_API_BASE_URL
if (-not $apiBaseUrl) {
  $apiBaseUrl = 'http://localhost:3001'
}

$demoUserId = $env:EXPO_PUBLIC_DEMO_USER_ID
$demoCreatorId = $env:EXPO_PUBLIC_DEMO_CREATOR_ID

$steps = @(
  'check API health',
  'load Echo tracks',
  'create save for first track',
  'record playback for first track',
  'follow demo creator',
  'create report against first track',
  'create moderation action linked to that report',
  'read admin-facing trust and analytics endpoints'
)

Write-Host 'Northstar Echo live verification flow'
Write-Host "API base: $apiBaseUrl"
Write-Host "Demo user: $demoUserId"
Write-Host "Demo creator: $demoCreatorId"
Write-Host ''

if ($DryRun) {
  Write-Host 'Dry run enabled. Planned steps:'
  $steps | ForEach-Object { Write-Host " - $_" }
  exit 0
}

if (-not $demoUserId -or -not $demoCreatorId) {
  throw 'EXPO_PUBLIC_DEMO_USER_ID and EXPO_PUBLIC_DEMO_CREATOR_ID must be set before verification.'
}

$health = Invoke-RestMethod -Uri "$apiBaseUrl/health" -Method Get
Write-Host "Health: $($health.status)"

$tracks = Invoke-RestMethod -Uri "$apiBaseUrl/content/tracks?surface=echo&limit=5" -Method Get
if (-not $tracks -or $tracks.Count -eq 0) {
  throw 'No Echo tracks available. Run the demo seed first.'
}

$firstTrack = $tracks[0]
Write-Host "Using track: $($firstTrack.id) / $($firstTrack.title)"

$save = Invoke-RestMethod -Uri "$apiBaseUrl/content/tracks/$($firstTrack.id)/saves" -Method Post -ContentType 'application/json' -Body (@{
  userId = $demoUserId
} | ConvertTo-Json)
Write-Host "Save created or reused: $($save.id)"

$playback = Invoke-RestMethod -Uri "$apiBaseUrl/content/tracks/$($firstTrack.id)/playbacks" -Method Post -ContentType 'application/json' -Body (@{
  userId = $demoUserId
  listenedMs = 20000
  completionRatio = 0.66
  replayCountInSession = 0
  sourceContext = 'verification-script'
} | ConvertTo-Json)
Write-Host "Playback recorded: $($playback.id)"

$follow = Invoke-RestMethod -Uri "$apiBaseUrl/creators/$demoCreatorId/follows" -Method Post -ContentType 'application/json' -Body (@{
  userId = $demoUserId
} | ConvertTo-Json)
Write-Host "Follow created or reused: $($follow.id)"

$report = Invoke-RestMethod -Uri "$apiBaseUrl/trust/reports" -Method Post -ContentType 'application/json' -Body (@{
  reporterUserId = $demoUserId
  contentId = $firstTrack.id
  reportReason = 'low_quality_spam'
  reportSource = 'system'
} | ConvertTo-Json)
Write-Host "Report created: $($report.id)"

$moderation = Invoke-RestMethod -Uri "$apiBaseUrl/trust/moderation-actions" -Method Post -ContentType 'application/json' -Body (@{
  reportId = $report.id
  targetType = 'content'
  targetId = $firstTrack.id
  actionType = 'reduce_reach'
  actionReason = 'Verification script moderation'
  createdBy = 'verification-script'
} | ConvertTo-Json)
Write-Host "Moderation action created: $($moderation.id)"

$openReports = Invoke-RestMethod -Uri "$apiBaseUrl/trust/reports/open" -Method Get
$recentActions = Invoke-RestMethod -Uri "$apiBaseUrl/trust/moderation-actions/recent?limit=5" -Method Get
$recentEvents = Invoke-RestMethod -Uri "$apiBaseUrl/analytics/events/recent?limit=10" -Method Get

Write-Host ''
Write-Host "Open reports remaining: $($openReports.Count)"
Write-Host "Recent moderation actions read: $($recentActions.Count)"
Write-Host "Recent analytics events read: $($recentEvents.Count)"
Write-Host 'Echo live verification flow completed.'
