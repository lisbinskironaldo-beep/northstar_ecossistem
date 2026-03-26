param(
  [string]$ApiBaseUrl = 'http://localhost:3001',
  [string]$AdminBaseUrl = 'http://localhost:3002'
)

$ErrorActionPreference = 'Stop'

function Wait-ForUrl {
  param(
    [Parameter(Mandatory = $true)]
    [string]$Url,
    [int]$TimeoutSeconds = 60
  )

  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)

  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
        return $response
      }
    } catch {
      Start-Sleep -Seconds 2
    }
  }

  throw "Timed out waiting for $Url"
}

Write-Output "Northstar Admin live validation"
Write-Output "API base: $ApiBaseUrl"
Write-Output "Admin base: $AdminBaseUrl"

$health = Invoke-RestMethod -Uri "$ApiBaseUrl/health"
Write-Output "API health: $($health.status)"

$recentActions = Invoke-RestMethod -Uri "$ApiBaseUrl/trust/moderation-actions/recent?limit=1"
$recentEvents = Invoke-RestMethod -Uri "$ApiBaseUrl/analytics/events/recent?limit=1"

$expectedActionType = if ($recentActions.Count -gt 0) { $recentActions[0].actionType } else { $null }
$expectedTargetId = if ($recentActions.Count -gt 0) { $recentActions[0].targetId } else { $null }
$expectedEventName = if ($recentEvents.Count -gt 0) { $recentEvents[0].eventName } else { $null }

$adminLog = "C:\dev\northstar_ecosystem\workspace\logs\admin-live.log"
$adminErrLog = "C:\dev\northstar_ecosystem\workspace\logs\admin-live.err.log"

cmd /c npm run build --workspace @northstar/admin-web

if (Test-Path $adminLog) {
  Remove-Item $adminLog -Force
}

if (Test-Path $adminErrLog) {
  Remove-Item $adminErrLog -Force
}

$process = Start-Process cmd.exe `
  -ArgumentList '/c', 'npm run start --workspace @northstar/admin-web -- --port 3002' `
  -WorkingDirectory 'C:\dev\northstar_ecosystem' `
  -RedirectStandardOutput $adminLog `
  -RedirectStandardError $adminErrLog `
  -PassThru

try {
  Wait-ForUrl -Url $AdminBaseUrl | Out-Null

  $homePage = Invoke-WebRequest -Uri $AdminBaseUrl -UseBasicParsing
  $reportsPage = Invoke-WebRequest -Uri "$AdminBaseUrl/reports" -UseBasicParsing
  $alertsPage = Invoke-WebRequest -Uri "$AdminBaseUrl/alerts" -UseBasicParsing
  $actionsPage = Invoke-WebRequest -Uri "$AdminBaseUrl/actions" -UseBasicParsing

  if ($homePage.Content -notmatch 'Northstar Admin') {
    throw 'Admin home did not render the expected title.'
  }

  if ($reportsPage.Content -notmatch 'Reports Queue') {
    throw 'Reports page did not render the expected heading.'
  }

  if ($alertsPage.Content -notmatch 'Alerts') {
    throw 'Alerts page did not render the expected heading.'
  }

  if ($actionsPage.Content -notmatch 'Moderation') {
    throw 'Actions page did not render the expected heading.'
  }

  if ($expectedActionType -and $actionsPage.Content -notmatch [regex]::Escape($expectedActionType)) {
    throw "Actions page did not render the expected moderation action type: $expectedActionType"
  }

  if ($expectedTargetId -and $actionsPage.Content -notmatch [regex]::Escape($expectedTargetId)) {
    throw "Actions page did not render the expected moderation target: $expectedTargetId"
  }

  if ($expectedEventName -and $homePage.Content -notmatch [regex]::Escape($expectedEventName)) {
    throw "Admin home did not render the expected analytics event: $expectedEventName"
  }

  Write-Output 'Admin live validation completed.'
  Write-Output "Rendered pages: /, /reports, /alerts, /actions"
  Write-Output "Validated action type: $expectedActionType"
  Write-Output "Validated target: $expectedTargetId"
  Write-Output "Validated event: $expectedEventName"
} finally {
  $adminConnection = Get-NetTCPConnection -LocalPort 3002 -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1

  if ($adminConnection) {
    Stop-Process -Id $adminConnection.OwningProcess -Force
  } elseif ($process -and !$process.HasExited) {
    Stop-Process -Id $process.Id -Force
  }
}
