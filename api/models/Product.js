const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  discount: { type: Number }, // percentage
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  images: [{ type: String }],
  category: { type: String, required: true },
  brand: { type: String },
  stock: { type: Number, required: true, default: 0 },
  highlights: [{ type: String }],
  specifications: [
    {
      category: String,
      items: [{ name: String, value: String }]
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
