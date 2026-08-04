const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname).filter(f => f.endsWith('.html'));

const mappings = [];
for (const file of files) {
  const html = fs.readFileSync(path.join(__dirname, file), 'utf8');
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(/\\n/g, ' ').trim() : null;
  
  // Try to find any div or span with line-through and a price
  let oldPrice = null;
  const priceMatches = html.matchAll(/text-decoration(?:-line)?\s*:\s*line-through[^>]*>.*?₹([0-9,]+)/gi);
  for (const match of priceMatches) {
    if (!oldPrice) oldPrice = match[1];
  }
  
  if (title && oldPrice) {
    oldPrice = parseInt(oldPrice.replace(/,/g, ''), 10);
    mappings.push({ file, title, oldPrice });
  }
}

const products = JSON.parse(fs.readFileSync(path.join(__dirname, 'backend', 'products.json'), 'utf8'));

console.log(`Found ${mappings.length} HTML files with prices.`);

for (const p of products) {
  let matched = null;
  for (const m of mappings) {
    // Basic fuzzy match: count how many words from products title are in HTML title
    const pWords = p.title.toLowerCase().split(/\\W+/).filter(w => w.length > 2);
    const mTitle = m.title.toLowerCase();
    let matches = 0;
    for (const w of pWords) {
      if (mTitle.includes(w)) matches++;
    }
    if (matches > pWords.length * 0.5) {
      matched = m;
      break;
    }
  }
  
  if (matched) {
    console.log(`Matched ${p.title} -> ${matched.oldPrice} (from ${matched.file})`);
    p.oldPrice = matched.oldPrice;
  } else {
    console.log(`NO MATCH for ${p.title}`);
  }
}

fs.writeFileSync(path.join(__dirname, 'backend', 'products.json'), JSON.stringify(products, null, 2));
console.log('Updated products.json!');
