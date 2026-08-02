const fs = require('fs');
const path = require('path');

const getProducts = async (req, res) => {
  try {
    const productsPath = path.join(__dirname, '../products.json');
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    
    // Apply user overrides
    const configPath = path.join(__dirname, '../../config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.PRODUCTS) {
        products.forEach(p => {
          if (config.PRODUCTS[p._id]) {
            p.price = config.PRODUCTS[p._id].sellingPrice;
            p.oldPrice = config.PRODUCTS[p._id].originalMrp;
            p.discount = config.PRODUCTS[p._id].discountPercent;
          }
        });
      }
    }

    let filteredProducts = products;
    if (req.query.keyword) {
      filteredProducts = filteredProducts.filter(p => p.title.toLowerCase().includes(req.query.keyword.toLowerCase()));
    }
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const productsPath = path.join(__dirname, '../products.json');
    const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const product = products.find(p => p._id === req.params.id);
    if (product) {
      // Apply user overrides
      const configPath = path.join(__dirname, '../../config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.PRODUCTS && config.PRODUCTS[product._id]) {
          product.price = config.PRODUCTS[product._id].sellingPrice;
          product.oldPrice = config.PRODUCTS[product._id].originalMrp;
          product.discount = config.PRODUCTS[product._id].discountPercent;
        }
      }
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById };
