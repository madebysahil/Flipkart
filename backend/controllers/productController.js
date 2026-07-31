const products = require('../products.json');

const getProducts = async (req, res) => {
  try {
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
