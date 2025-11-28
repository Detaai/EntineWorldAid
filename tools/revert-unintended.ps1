$root = "C:\Users\caveg\OneDrive\Desktop\stuff"
$patterns = @(
    "<meta name='viewport' content='width=device-width, initial-scale=1'>",
    "<link rel='stylesheet' href='styles.css'>",
    "<link rel='stylesheet' href='styles-mobile.css' media='only screen and (max-width: 500px)'>"
)
$changed = @()
Get-ChildItem -Path $root -Recurse -Include *.html -ErrorAction SilentlyContinue | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content -Raw -LiteralPath $file -ErrorAction SilentlyContinue
    if (-not $content) { return }
    $original = $content
    foreach ($p in $patterns) {
        $content = $content -replace [regex]::Escape($p), ''
    }
    if ($content -ne $original) {
        Set-Content -LiteralPath $file -Value $content -Encoding UTF8
        $changed += $file
    }
}
if ($changed.Count -gt 0) {
    Write-Host "Reverted inserted lines from the following files:"
    $changed | ForEach-Object { Write-Host " - $_" }
} else {
    Write-Host "No unintended inserted lines found."
}
