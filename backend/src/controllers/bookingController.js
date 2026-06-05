const Booking = require('../models/Booking');
const Turf = require('../models/Turf');

// Helper — check if two time ranges overlap
const timesOverlap = (start1, end1, start2, end2) => {
  return start1 < end2 && end1 > start2;
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { turfId, date, startTime, endTime, hours, paymentMethod, notes } = req.body;

    // Check turf exists
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    if (!turf.isActive) {
      return res.status(400).json({ message: 'This turf is not available for booking' });
    }

    // Check for conflicting bookings
    const existingBookings = await Booking.find({
      turf: turfId,
      date,
      status: { $ne: 'cancelled' },
    });

    const hasConflict = existingBookings.some((b) =>
      timesOverlap(startTime, endTime, b.startTime, b.endTime)
    );

    if (hasConflict) {
      return res.status(400).json({ message: 'This slot is already booked' });
    }

    // Calculate total
    const totalAmount = turf.pricePerHour * hours;

    // Create booking
    const booking = await Booking.create({
      turf: turfId,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: req.body.userPhone || req.user.phone,
      date,
      startTime,
      endTime,
      hours,
      totalAmount,
      paymentMethod: paymentMethod || 'UPI',
      notes: notes || '',
    });

    // Increment turf booking count
    await Turf.findByIdAndUpdate(turfId, { $inc: { totalBookings: 1 } });

    // Populate turf details in response
    await booking.populate('turf', 'name location sport images');

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('turf', 'name location sport images pricePerHour')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private (Admin)
const getAllBookings = async (req, res, next) => {
  try {
    const { status, turfId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (turfId) filter.turf = turfId;

    const bookings = await Booking.find(filter)
      .populate('turf', 'name location sport')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('turf', 'name location sport images address')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only the booking user or admin can view it
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only booking owner or admin can cancel
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    if (booking.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed booking' });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booked slots for a turf on a date
// @route   GET /api/bookings/slots?turfId=&date=
// @access  Public
const getBookedSlots = async (req, res, next) => {
  try {
    const { turfId, date } = req.query;

    if (!turfId || !date) {
      return res.status(400).json({ message: 'turfId and date are required' });
    }

    const bookings = await Booking.find({
      turf: turfId,
      date,
      status: { $ne: 'cancelled' },
    }).select('startTime endTime');

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking stats (admin)
// @route   GET /api/bookings/stats
// @access  Private (Admin)
const getBookingStats = async (req, res, next) => {
  try {
    const total = await Booking.countDocuments();
    const confirmed = await Booking.countDocuments({ status: 'confirmed' });
    const completed = await Booking.countDocuments({ status: 'completed' });
    const cancelled = await Booking.countDocuments({ status: 'cancelled' });

    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    res.json({
      total,
      confirmed,
      completed,
      cancelled,
      revenue: revenueAgg[0]?.total || 0,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  cancelBooking,
  getBookedSlots,
  getBookingStats,
};