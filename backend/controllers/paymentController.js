const { Cashfree, CFEnvironment } = require('cashfree-pg');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

Cashfree.XClientId = process.env.CASHFREE_APP_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = process.env.CASHFREE_ENVIRONMENT === 'PRODUCTION' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX;

const createPaymentOrder = async (req, res) => {
  const { addressId, guestAddress, guestCartItems, guestEmail } = req.body;
  try {
    let finalCartItems = [];
    let userAddress = guestAddress || {};
    let customerEmail = guestEmail || 'guest@example.com';

    if (req.user) {
      // Note: We bypass Cart.findOne since there's no DB
      // The frontend provides guestCartItems even if logged in now? No, but we can fallback
      finalCartItems = guestCartItems || [];
      userAddress = guestAddress || { fullName: 'User', mobile: '9999999999' };
    } else {
      if (!guestCartItems || guestCartItems.length === 0) {
        return res.status(400).json({ message: 'Guest cart is empty' });
      }
      finalCartItems = guestCartItems.map(item => ({
        product: item.product._id || item.product,
        name: item.product.title || item.name,
        image: item.product.images?.[0] || item.image || '',
        quantity: item.quantity,
        price: item.product.price || item.price,
      }));
    }

    const itemsPrice = finalCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 40;
    const totalPrice = itemsPrice + shippingPrice;

    // Mock order creation without MongoDB
    const mockOrderId = 'ORDER_' + Date.now() + '_' + Math.floor(Math.random() * 1000);

    res.json({
      order_id: mockOrderId,
      amount: totalPrice
    });
  } catch (error) {
    console.error('Error creating payment:', error.message);
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { order_id } = req.body;
  try {
    // Mock order verification without MongoDB
    const mockOrder = {
      _id: order_id,
      isPaid: true,
      paidAt: Date.now(),
      status: 'Confirmed',
      paymentResult: {
        paymentId: `UPI_${Date.now()}`,
        orderId: order_id,
        status: 'SUCCESS',
        update_time: new Date().toISOString()
      }
    };

    res.json({ success: true, order: mockOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentOrder, verifyPayment };
