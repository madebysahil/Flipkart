require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('../backend/config/db');

// Route imports
const authRoutes = require('../backend/routes/authRoutes');
const productRoutes = require('../backend/routes/productRoutes');
const cartRoutes = require('../backend/routes/cartRoutes');
const userRoutes = require('../backend/routes/userRoutes');
const paymentRoutes = require('../backend/routes/paymentRoutes');

// Initialize App
const app = express();

// Connect DB
connectDB().then(() => {
  // If no products exist, seed them automatically
  const Product = require('../backend/models/Product');
  Product.countDocuments().then(async count => {
    if (count === 0) {
      console.log('No products found, seeding from extra/products.js...');
      const seedProducts = require('../backend/seed');
      await seedProducts();
    }
  });
});

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payment', paymentRoutes);

// Basic Route
app.get('/', (req, res) => {
  res.send('Flipkart Clone API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
