# Targeted token re-decode script
# Scans .html files recursively and attempts CP1252->UTF8 re-decode for short mojibake tokens (e.g. sequences starting with 'ð')
# Creates a .bak5 backup for any modified file.

$enc1252 = [System.Text.Encoding]::GetEncoding(1252)
$encUtf8 = [System.Text.Encoding]::UTF8
$regex = 'ð[^\s<]{1,20}'

Get-ChildItem -Path . -Filter *.html -Recurse | ForEach-Object {
    $path = $_.FullName
    try {
        $content = Get-Content -Raw -Encoding UTF8 -ErrorAction Stop $path
    } catch {
        # If reading as UTF8 fails, fall back to default encoding read
        $content = Get-Content -Raw $path
    }

    $matches = [regex]::Matches($content, $regex)
    if ($matches.Count -eq 0) { return }

    $unique = New-Object System.Collections.Generic.HashSet[string]
    foreach ($m in $matches) { $unique.Add($m.Value) | Out-Null }

    $replacements = @{}
    foreach ($token in $unique) {
        # Try to re-decode this short token from CP1252 bytes -> UTF8 string
        $bytes = $enc1252.GetBytes($token)
        try {
            $decoded = $encUtf8.GetString($bytes)
        } catch {
            $decoded = $token
        }
        if ($decoded -ne $token) {
            $replacements[$token] = $decoded
        }
    }

    if ($replacements.Count -gt 0) {
        $backup = $path + '.bak5'
        Copy-Item -Path $path -Destination $backup -Force
        foreach ($k in $replacements.Keys) {
            $v = $replacements[$k]
            # Use simple literal replace to avoid regex substitution pitfalls
            $content = $content.Replace($k, $v)
        }
        # Write back as UTF8 (without BOM)
        [System.IO.File]::WriteAllText($path, $content, New-Object System.Text.UTF8Encoding($false))
        Write-Output "Fixed: $path  (tokens fixed: $($replacements.Count))  backup: $backup"
    }
}

Write-Output "Done running targeted token re-decode."
