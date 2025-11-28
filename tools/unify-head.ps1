$root = "C:\Users\caveg\OneDrive\Desktop\stuff\Youtube"
Get-ChildItem -Path $root -Recurse -Include *.html | ForEach-Object {
    $file = $_.FullName
    # Skip node_modules if present
    if ($file -match "node_modules") { return }
    $content = Get-Content -Raw -LiteralPath $file
    $lower = $content.ToLower()
    $hasViewport = $lower -match '<meta name="viewport"'
    $hasStyles = $lower -match 'href="styles.css"' -or $lower -match "href='styles.css'"
    $hasMobile = $lower -match 'href="styles-mobile.css"' -or $lower -match "href='styles-mobile.css'"

    if ($hasViewport -and $hasStyles -and $hasMobile) { return }

    # Find insertion point after meta charset if present
    $charsetPattern = '(?i)<meta[^>]*charset=[^>]*>'
    $m = [regex]::Match($content, $charsetPattern)
    if ($m.Success) {
        $insertPos = $m.Index + $m.Length
    } else {
        $headOpen = [regex]::Match($content, '(?i)<head[^>]*>')
        if ($headOpen.Success) { $insertPos = $headOpen.Index + $headOpen.Length } else { return }
    }

    $linesToInsert = ""
    if (-not $hasViewport) { $linesToInsert += "`r`n    <meta name='viewport' content='width=device-width, initial-scale=1'>" }
    if (-not $hasStyles) { $linesToInsert += "`r`n    <link rel='stylesheet' href='styles.css'>" }
    if (-not $hasMobile) { $linesToInsert += "`r`n    <link rel='stylesheet' href='styles-mobile.css' media='only screen and (max-width: 500px)'>" }

    $newContent = $content.Substring(0,$insertPos) + $linesToInsert + $content.Substring($insertPos)
    Set-Content -LiteralPath $file -Value $newContent -Encoding UTF8
    Write-Host "Updated: $file"
}
Write-Host "Done."
