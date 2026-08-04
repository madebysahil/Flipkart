const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, 'backend', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

let modified = false;

products.forEach(p => {
  // Fix specifications
  if (p.specifications && p.specifications.length > 0) {
    if (!p.specifications[0].items) {
      p.specifications = [
        {
          category: "General",
          items: p.specifications
        }
      ];
      modified = true;
    }
  }

  // Fix reviews
  if (p.reviews && p.reviews.length > 0) {
    p.reviews.forEach(r => {
      if (r.user && !r.author) {
        r.author = r.user;
        r.title = "Good Product";
        r.date = "2 days ago";
        r.location = "India";
        r.likes = Math.floor(Math.random() * 100);
        r.dislikes = Math.floor(Math.random() * 5);
        r.images = [];
        delete r.user;
        modified = true;
      }
    });
  }
});

if (modified) {
  fs.writeFileSync(productsPath, JSON.stringify(products, null, 2));
  console.log('Fixed products.json!');
} else {
  console.log('No fixes needed.');
}
