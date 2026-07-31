const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestEmail: { type: String },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      image: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  shippingAddress: {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    pincode: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    houseNumber: { type: String, required: true },
    area: { type: String, required: true },
    landmark: { type: String }
  },
  paymentMethod: { type: String, required: true, default: 'Cashfree' },
  paymentResult: {
    paymentId: { type: String },
    orderId: { type: String },
    status: { type: String },
    update_time: { type: String }
  },
  itemsPrice: { type: Number, required: true, default: 0.0 },
  shippingPrice: { type: Number, required: true, default: 0.0 },
  totalPrice: { type: Number, required: true, default: 0.0 },
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  isDelivered: { type: Boolean, required: true, default: false },
  deliveredAt: { type: Date },
  status: { 
    type: String, 
    enum: ['Order Placed', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled', 'Payment Failed'], 
    default: 'Order Placed' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
