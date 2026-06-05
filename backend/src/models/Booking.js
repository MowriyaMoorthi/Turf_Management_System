const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    turf: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userPhone: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    hours: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['confirmed', 'completed', 'cancelled'], default: 'confirmed' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'paid' },
    paymentMethod: { type: String, enum: ['UPI', 'Card', 'Cash', 'Net Banking'], default: 'UPI' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
