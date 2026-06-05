const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, refundPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);
router.post('/refund', protect, refundPayment);

module.exports = router;
