const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, getBookingById, cancelBooking, getBookedSlots, getBookingStats } = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/slots', getBookedSlots);
router.get('/my', protect, getMyBookings);
router.get('/stats', protect, adminOnly, getBookingStats);
router.get('/', protect, adminOnly, getAllBookings);
router.post('/', protect, createBooking);
router.get('/:id', protect, getBookingById);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
