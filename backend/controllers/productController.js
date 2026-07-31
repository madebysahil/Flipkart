const fs = require('fs');
const path = require('path');

let cachedProducts = null;

const loadProducts = () => {
  if (cachedProducts) return cachedProducts;
  
  try {
    const filePath = path.join(__dirname, '../../extra/products.js');
    let content = fs.readFileSync(filePath, 'utf-8');

    // Remove exports
    content = content.replace(/export default products;/, '');

    // Extract import statements
    const importRegex = /import\s+(\w+)\s+from\s+["'](.*?)["'];/g;
    let match;
    const imports = {};
    
    while ((match = importRegex.exec(content)) !== null) {
      const varName = match[1];
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
    const getProductsFn = new Function(content + '\nreturn products;');
    const productsArray = getProductsFn();

    cachedProducts = productsArray.map((p, index) => {
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

      // Generate a mock MongoDB-like ObjectId based on index
      const mockId = "6a6c8e8f8d1771a25c8a95" + (index < 10 ? '0' + index : index);

      return {
        _id: mockId,
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

    return cachedProducts;
  } catch (error) {
    console.error('Error loading static products:', error);
    return [];
  }
};

const getProducts = async (req, res) => {
  try {
    let products = loadProducts();
    if (req.query.keyword) {
      products = products.filter(p => p.title.toLowerCase().includes(req.query.keyword.toLowerCase()));
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const products = loadProducts();
    const product = products.find(p => p._id === req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById };
