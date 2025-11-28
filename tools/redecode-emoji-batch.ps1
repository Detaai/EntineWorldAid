# Re-decode files that contain 'ðŸ' by interpreting their current UTF-8 text bytes as Windows-1252 bytes and decoding as UTF-8.
# Creates .bak3 backups.

$files = Get-ChildItem -Path . -Recurse -Include *.html -File
$count=0
foreach ($f in $files) {
    $path = $f.FullName
    $text = Get-Content -Raw -Encoding UTF8 -Path $path
    if ($text -like '*ðŸ*') {
        $bak = "$path.bak3"
        if (-not (Test-Path $bak)) { Copy-Item -Path $path -Destination $bak -Force }
        Write-Host "Re-decoding: $path"
        $bytes = [System.Text.Encoding]::GetEncoding(1252).GetBytes($text)
        $fixed = [System.Text.Encoding]::UTF8.GetString($bytes)
        Set-Content -Path $path -Value $fixed -Encoding UTF8
        $count++
    }
}
Write-Host "Done. Files re-decoded: $count"