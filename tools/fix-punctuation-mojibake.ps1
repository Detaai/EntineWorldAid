# Conservative replacements of common mojibake sequences in HTML files
# - creates a .bak2 backup when modifying a file
# - replaces only well-known sequences to avoid accidental corruption

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
if (-not $root) { $root = Get-Location }
Write-Output "Workspace root: $root"

$patterns = @{
    'â€™' = '’'
    'â€˜' = '‘'
    'â€œ' = '“'
    'â€�' = '”'
    'â€”' = '—'
    'â€“' = '–'
    'â€¦' = '…'
    'Â ' = ' '
    'Ã©' = 'é'
    'Ã¨' = 'è'
    'Ãª' = 'ê'
    'Ã«' = 'ë'
    'Ã´' = 'ô'
    'Ã¹' = 'ù'
    'Ã»' = 'û'
    'Ã¢' = 'â'
    'Ã§' = 'ç'
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
        $bak = "$path.bak2"
        if (-not (Test-Path $bak)) {
            Copy-Item -Path $path -Destination $bak -Force
            Write-Output "Backup created: $bak"
        } else {
            Write-Output "Backup already exists for: $path"
        }
        $modified | Out-File -FilePath $path -Encoding utf8 -Force
        Write-Output "Patched: $path"
    }
}

Write-Output "Done."