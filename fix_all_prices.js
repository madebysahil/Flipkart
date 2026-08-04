const fs = require('fs');
const path = require('path');

const manualMap = {
  "LG LR600": null,
  "Atomberg": "atomberg.html",
  "Apple iPhone": "iphone.html",
  "Orient Electric": "cooler.html",
  "Mivi Fort": "soundbar.html",
  "Safari Keplar": "luggage.html",
  "BAJAJ": "bajaj.html",
  "LG 2025 Model": "lg_ac.html",
  "Leader Gladiator": "cycle.html",
  "Morphy Richards": "kettle.html",
  "vivo v50": "vivo.html",
  "SONY Bravia": "sony_tv.html",
  "Samsung 189 L": "fridge.html",
  "HRX Kyoto": "next_item.html",
  "Prestige Nutrifry": "air_fryer.html",
  "Prestige Svachh": "cooker.html",
  "Crompton": "new_item.html",
  "Pigeon": "induction.html",
  "realme TechLife": "washing_machine.html",
  "Prestige Popular": "combo_cooker.html",
  "Prestige Festival": "cookware.html",
  "Samsung 23 L": "microwave.html",
  "MILTON": "next_item2.html"
};

const productsPath = path.join(__dirname, 'backend', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

for (const p of products) {
  let file = null;
  for (const key in manualMap) {
    if (p.title.includes(key)) {
      file = manualMap[key];
      break;
    }
  }

  if (file) {
    const html = fs.readFileSync(path.join(__dirname, file), 'utf8');
    const priceMatches = html.match(/₹([0-9,]+)/g) || [];
    
    // Extract unique numeric prices
    const prices = [...new Set(priceMatches.map(m => parseInt(m.replace(/[^0-9]/g, ''), 10)))]
      .filter(x => !isNaN(x) && x > p.price);
    
    // Approximate original price based on current logic
    const approx = p.price / (1 - p.discount / 100);
    
    if (prices.length > 0) {
      // Find the price closest to the approx price
      let bestPrice = prices[0];
      let minDiff = Math.abs(bestPrice - approx);
      for (const pr of prices) {
        const diff = Math.abs(pr - approx);
        if (diff < minDiff) {
          minDiff = diff;
          bestPrice = pr;
        }
      }
      console.log(`[${p.title}] Selling: ${p.price}, Approx: ${Math.round(approx)}, Found Real OldPrice: ${bestPrice}`);
      p.oldPrice = bestPrice;
    } else {
      console.log(`[${p.title}] No valid prices found in ${file}. Selling: ${p.price}, Approx: ${Math.round(approx)}`);
    }
  } else {
    console.log(`[${p.title}] No HTML file mapped. Selling: ${p.price}`);
  }
}

fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
console.log('Done!');
