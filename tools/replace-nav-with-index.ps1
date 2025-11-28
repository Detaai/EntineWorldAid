<#
Replaces the <nav class="main-nav">...</nav> block in all HTML files (except index.html)
with the same block from index.html. Creates a .bak backup if one doesn't already exist.

This avoids embedding emoji literals in the script by reading the nav block from index.html at runtime.
#>

$root = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
if (-not $root) { $root = Get-Location }
Write-Output "Workspace root: $root"

$indexPath = Join-Path $root 'index.html'
if (-not (Test-Path $indexPath)) { Write-Error "index.html not found at $indexPath"; exit 1 }

$indexContent = Get-Content -Raw -Path $indexPath -ErrorAction Stop

$navMatch = [System.Text.RegularExpressions.Regex]::Match($indexContent, '<nav\s+class="main-nav">.*?</nav>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
if (-not $navMatch.Success) { Write-Error "Could not find <nav class=\"main-nav\"> block in index.html"; exit 1 }

$goodNav = $navMatch.Value

# Process all .html files
Get-ChildItem -Path $root -Recurse -Filter *.html | ForEach-Object {
    $path = $_.FullName
    if ($path -ieq $indexPath) { return }
    try {
        $orig = Get-Content -Raw -Path $path -ErrorAction Stop
    } catch {
        Write-Warning "Could not read $path : $_"
        return
    }

    $pattern = '<nav\s+class="main-nav">.*?</nav>'
    $rx = New-Object System.Text.RegularExpressions.Regex($pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
    if ($rx.IsMatch($orig)) {
        # Replace all nav blocks in the file with the canonical nav from index.html
        $new = $rx.Replace($orig, $goodNav)
        if ($new -ne $orig) {
            $bak = "$path.bak"
            if (-not (Test-Path $bak)) { Copy-Item -Path $path -Destination $bak -Force; Write-Output "Backup created: $bak" } else { Write-Output "Backup exists: $bak" }
            $new | Out-File -FilePath $path -Encoding utf8 -Force
            Write-Output "Replaced nav in: $path"
        }
    } else {
        Write-Output "No nav block found in: $path"
    }
}

Write-Output "Done."
