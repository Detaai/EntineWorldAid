# Find HTML files that contain obvious mojibake markers and re-decode them (CP1252->UTF8)
# Creates .bak3 backups before writing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
if (-not $root) { $root = Get-Location }
Write-Output "Workspace root: $root"

# Patterns to search for (literal characters)
$patterns = @('ð', 'â', 'Ã')

# Build a set of matching files using Select-String to avoid manual recursive parsing
$matched = @{}
# Find all html files and test each one for markers (avoids globbing behavior differences)
Get-ChildItem -Path $root -Recurse -Filter *.html | ForEach-Object {
    $file = $_.FullName
    foreach ($p in $patterns) {
        try {
            if (Select-String -Path $file -Pattern $p -SimpleMatch -Quiet) {
                $matched[$file] = $true; break
            }
        } catch {
            Write-Warning "Select-String failed for $file pattern $p : $_"
        }
    }
}

$files = $matched.Keys
if (!$files) { Write-Output "No candidate files found."; exit 0 }

$cp1252 = [System.Text.Encoding]::GetEncoding(1252)

foreach ($path in $files) {
    Write-Output "Processing candidate: $path"
    try {
        # Read file using default system encoding to capture raw characters as seen by filesystem
        $orig = Get-Content -Raw -Path $path -Encoding Default -ErrorAction Stop
    } catch {
        Write-Warning "Could not read $path : $_"
        continue
    }
    try {
        $bytes = $cp1252.GetBytes($orig)
        $fixed = [System.Text.Encoding]::UTF8.GetString($bytes)
    } catch {
        Write-Warning "Re-decode error for $path : $_"
        continue
    }

    if ($fixed -ne $orig) {
        $bak = "$path.bak3"
        if (-not (Test-Path $bak)) { Copy-Item -Path $path -Destination $bak -Force; Write-Output "Backup created: $bak" } else { Write-Output "Backup exists: $bak" }
        $fixed | Out-File -FilePath $path -Encoding utf8 -Force
        Write-Output "Re-decoded (CP1252→UTF8): $path"
    } else {
        Write-Output "No change for: $path"
    }
}

Write-Output "Done."