const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, 'backend', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

let modified = false;

products.forEach(p => {
  // We want: discount = (oldPrice - price) / oldPrice * 100
  // discount / 100 = 1 - (price / oldPrice)
  // price / oldPrice = 1 - (discount / 100)
  // oldPrice = price / (1 - (discount / 100))
  
  if (p.price && p.discount && p.discount > 0 && p.discount < 100) {
    const expectedOldPrice = Math.round(p.price / (1 - (p.discount / 100)));
    if (p.oldPrice !== expectedOldPrice) {
      p.oldPrice = expectedOldPrice;
      modified = true;
    }
  }
});

if (modified) {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log('Fixed MRPs for all products!');
} else {
  console.log('No MRPs needed fixing.');
}
