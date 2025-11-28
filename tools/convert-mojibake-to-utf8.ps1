# Backup and convert HTML files that contain common mojibake sequences
# Usage: run from repo root. This script finds .html files containing mojibake patterns
# (like â€œ â€™ â€” Ã Â  etc), copies a .bak backup, reads them as CP1252, and writes UTF8.

$patterns = @('â€œ','â€�','â€™','â€”','â€¢','Ã','Â ','ðŸ')

Write-Host "Scanning for files containing mojibake patterns..."
$files = Get-ChildItem -Path . -Include *.html -Recurse -File | Where-Object {
    $content = Get-Content -Raw -Encoding Byte -Path $_.FullName
    $s = [System.Text.Encoding]::UTF8.GetString($content)
    foreach ($p in $patterns) { if ($s -like "*${p}*") { return $true } }
    return $false
}

if (-not $files) {
    Write-Host "No candidate files found. Exiting."
    exit 0
}

Write-Host "Found $($files.Count) file(s) to convert:`n"
$files | ForEach-Object { Write-Host " - $($_.FullName)" }

foreach ($f in $files) {
    try {
        $path = $f.FullName
        $bak = "$path.bak"
        if (-not (Test-Path $bak)) { Copy-Item -Path $path -Destination $bak -Force }
        Write-Host "Converting: $path (backup -> $bak)"
        # Read as CP1252 (Windows-1252) then write UTF8 without BOM
        $text = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::GetEncoding(1252))
        [System.IO.File]::WriteAllText($path, $text, [System.Text.Encoding]::UTF8)
        Write-Host " -> Converted to UTF-8"
    } catch {
        Write-Host "Error converting $($f.FullName): $_" -ForegroundColor Red
    }
}

Write-Host "Done."