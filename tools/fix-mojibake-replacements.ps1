# Replace common mojibake sequences in HTML files with correct Unicode characters.
# Backups (.bak) are created. This avoids guessing file encodings and directly fixes visible garbage sequences.

$replacements = @(
    @{p = [string]::Concat([char]0x00E2,[char]0x0080,[char]0x009C); r = [char]0x201C}, # â€œ -> “
    @{p = [string]::Concat([char]0x00E2,[char]0x0080,[char]0x009D); r = [char]0x201D}, # â€� -> ”
    @{p = [string]::Concat([char]0x00E2,[char]0x0080,[char]0x0099); r = [char]0x2019}, # â€™ -> ’
    @{p = [string]::Concat([char]0x00E2,[char]0x0080,[char]0x00A6); r = [char]0x2026}, # â€¦ -> …
    @{p = [string]::Concat([char]0x00E2,[char]0x0080,[char]0x0094); r = [char]0x2014}, # â€” -> —
    @{p = [string]::Concat([char]0x00C2,[char]0x00A0); r = " "}, # Â  -> regular space
    @{p = [string]::Concat([char]0x00C3,[char]0x00A9); r = [char]0x00E9}, # Ã© -> é
    @{p = [string]::Concat([char]0x00EF,[char]0x00BF,[char]0x00BD); r = ""}, # replacement � bytes -> remove
    @{p = [string]::Concat([char]0x00C3,[char]0x009B); r = [char]0x015B} # example: Ã› -> ś (add as needed)
)

Write-Host "Scanning .html files and replacing mojibake sequences (backups created)..."
$files = Get-ChildItem -Path . -Recurse -Include *.html -File
$changed = @()
foreach ($f in $files) {
    $text = Get-Content -Raw -Encoding UTF8 -Path $f.FullName
    $orig = $text
    foreach ($map in $replacements) {
        $pattern = [regex]::Escape($map.p)
        $text = $text -replace $pattern, $map.r
    }
    if ($text -ne $orig) {
        $bak = "$($f.FullName).bak"
        if (-not (Test-Path $bak)) { Copy-Item -Path $f.FullName -Destination $bak -Force }
        Set-Content -Path $f.FullName -Value $text -Encoding UTF8
        Write-Host "Fixed: $($f.FullName)"
        $changed += $f.FullName
    }
}

if ($changed.Count -eq 0) { Write-Host "No replacements made." } else { Write-Host "Replacements made in $($changed.Count) file(s)." }
Write-Host "Done."