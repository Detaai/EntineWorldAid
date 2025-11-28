# Find files that still contain obvious UTF-8-when-read-as-latin1 mojibake like 'ðŸ' and attempt a latin1->UTF8 reinterpret.
# Backup before writing (.bak2)

$targets = Get-ChildItem -Path . -Include *.html -Recurse -File | Where-Object {
    $t = Get-Content -Raw -Encoding UTF8 -Path $_.FullName
    return $t -match 'ðŸ|Ã' # heuristic; adjust as needed
}

if (-not $targets) { Write-Host "No candidate files for re-decode."; exit 0 }

foreach ($f in $targets) {
    $path = $f.FullName
    $bak2 = "$path.bak2"
    if (-not (Test-Path $bak2)) { Copy-Item -Path $path -Destination $bak2 -Force }
    Write-Host "Re-decode attempt: $path"
    $text = Get-Content -Raw -Encoding UTF8 -Path $path
    # Interpret current UTF8-decoded chars as Windows-1252 bytes, then decode those bytes as UTF8
    $bytes = [System.Text.Encoding]::GetEncoding(1252).GetBytes($text)
    $fixed = [System.Text.Encoding]::UTF8.GetString($bytes)
    Set-Content -Path $path -Value $fixed -Encoding UTF8
    Write-Host " -> Re-decoded and written (backup .bak2 created)"
}

Write-Host "Done."