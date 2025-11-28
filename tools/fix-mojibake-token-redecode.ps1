# Find mojibake tokens like sequences starting with 'ð', 'â', or 'Ã' and attempt per-token CP1252->UTF8 re-decode
# Creates .bak2 backups before writing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
if (-not $root) { $root = Get-Location }
Write-Output "Workspace root: $root"

$pattern = '(ð[^\s<]{1,12}|â[^\s<]{1,12}|Ã[^\s<]{1,12})'
$rx = [regex]$pattern
$cp1252 = [System.Text.Encoding]::GetEncoding(1252)

Get-ChildItem -Path $root -Recurse -Filter *.html | ForEach-Object {
    $path = $_.FullName
    try {
        $orig = Get-Content -Raw -Path $path -Encoding UTF8 -ErrorAction Stop
    } catch {
        Write-Warning "Could not read $path : $_"
        return
    }

    $matches = $rx.Matches($orig)
    if ($matches.Count -eq 0) { return }

    $new = $orig
    $changed = $false
    foreach ($m in $matches) {
        $token = $m.Value
        try {
            $bytes = $cp1252.GetBytes($token)
            $fixed = [System.Text.Encoding]::UTF8.GetString($bytes)
        } catch {
            Write-Warning "Failed to re-decode token '$token' in $path : $_"
            continue
        }
        if ($fixed -ne $token) {
            $new = $new.Replace($token, $fixed)
            $changed = $true
            Write-Output "Token fixed in $path : '$token' -> '$fixed'"
        }
    }

    if ($changed) {
        $bak = "$path.bak2"
        if (-not (Test-Path $bak)) { Copy-Item -Path $path -Destination $bak -Force; Write-Output "Backup created: $bak" } else { Write-Output "Backup exists: $bak" }
        $new | Out-File -FilePath $path -Encoding utf8 -Force
        Write-Output "Patched file: $path"
    }
}

Write-Output "Done."