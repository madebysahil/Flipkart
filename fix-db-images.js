const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, 'backend', 'products.json');
let products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

let updatedCount = 0;

for (const product of products) {
  if (product.images && Array.isArray(product.images)) {
    for (let i = 0; i < product.images.length; i++) {
      const url = product.images[i];
      // Check if it's a local image under /images/
      if (url.startsWith('/images/')) {
        // Replace .png, .jpg, .jpeg with .webp before any query parameters
        const newUrl = url.replace(/\.(png|jpg|jpeg)(\?.*)?$/i, '.webp$2');
        if (newUrl !== url) {
          product.images[i] = newUrl;
          updatedCount++;
        }
      }
    }
  }
}

if (updatedCount > 0) {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf8');
  console.log(`Updated ${updatedCount} local image paths to .webp in backend/products.json`);
} else {
  console.log('No local image paths needed updating.');
}
