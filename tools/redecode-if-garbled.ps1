# Re-decode files that look mojibake-y by interpreting current text bytes as CP1252 and decoding as UTF8
# - creates a .bak3 backup before rewriting
# - targets files that contain typical mojibake markers: 'â', 'Ã', 'ð' (ASCII-safe checks)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
if (-not $root) { $root = Get-Location }
Write-Output "Workspace root: $root"

$markers = @('â', 'Ã', 'ð')

Get-ChildItem -Path $root -Recurse -Filter *.html | ForEach-Object {
    $path = $_.FullName
    try {
        $orig = Get-Content -Raw -Path $path -ErrorAction Stop -Encoding UTF8
    } catch {
        Write-Warning "Could not read $path : $_"
        return
    }

    $hasMarker = $false
    foreach ($m in $markers) {
        if ($orig -like "*${m}*") { $hasMarker = $true; break }
    }
    if (-not $hasMarker) { return }

    # Attempt safe re-decode: take the string's bytes in CP1252 and decode bytes as UTF8
    try {
        $cp1252 = [System.Text.Encoding]::GetEncoding(1252)
        $bytes = $cp1252.GetBytes($orig)
        $fixed = [System.Text.Encoding]::UTF8.GetString($bytes)
    } catch {
        Write-Warning "Re-decode failed for $path : $_"
        return
    }

    if ($fixed -ne $orig) {
        $bak = "$path.bak3"
        if (-not (Test-Path $bak)) { Copy-Item -Path $path -Destination $bak -Force; Write-Output "Backup created: $bak" } else { Write-Output "Backup exists: $bak" }
        $fixed | Out-File -FilePath $path -Encoding utf8 -Force
        Write-Output "Re-decoded (CP1252→UTF8): $path"
    } else {
        Write-Output "No change after re-decode: $path"
    }
}

Write-Output "Done."