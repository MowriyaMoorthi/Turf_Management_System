const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Turf = require('./models/Turf');
const Booking = require('./models/Booking');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');
};

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany();
  await Turf.deleteMany();
  await Booking.deleteMany();
  console.log('🗑️  Cleared existing data');

  // Create users
  const users = await User.create([
    { name: 'Admin User', email: 'admin@turfpro.com', password: 'admin123', role: 'admin', phone: '+91 87654 32109' },
    { name: 'Alex Johnson', email: 'user@turfpro.com', password: 'password123', role: 'user', phone: '+91 98765 43210' },
  ]);
  console.log('👤 Users seeded');

  const admin = users[0];
  const regularUser = users[1];

  // Create turfs
  const turfs = await Turf.create([
    { name: 'Champions Arena', location: 'Velachery, Chennai', address: '14B Sports Complex, Velachery Main Rd, Chennai - 600042', sport: 'Football', size: '7v7', pricePerHour: 1200, rating: 4.8, reviewsCount: 142, images: ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80'], amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Washrooms', 'Drinking Water', 'Artificial Turf'], openTime: '06:00', closeTime: '23:00', description: 'State-of-the-art FIFA-quality artificial turf with premium floodlights.', tags: ['Premium', 'FIFA Quality'], totalBookings: 856, owner: admin._id },
    { name: 'Cricket Colosseum', location: 'Porur, Chennai', address: '7 Sports Hub, Mount Poonamallee Rd, Porur - 600116', sport: 'Cricket', size: 'Full Pitch', pricePerHour: 1800, rating: 4.6, reviewsCount: 98, images: ['https://images.unsplash.com/photo-1540747913346-19212a4b423b?w=800&q=80'], amenities: ['Floodlights', 'Scoreboard', 'Pavilion', 'Practice Nets'], openTime: '05:30', closeTime: '22:00', description: 'Professional cricket ground with a well-maintained pitch.', tags: ['Full Ground'], totalBookings: 423, owner: admin._id },
    { name: 'Smash Point Badminton', location: 'Anna Nagar, Chennai', address: '22 2nd Avenue, Anna Nagar West, Chennai - 600040', sport: 'Badminton', size: '4 Courts', pricePerHour: 600, rating: 4.9, reviewsCount: 211, images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80'], amenities: ['AC Hall', 'Shuttle Cock Available', 'Racket Rental', 'Cafe'], openTime: '06:00', closeTime: '22:30', description: 'Indoor AC badminton facility with 4 professional courts.', tags: ['Indoor', 'AC'], totalBookings: 1204, owner: admin._id },
    { name: 'Baseline Tennis Club', location: 'Adyar, Chennai', address: '5 Club Road, Adyar, Chennai - 600020', sport: 'Tennis', size: '2 Courts', pricePerHour: 900, rating: 4.5, reviewsCount: 67, images: ['https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80'], amenities: ['Hard Court', 'Floodlights', 'Ball Machine', 'Coaching'], openTime: '06:00', closeTime: '21:00', description: 'Premium hard-court tennis facility.', tags: ['Hard Court'], totalBookings: 312, owner: admin._id },
    { name: 'ProKick Futsal', location: 'Tambaram, Chennai', address: '9 GST Road, Tambaram East, Chennai - 600059', sport: 'Futsal', size: '5v5', pricePerHour: 800, rating: 4.3, reviewsCount: 54, images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80'], amenities: ['Floodlights', 'Changing Rooms', 'Refreshments', 'Parking'], openTime: '07:00', closeTime: '23:00', description: 'Compact 5v5 futsal turf perfect for quick games.', tags: ['Futsal'], totalBookings: 287, owner: admin._id },
    { name: 'Net Zone Volleyball', location: 'T. Nagar, Chennai', address: '3 Panagal Park Complex, T. Nagar - 600017', sport: 'Volleyball', size: 'Standard', pricePerHour: 700, rating: 4.4, reviewsCount: 38, images: ['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80'], amenities: ['Sand Court', 'Beach Volleyball', 'Changing Rooms'], openTime: '06:00', closeTime: '21:00', description: "Chennai's only beach volleyball combo facility.", tags: ['Beach Volleyball'], totalBookings: 164, owner: admin._id },
  ]);
  console.log('🏟️  Turfs seeded');

  // Create sample bookings
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  await Booking.create([
    { turf: turfs[0]._id, user: regularUser._id, userName: regularUser.name, userEmail: regularUser.email, userPhone: regularUser.phone, date: tomorrowStr, startTime: '18:00', endTime: '20:00', hours: 2, totalAmount: 2400, status: 'confirmed', paymentStatus: 'paid', paymentMethod: 'UPI' },
    { turf: turfs[2]._id, user: regularUser._id, userName: regularUser.name, userEmail: regularUser.email, userPhone: regularUser.phone, date: tomorrowStr, startTime: '07:00', endTime: '08:00', hours: 1, totalAmount: 600, status: 'confirmed', paymentStatus: 'paid', paymentMethod: 'Card' },
  ]);
  console.log('📋 Bookings seeded');

  console.log('\n✅ Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin  → admin@turfpro.com  / admin123');
  console.log('User   → user@turfpro.com   / password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  process.exit(0);
};

seedData().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});