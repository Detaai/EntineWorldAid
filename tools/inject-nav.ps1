$nav = @'
<nav class="main-nav">
  <div class="nav-container">
    <a href="index.html" class="nav-logo">🏰 Entine Calculator</a>
    <ul class="nav-menu">
      <li><a href="home-page.html">Home</a></li>
      <li class="dropdown">
        <a href="#">Tools ▼</a>
        <div class="dropdown-content">
          <a href="age-calculator.html">Age Calculator</a>
          <a href="language-translator.html">Language Translator</a>
          <a href="money-converter.html">Money Converter</a>
          <a href="name-generator.html">Name Generator</a>
          <a href="fight.html">Conflict Generator</a>
        </div>
      </li>
      <li class="dropdown">
        <a href="#">World ▼</a>
        <div class="dropdown-content">
          <a href="cast.html">The Cast</a>
          <a href="library.html">The Library</a>
          <a href="home-maker.html">Magic Codex</a>
          <a href="otherworld.html">Other Worlds</a>
        </div>
      </li>
      <li><a href="online-store-amazon/src/index.html">🛒 Store</a></li>
      <li><a href="references.html">References</a></li>
    </ul>
    <div class="hamburger">
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</nav>
'@

$scriptTag = '<script type="module" src="navigation.js"></script>'

$root = Get-Location
$files = Get-ChildItem -Path $root -Recurse -Include *.html -File

foreach ($f in $files) {
    $path = $f.FullName
    $content = Get-Content -Raw -LiteralPath $path

    $hasNav = $content -match '<nav\s+class=\"main-nav\"'
    $hasScript = $content -match 'navigation\.js'

    if (-not $hasNav) {
        if ($content -match '(<body[^>]*>)') {
            $content = $content -replace '(<body[^>]*>)', "`$1`n$nav"
            Write-Host "Inserted nav into: $path"
        } else {
            Write-Host "No <body> tag found in $path -- skipping"
            continue
        }
    }

    if (-not $hasScript) {
        if ($content -match '(</body>)') {
            $content = $content -replace '(</body>)', "    $scriptTag`n$1"
            Write-Host "Inserted script into: $path"
        } else {
            Write-Host "No </body> tag found in $path -- cannot insert script"
        }
    }

    Set-Content -LiteralPath $path -Value $content -Encoding UTF8
}

Write-Host "Done."