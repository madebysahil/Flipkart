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
    let userAddress = null;
    let customerId = `GUEST_${Date.now()}`;
    let customerPhone = '9999999999';
    let customerName = 'Guest User';
    let customerEmail = guestEmail || 'guest@example.com';

    if (req.user) {
      const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product');
      if (!cart || cart.cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      finalCartItems = cart.cartItems.map(item => ({
        product: item.product._id,
        name: item.product.title,
        image: item.product.images[0] || '',
        quantity: item.quantity,
        price: item.product.price,
      }));

      userAddress = req.user.addresses.id(addressId);
      if (!userAddress) {
        return res.status(404).json({ message: 'Address not found' });
      }
      
      customerId = req.user._id.toString();
      customerPhone = userAddress.mobile || '9999999999';
      customerName = userAddress.fullName;
      customerEmail = req.user.email;
    } else {
      if (!guestCartItems || guestCartItems.length === 0) {
        return res.status(400).json({ message: 'Guest cart is empty' });
      }
      if (!guestAddress) {
        return res.status(400).json({ message: 'Guest address is required' });
      }
      finalCartItems = guestCartItems.map(item => ({
        product: item.product._id || item.product,
        name: item.product.title || item.name,
        image: item.product.images?.[0] || item.image || '',
        quantity: item.quantity,
        price: item.product.price || item.price,
      }));
      userAddress = guestAddress;
      customerPhone = userAddress.mobile || '9999999999';
      customerName = userAddress.fullName || 'Guest';
    }

    const itemsPrice = finalCartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shippingPrice = itemsPrice > 500 ? 0 : 40;
    const totalPrice = itemsPrice + shippingPrice;

    const orderData = {
      orderItems: finalCartItems,
      shippingAddress: userAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentMethod: 'UPI'
    };

    if (req.user) {
      orderData.user = req.user._id;
    } else {
      orderData.guestEmail = customerEmail;
    }

    const order = await Order.create(orderData);

    res.json({
      order_id: order._id,
      amount: totalPrice
    });
  } catch (error) {
    console.error('Error creating payment:', error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { order_id } = req.body;
  try {
    const order = await Order.findById(order_id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      paymentId: `UPI_${Date.now()}`,
      orderId: order_id,
      status: 'SUCCESS',
      update_time: new Date().toISOString()
    };
    order.status = 'Confirmed';
    await order.save();

    // Clear Cart if user
    if (order.user) {
      await Cart.findOneAndUpdate({ user: order.user }, { cartItems: [] });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentOrder, verifyPayment };
