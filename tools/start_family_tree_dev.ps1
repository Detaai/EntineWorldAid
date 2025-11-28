# Start a simple static server and open the family-tree demo in dev mode
# Usage: right-click -> Run with PowerShell, or execute in PowerShell

$repoRoot = Resolve-Path "$PSScriptRoot\.."
Write-Host "Starting static server from: $repoRoot"

# Start python simple http.server in background
Start-Process -FilePath "python" -ArgumentList "-m","http.server","8000" -WorkingDirectory $repoRoot -WindowStyle Hidden
Start-Sleep -Seconds 1

# Open default browser to the demo (dev=1 bypasses password)
$uri = "http://localhost:8000/family-tree.html?dev=1"
Write-Host "Opening $uri"
Start-Process $uri

Write-Host "Server started (background). To stop it: find the python process and kill it, or close terminal running it."