const express = require('express');
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');
const { optionalProtect } = require('../middlewares/auth');

const router = express.Router();

router.post('/create', optionalProtect, createPaymentOrder);
router.post('/verify', optionalProtect, verifyPayment);

module.exports = router;
