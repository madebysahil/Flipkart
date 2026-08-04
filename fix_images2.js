const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, 'backend', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

let modified = false;

products.forEach(p => {
  if (p.images) {
    p.images = p.images.map(img => {
       if (img.includes(' 1x,')) {
           img = img.split(' ')[0];
           modified = true;
       }
       if (!img.includes('?q=')) {
           img = img + '?q=80';
           modified = true;
       }
       return img;
    });
    // Deduplicate array
    p.images = [...new Set(p.images)];
  }
});

if (modified) {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log('Fixed image URLs!');
} else {
  console.log('No images needed fixing.');
}
