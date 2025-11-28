param(
  [string[]]$targets = @('index.html','character-result.html','online-store-amazon/src/index.html')
)

foreach ($rel in $targets) {
  $path = Join-Path (Get-Location) $rel
  if (-not (Test-Path $path)) { Write-Host "Not found: $path"; continue }
  $bak = "$path.bak"
  if (-not (Test-Path $bak)) { Copy-Item -Path $path -Destination $bak -Force; Write-Host "Backup created: $bak" }
  try {
    Write-Host "Processing: $path"
    # Read file as UTF8 (how it's currently interpreted), then reinterpret those characters as CP1252 bytes and decode as UTF8
    $text = Get-Content -Raw -Encoding UTF8 -Path $path
    $bytes = [System.Text.Encoding]::GetEncoding(1252).GetBytes($text)
    $fixed = [System.Text.Encoding]::UTF8.GetString($bytes)
    Set-Content -Path $path -Value $fixed -Encoding UTF8
    Write-Host "Re-decoded (CP1252→UTF8): $path"
  } catch {
    Write-Host "Error processing" $path $_ -ForegroundColor Red
  }
}
Write-Host "Done."