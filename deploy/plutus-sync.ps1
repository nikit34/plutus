# plutus-sync: polls origin/main every 60s, rebuilds docker stack on new commits.
#
# Runs as a background PowerShell process on the Windows host (192.168.1.69).
# Register with Task Scheduler, action:
#   Program:   powershell.exe
#   Arguments: -NoProfile -ExecutionPolicy Bypass -File C:\Users\permi\plutus\deploy\plutus-sync.ps1
#   Trigger:   At startup
#
# Logs to $env:USERPROFILE\plutus-sync.log.
#
# Design choices (mirrors health-mdt-sync.ps1):
#   - No '2>$null' on git - PowerShell loses exit code when stderr is redirected.
#   - Every iteration logs a heartbeat - silence = dead process.
#   - Initial reconcile wrapped in try - Docker hiccup at startup must NOT stop polling.
#   - 'git reset --hard' over 'git pull' - survives local untracked files from failed builds.

$repo    = "$env:USERPROFILE\plutus"
$logPath = "$env:USERPROFILE\plutus-sync.log"
$composeFile = "docker-compose.prod.yml"

function Log($msg, $color = "White") {
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $msg"
    Write-Host $line -ForegroundColor $color
    try { Add-Content -Path $logPath -Value $line -ErrorAction SilentlyContinue } catch {}
}

Set-Location $repo
Log "=== plutus-sync starting, pid $PID, repo $repo ===" "Cyan"

Log "initial reconcile: docker compose -f $composeFile up -d --build" "Cyan"
try {
    docker compose -f $composeFile up -d --build 2>&1 | Out-String | ForEach-Object {
        $_.Split("`n") | Where-Object { $_.Trim() } | ForEach-Object { Log "  $_" "Gray" }
    }
    if ($LASTEXITCODE -eq 0) {
        Log "initial reconcile ok" "Green"
    } else {
        Log "initial reconcile returned $LASTEXITCODE (continuing to poll anyway)" "Yellow"
    }
} catch {
    Log "initial reconcile threw: $($_.Exception.Message) (continuing to poll)" "Yellow"
}

Log "entering poll loop (60s interval)" "Green"
$heartbeatEvery = 10
$iteration = 0

while ($true) {
    $iteration++
    try {
        Set-Location $repo

        $before = (git rev-parse HEAD 2>&1 | Select-Object -First 1).Trim()

        git fetch --quiet
        $fetchExit = $LASTEXITCODE

        if ($fetchExit -ne 0) {
            Log "fetch failed (exit $fetchExit)" "Yellow"
        } else {
            $remote = (git rev-parse origin/main 2>&1 | Select-Object -First 1).Trim()

            if ($before -ne $remote) {
                $shortBefore = $before.Substring(0, 7)
                $shortRemote = $remote.Substring(0, 7)
                Log "new commits $shortBefore -> $shortRemote, deploying..." "Yellow"

                git reset --hard origin/main 2>&1 | ForEach-Object { Log "  $_" "Gray" }

                docker compose -f $composeFile up -d --build 2>&1 | Out-String | ForEach-Object {
                    $_.Split("`n") | Where-Object { $_.Trim() } | ForEach-Object { Log "  $_" "Gray" }
                }

                if ($LASTEXITCODE -eq 0) {
                    Log "deployed $shortRemote ok" "Green"
                } else {
                    Log "deploy exit $LASTEXITCODE - stack may be broken, will retry next poll" "Red"
                }
            } elseif ($iteration % $heartbeatEvery -eq 0) {
                Log "in sync at $($before.Substring(0, 7))" "DarkGray"
            }
        }
    } catch {
        Log "iteration $iteration threw: $($_.Exception.Message)" "Red"
    }

    Start-Sleep -Seconds 60
}
