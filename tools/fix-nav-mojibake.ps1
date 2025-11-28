# Safe batch fixer for common navigation mojibake sequences
# - creates a .bak copy (only if not already present)
# - replaces a few known mojibake sequences with correct characters
# - writes files back as UTF8

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
if (-not $root) { $root = Get-Location }
Write-Output "Workspace root: $root"

# Use ASCII-only script body. Build target Unicode strings at runtime so older PowerShell's parser
# doesn't choke on literal emoji in the .ps1 file.
$triangleDown = [char]0x25BC            # ▼
$triangleRight = [char]0x25B8           # ▸
# Surrogate pairs for non-BMP emoji
 $castle = [char]0xD83C + [char]0xDFF0  # U+1F3F0 (🏰)
 $shoppingCart = [char]0xD83D + [char]0xDED2 # U+1F6D2 (🛒)
 $homeIcon = [char]0xD83C + [char]0xDFE0    # U+1F3E0 (🏠)

$patterns = @{
    'â–¼' = $triangleDown
    'â–¶' = $triangleRight
    'ðŸ°' = $castle
    'ðŸ›’' = $shoppingCart
    'ðŸ ' = $homeIcon
}

Get-ChildItem -Path $root -Recurse -Filter *.html | ForEach-Object {
    $path = $_.FullName
    try {
        $orig = Get-Content -Raw -Path $path -ErrorAction Stop
    } catch {
        Write-Warning "Could not read $path : $_"
        return
    }
    $modified = $orig
    foreach ($k in $patterns.Keys) {
        if ($modified -match [regex]::Escape($k)) {
            $modified = $modified -replace [regex]::Escape($k), $patterns[$k]
        }
    }
    if ($modified -ne $orig) {
        $bak = "$path.bak"
        if (-not (Test-Path $bak)) {
            Copy-Item -Path $path -Destination $bak -Force
            Write-Output "Backup created: $bak"
        } else {
            Write-Output "Backup already exists for: $path"
        }
        # Write UTF8 (no BOM)
        $modified | Out-File -FilePath $path -Encoding utf8 -Force
        Write-Output "Patched: $path"
    }
}

Write-Output "Done."
