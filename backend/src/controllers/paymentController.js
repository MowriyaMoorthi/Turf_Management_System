const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Turf = require('../models/Turf');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res, next) => {
  try {
    const { turfId, hours } = req.body;
    const turf = await Turf.findById(turfId);
    if (!turf) return res.status(404).json({ message: 'Turf not found' });
    const totalAmount = turf.pricePerHour * hours;
    const order = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    res.json({
      orderId: order.id,
      amount: totalAmount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      turfName: turf.name,
    });
  } catch (error) { next(error); }
};

const verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      turfId, date, startTime, endTime, hours, userPhone, paymentMethod, notes,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Get turf
    const turf = await Turf.findById(turfId);
    if (!turf) return res.status(404).json({ message: 'Turf not found' });

    // Check slot conflict
    const existing = await Booking.find({ turf: turfId, date, status: { $ne: 'cancelled' } });
    const conflict = existing.some(b => startTime < b.endTime && endTime > b.startTime);
    if (conflict) return res.status(400).json({ message: 'Slot already booked' });

    // Create booking
    const booking = await Booking.create({
      turf: turfId,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: userPhone || req.user.phone,
      date, startTime, endTime, hours,
      totalAmount: turf.pricePerHour * hours,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: paymentMethod || 'UPI',
      notes: notes || '',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    await Turf.findByIdAndUpdate(turfId, { $inc: { totalBookings: 1 } });
    await booking.populate('turf', 'name location sport images');

    res.status(201).json({ message: 'Payment successful! Booking confirmed.', booking });
  } catch (error) { next(error); }
};

const refundPayment = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });
    if (booking.razorpayPaymentId) {
      await razorpay.payments.refund(booking.razorpayPaymentId, { amount: booking.totalAmount * 100 });
    }
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();
    res.json({ message: 'Refund initiated successfully', booking });
  } catch (error) { next(error); }
};

module.exports = { createOrder, verifyPayment, refundPayment };
