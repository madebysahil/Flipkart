const express = require('express');
const { addAddress } = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/address', protect, addAddress);

module.exports = router;
