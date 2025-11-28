const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (filePath.endsWith('.html')) results.push(filePath);
    }
  });
  return results;
}

function ensureHeadTags(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lower = content.toLowerCase();
  const hasViewport = lower.includes('<meta name="viewport"');
  const hasStyles = lower.includes('href="styles.css"') || lower.includes("href='styles.css'");
  const hasMobile = lower.includes('href="styles-mobile.css"') || lower.includes("href='styles-mobile.css'");

  if (hasViewport && hasStyles && hasMobile) return false;

  // Find position after the <meta charset ...> tag
  const charsetMatch = content.match(/<meta[^>]*charset=[^>]*>/i);
  let insertPos = -1;
  if (charsetMatch) {
    insertPos = content.indexOf(charsetMatch[0]) + charsetMatch[0].length;
  } else {
    // fallback: find opening <head>
    const headOpen = content.indexOf('<head');
    if (headOpen !== -1) {
      const headClose = content.indexOf('>', headOpen);
      if (headClose !== -1) insertPos = headClose + 1;
    }
  }

  if (insertPos === -1) return false; // can't find place to insert safely

  const linesToInsert = [];
  if (!hasViewport) linesToInsert.push('\n    <meta name="viewport" content="width=device-width, initial-scale=1">');
  if (!hasStyles) linesToInsert.push('\n    <link rel="stylesheet" href="styles.css">');
  if (!hasMobile) linesToInsert.push('\n    <link rel="stylesheet" href="styles-mobile.css" media="only screen and (max-width: 500px)">');

  if (linesToInsert.length === 0) return false;

  content = content.slice(0, insertPos) + linesToInsert.join('') + content.slice(insertPos);
  fs.writeFileSync(filePath, content, 'utf8');
  return true;
}

const base = path.resolve(__dirname, '..');
const allHtml = walk(base);
let changed = 0;
allHtml.forEach(file => {
  // skip node modules or vendor folders if any
  if (file.includes('node_modules')) return;
  if (ensureHeadTags(file)) {
    console.log('Updated:', file);
    changed++;
  }
});
console.log('Done. Files changed:', changed);
