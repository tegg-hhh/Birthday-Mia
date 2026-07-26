Param(
    [int]$DebounceMs = 3000,
    [string]$Branch = 'main'
)

$folder = Split-Path -Path $MyInvocation.MyCommand.Definition -Parent
Set-Location $folder
Write-Host "Starting auto-push watcher in $folder (branch $Branch). Debounce ${DebounceMs}ms"

$fsw = New-Object System.IO.FileSystemWatcher $folder -Property @{ 
    IncludeSubdirectories = $true
    Filter = '*.*'
    EnableRaisingEvents = $true
}

$timer = New-Object System.Timers.Timer
$timer.AutoReset = $false
$timer.Interval = $DebounceMs

Register-ObjectEvent $timer Elapsed -Action {
    try {
        $status = (& git status --porcelain) -join "`n"
        if ([string]::IsNullOrWhiteSpace($status)) {
            Write-Host "$(Get-Date -Format o): No changes to commit."
        } else {
            Write-Host "$(Get-Date -Format o): Changes detected — committing and pushing..."
            & git add -A
            & git commit -m ("Auto-save: {0}" -f (Get-Date -Format o))
            & git push origin $Branch
            Write-Host "$(Get-Date -Format o): Changes pushed."
        }
    } catch {
        Write-Warning "Auto-push failed: $_"
    }
} | Out-Null

$action = {
    $timer.Stop()
    $timer.Start()
}

Register-ObjectEvent $fsw Changed -Action $action | Out-Null
Register-ObjectEvent $fsw Created -Action $action | Out-Null
Register-ObjectEvent $fsw Deleted -Action $action | Out-Null
Register-ObjectEvent $fsw Renamed -Action $action | Out-Null

Write-Host "Watching for file changes. Press Ctrl+C to stop."
try {
    while ($true) { Start-Sleep -Seconds 1 }
} finally {
    $fsw.EnableRaisingEvents = $false
}
