const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    sport: { type: String, required: true, enum: ['Football', 'Cricket', 'Badminton', 'Tennis', 'Futsal', 'Volleyball'] },
    size: { type: String, required: true },
    pricePerHour: { type: Number, required: true, min: 0 },
    openTime: { type: String, default: '06:00' },
    closeTime: { type: String, default: '22:00' },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    description: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    totalBookings: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Turf', turfSchema);
