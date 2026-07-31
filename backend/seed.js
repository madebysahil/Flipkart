const fs = require('fs');
const path = require('path');
const Product = require('./models/Product');

const seedProducts = async () => {
  try {
    const filePath = path.join(__dirname, '../extra/products.js');
    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove exports
    content = content.replace(/export default products;/, '');

    // Extract import statements
    const importRegex = /import\s+(\w+)\s+from\s+["'](.*?)["'];/g;
    let match;
    const imports = {};
    
    while ((match = importRegex.exec(content)) !== null) {
      const varName = match[1];
      // Convert path like "../assets/images/products/..." to "/images/products/..."
      let publicPath = match[2].replace('../assets/images/', '/images/');
      imports[varName] = publicPath;
    }

    // Strip imports from content
    content = content.replace(/import.*?from.*?;/g, '');

    // Replace variables in text with string literals
    for (const [varName, pubPath] of Object.entries(imports)) {
      const varRegex = new RegExp(`\\b${varName}\\b`, 'g');
      content = content.replace(varRegex, `"${pubPath}"`);
    }

    // Evaluate
    const getProducts = new Function(content + '\nreturn products;');
    const productsArray = getProducts();

    console.log(`Extracted ${productsArray.length} products.`);

    await Product.deleteMany();

    const formattedProducts = productsArray.map(p => {
      let specs = [];
      if (p.specifications) {
         for (const [catName, catItems] of Object.entries(p.specifications)) {
            const items = [];
            for (const [itemName, itemValue] of Object.entries(catItems)) {
               items.push({ name: itemName, value: String(itemValue) });
            }
            specs.push({ category: catName, items });
         }
      }

      return {
        title: p.name,
        description: (p.highlights && p.highlights.join('\n')) || '',
        price: p.price,
        oldPrice: p.oldPrice,
        images: p.images,
        category: p.category,
        brand: p.brand,
        countInStock: 100,
        rating: p.rating,
        numReviews: p.reviews || 0,
        highlights: p.highlights || [],
        specifications: specs
      };
    });

    await Product.insertMany(formattedProducts);
    console.log('Products seeded successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
  }
};

module.exports = seedProducts;
