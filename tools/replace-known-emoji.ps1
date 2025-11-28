# Replace a small set of common mojibake tokens with the intended emoji across HTML files
# Creates .bak4 backups before writing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
if (-not $root) { $root = Get-Location }
Write-Output "Workspace root: $root"

# Build emoji targets via surrogate pairs (avoid literal emoji in the script body)
$cart = [char]0xD83D + [char]0xDED2   # 🛒 U+1F6D2
$castle = [char]0xD83C + [char]0xDFF0 # 🏰 U+1F3F0
$homeIcon = [char]0xD83C + [char]0xDFE0 # 🏠 U+1F3E0
$camera = [char]0xD83D + [char]0xDCF8  # 📸 U+1F4F8

# Known mojibake sequences seen in the site source
$replacements = @{
    'ðŸ›’' = $cart
    'ðŸ°' = $castle
    'ðŸ ' = $homeIcon
    'ðŸ“¸' = $camera
}

Get-ChildItem -Path $root -Recurse -Filter *.html | ForEach-Object {
    $path = $_.FullName
    try { $orig = Get-Content -Raw -Path $path -Encoding UTF8 -ErrorAction Stop } catch { Write-Warning "Could not read $path : $_"; return }
    $modified = $orig
    foreach ($k in $replacements.Keys) {
        if ($modified -like "*${k}*") {
            $modified = $modified -replace [regex]::Escape($k), $replacements[$k]
        }
    }
    if ($modified -ne $orig) {
        $bak = "$path.bak4"
        if (-not (Test-Path $bak)) { Copy-Item -Path $path -Destination $bak -Force; Write-Output "Backup created: $bak" } else { Write-Output "Backup exists: $bak" }
        $modified | Out-File -FilePath $path -Encoding utf8 -Force
        Write-Output "Replaced tokens in: $path"
    }
}

Write-Output "Done."