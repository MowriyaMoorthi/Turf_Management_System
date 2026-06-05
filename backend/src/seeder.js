const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Turf = require('./models/Turf');
const Booking = require('./models/Booking');

const seedData = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  await User.deleteMany();
  await Turf.deleteMany();
  await Booking.deleteMany();
  console.log('🗑️  Cleared existing data');

  const users = await User.create([
    { name: 'Admin User',     email: 'admin@turfpro.com',  password: 'admin123',    role: 'admin', phone: '+91 87654 32109' },
    { name: 'Ravi Kumar',     email: 'ravi@turfpro.com',   password: 'owner123',    role: 'owner', phone: '+91 98001 11111' },
    { name: 'Suresh Babu',    email: 'suresh@turfpro.com', password: 'owner123',    role: 'owner', phone: '+91 98002 22222' },
    { name: 'Alex Johnson',   email: 'user@turfpro.com',   password: 'password123', role: 'user',  phone: '+91 98765 43210' },
    { name: 'Priya Sharma',   email: 'priya@gmail.com',    password: 'password123', role: 'user',  phone: '+91 91234 56789' },
    { name: 'Rahul Mehta',    email: 'rahul@gmail.com',    password: 'password123', role: 'user',  phone: '+91 92345 67890' },
    { name: 'Deepa Nair',     email: 'deepa@gmail.com',    password: 'password123', role: 'user',  phone: '+91 93456 78901' },
    { name: 'Karthik Raja',   email: 'karthik@gmail.com',  password: 'password123', role: 'user',  phone: '+91 94567 89012' },
    { name: 'Anitha Reddy',   email: 'anitha@gmail.com',   password: 'password123', role: 'user',  phone: '+91 95678 90123' },
    { name: 'Vijay Krishnan', email: 'vijay@gmail.com',    password: 'password123', role: 'user',  phone: '+91 96789 01234' },
    { name: 'Meena Pillai',   email: 'meena@gmail.com',    password: 'password123', role: 'user',  phone: '+91 97890 12345' },
    { name: 'Arun Patel',     email: 'arun@gmail.com',     password: 'password123', role: 'user',  phone: '+91 98901 23456' },
  ]);
  console.log('👤 ' + users.length + ' Users seeded');

  const admin  = users[0];
  const owner1 = users[1];
  const owner2 = users[2];
  const regularUsers = users.slice(3);

  const turfs = await Turf.create([
    { name: 'Champions Arena',      location: 'Velachery, Chennai',      address: '14B Sports Complex, Velachery Main Rd, Chennai - 600042',  sport: 'Football',   size: '7v7',           pricePerHour: 1200, rating: 4.8, reviewsCount: 142, images: ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80'], amenities: ['Floodlights','Parking','Changing Rooms','Washrooms','Drinking Water','Artificial Turf'], openTime: '06:00', closeTime: '23:00', description: 'State-of-the-art FIFA-quality artificial turf with premium floodlights.', tags: ['Premium','FIFA Quality'], totalBookings: 856, owner: admin._id },
    { name: 'Goal Rush Ground',      location: 'Guindy, Chennai',         address: '23 Industrial Estate, Guindy, Chennai - 600032',           sport: 'Football',   size: '11v11',         pricePerHour: 2000, rating: 4.6, reviewsCount: 89,  images: ['https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80'], amenities: ['Floodlights','Parking','Changing Rooms','Referee Available','Scoreboard','Spectator Stand'], openTime: '05:00', closeTime: '22:00', description: 'Full-size 11v11 football ground with professional grass turf.', tags: ['Full Size','Grass Turf'], totalBookings: 412, owner: owner1._id },
    { name: 'KickOff Zone',          location: 'Chromepet, Chennai',      address: '5 Old Pallavaram Rd, Chromepet, Chennai - 600044',         sport: 'Football',   size: '5v5',           pricePerHour: 800,  rating: 4.3, reviewsCount: 67,  images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80'], amenities: ['Floodlights','Washrooms','Drinking Water','Parking'], openTime: '06:00', closeTime: '23:00', description: 'Budget-friendly 5v5 turf perfect for casual games.', tags: ['Budget Friendly'], totalBookings: 234, owner: owner1._id },
    { name: "Striker's Paradise",    location: 'Sholinganallur, Chennai', address: '8 OMR Road, Sholinganallur, Chennai - 600119',             sport: 'Football',   size: '7v7',           pricePerHour: 1400, rating: 4.7, reviewsCount: 103, images: ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80'], amenities: ['Floodlights','AC Changing Rooms','Parking','Cafeteria','First Aid','Artificial Turf'], openTime: '06:00', closeTime: '23:00', description: 'Premium turf on OMR popular among IT professionals.', tags: ['Premium','OMR Strip'], totalBookings: 678, owner: owner2._id },
    { name: 'Cricket Colosseum',     location: 'Porur, Chennai',          address: '7 Sports Hub, Mount Poonamallee Rd, Porur - 600116',       sport: 'Cricket',    size: 'Full Pitch',    pricePerHour: 1800, rating: 4.6, reviewsCount: 98,  images: ['https://images.unsplash.com/photo-1540747913346-19212a4b423b?w=800&q=80'], amenities: ['Floodlights','Scoreboard','Pavilion','Practice Nets','Coaching Staff'], openTime: '05:30', closeTime: '22:00', description: 'Professional cricket ground with digital scoreboard.', tags: ['Full Ground','Coaching Available'], totalBookings: 423, owner: admin._id },
    { name: 'Box Cricket Hub',       location: 'Ambattur, Chennai',       address: '12 Industrial Area, Ambattur, Chennai - 600053',           sport: 'Cricket',    size: 'Box Cricket',   pricePerHour: 900,  rating: 4.4, reviewsCount: 76,  images: ['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80'], amenities: ['Floodlights','Nets','Washrooms','Refreshments','Parking'], openTime: '06:00', closeTime: '23:00', description: '8-over box cricket great for corporate and college teams.', tags: ['Box Cricket','Corporate Friendly'], totalBookings: 345, owner: owner1._id },
    { name: 'Net Practice Academy',  location: 'Perambur, Chennai',       address: '3 Railway Colony, Perambur, Chennai - 600011',             sport: 'Cricket',    size: 'Practice Nets', pricePerHour: 600,  rating: 4.5, reviewsCount: 54,  images: ['https://images.unsplash.com/photo-1540747913346-19212a4b423b?w=800&q=80'], amenities: ['4 Practice Nets','Bowling Machine','Coaching','Video Analysis'], openTime: '05:00', closeTime: '21:00', description: 'Dedicated practice facility with bowling machines.', tags: ['Practice Only','Coaching'], totalBookings: 189, owner: owner2._id },
    { name: 'Smash Point Badminton', location: 'Anna Nagar, Chennai',     address: '22 2nd Avenue, Anna Nagar West, Chennai - 600040',         sport: 'Badminton',  size: '4 Courts',      pricePerHour: 600,  rating: 4.9, reviewsCount: 211, images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80'], amenities: ['AC Hall','Shuttle Cock Available','Racket Rental','Changing Rooms','Cafe'], openTime: '06:00', closeTime: '22:30', description: 'Indoor AC badminton with 4 courts and wooden flooring.', tags: ['Indoor','AC','Professional'], totalBookings: 1204, owner: admin._id },
    { name: 'Birdie Court',          location: 'Nungambakkam, Chennai',   address: '6 Nungambakkam High Rd, Chennai - 600034',                 sport: 'Badminton',  size: '6 Courts',      pricePerHour: 700,  rating: 4.7, reviewsCount: 134, images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80'], amenities: ['AC Hall','6 Courts','Shuttle Available','Coaching','Locker Room','Cafeteria'], openTime: '05:30', closeTime: '23:00', description: "Chennai's largest badminton facility with 6 courts.", tags: ['Largest','AC','Coaching'], totalBookings: 892, owner: owner1._id },
    { name: 'DropShot Arena',        location: 'Vadapalani, Chennai',     address: '15 Arcot Road, Vadapalani, Chennai - 600026',              sport: 'Badminton',  size: '3 Courts',      pricePerHour: 500,  rating: 4.3, reviewsCount: 67,  images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=80'], amenities: ['AC Hall','Shuttle Available','Parking','Washrooms'], openTime: '06:00', closeTime: '22:00', description: 'Affordable badminton near Vadapalani metro.', tags: ['Budget Friendly','Metro Nearby'], totalBookings: 345, owner: owner2._id },
    { name: 'Baseline Tennis Club',  location: 'Adyar, Chennai',          address: '5 Club Road, Adyar, Chennai - 600020',                     sport: 'Tennis',     size: '2 Courts',      pricePerHour: 900,  rating: 4.5, reviewsCount: 67,  images: ['https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80'], amenities: ['Hard Court','Floodlights','Ball Machine','Coaching','Cafe'], openTime: '06:00', closeTime: '21:00', description: 'Premium hard-court tennis with certified coaches.', tags: ['Hard Court','Coaching'], totalBookings: 312, owner: admin._id },
    { name: 'Ace Tennis Academy',    location: 'Boat Club, Chennai',      address: '1 Boat Club Road, R.A. Puram, Chennai - 600028',           sport: 'Tennis',     size: '4 Courts',      pricePerHour: 1200, rating: 4.8, reviewsCount: 89,  images: ['https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800&q=80'], amenities: ['Clay Court','Hard Court','Floodlights','Pro Coaching','Ball Machine','Locker Room'], openTime: '05:30', closeTime: '21:00', description: 'Premium tennis academy with clay and hard courts.', tags: ['Premium','Clay Court','Pro Coaching'], totalBookings: 567, owner: owner1._id },
    { name: 'ProKick Futsal',        location: 'Tambaram, Chennai',       address: '9 GST Road, Tambaram East, Chennai - 600059',              sport: 'Futsal',     size: '5v5',           pricePerHour: 800,  rating: 4.3, reviewsCount: 54,  images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80'], amenities: ['Floodlights','Changing Rooms','Refreshments','Parking'], openTime: '07:00', closeTime: '23:00', description: 'Compact 5v5 futsal for quick games and tournaments.', tags: ['Futsal','Evening Leagues'], totalBookings: 287, owner: admin._id },
    { name: 'Indoor Futsal Zone',    location: 'Velachery, Chennai',      address: '33 100 Feet Road, Velachery, Chennai - 600042',            sport: 'Futsal',     size: '5v5',           pricePerHour: 1000, rating: 4.6, reviewsCount: 78,  images: ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80'], amenities: ['Indoor','AC','Wooden Floor','Changing Rooms','Cafe','Parking'], openTime: '06:00', closeTime: '23:00', description: 'Premium indoor futsal with AC and wooden flooring.', tags: ['Indoor','AC','Premium'], totalBookings: 456, owner: owner2._id },
    { name: 'Net Zone Volleyball',   location: 'T. Nagar, Chennai',       address: '3 Panagal Park Complex, T. Nagar - 600017',               sport: 'Volleyball', size: 'Standard',      pricePerHour: 700,  rating: 4.4, reviewsCount: 38,  images: ['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80'], amenities: ['Sand Court','Beach Volleyball','Changing Rooms','Washrooms'], openTime: '06:00', closeTime: '21:00', description: "Chennai's only beach and indoor volleyball combo.", tags: ['Beach Volleyball','Indoor'], totalBookings: 164, owner: admin._id },
    { name: 'Spike Arena',           location: 'Besant Nagar, Chennai',   address: '7 Beach Road, Besant Nagar, Chennai - 600090',             sport: 'Volleyball', size: '2 Courts',      pricePerHour: 800,  rating: 4.6, reviewsCount: 45,  images: ['https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80'], amenities: ['Beach Court','Indoor Court','Changing Rooms','Refreshments','Equipment Rental'], openTime: '06:00', closeTime: '22:00', description: 'Beachside volleyball with stunning sea view.', tags: ['Beach View','Sea Facing'], totalBookings: 234, owner: owner1._id },
  ]);
  console.log('🏟️  ' + turfs.length + ' Turfs seeded');

  const today = new Date();
  const dateStr = (offset) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  };

  const bookingData = [
    { ui:0, ti:0,  date:dateStr(1),   s:'18:00', e:'20:00', hrs:2, method:'UPI',        status:'confirmed', notes:'Weekend match' },
    { ui:0, ti:7,  date:dateStr(3),   s:'07:00', e:'08:00', hrs:1, method:'Card',        status:'confirmed', notes:'' },
    { ui:0, ti:10, date:dateStr(7),   s:'09:00', e:'10:00', hrs:1, method:'UPI',         status:'confirmed', notes:'Tennis practice' },
    { ui:0, ti:4,  date:dateStr(-3),  s:'10:00', e:'12:00', hrs:2, method:'UPI',         status:'completed', notes:'' },
    { ui:0, ti:0,  date:dateStr(-7),  s:'18:00', e:'19:00', hrs:1, method:'Card',        status:'completed', notes:'' },
    { ui:0, ti:7,  date:dateStr(-10), s:'07:00', e:'08:00', hrs:1, method:'UPI',         status:'cancelled', notes:'' },
    { ui:1, ti:1,  date:dateStr(2),   s:'10:00', e:'12:00', hrs:2, method:'UPI',         status:'confirmed', notes:'College tournament' },
    { ui:2, ti:5,  date:dateStr(1),   s:'16:00', e:'17:00', hrs:1, method:'Card',        status:'confirmed', notes:'Box cricket' },
    { ui:3, ti:8,  date:dateStr(2),   s:'07:00', e:'08:00', hrs:1, method:'UPI',         status:'confirmed', notes:'Morning badminton' },
    { ui:4, ti:2,  date:dateStr(3),   s:'19:00', e:'20:00', hrs:1, method:'Net Banking', status:'confirmed', notes:'Evening football' },
    { ui:5, ti:11, date:dateStr(4),   s:'08:00', e:'09:00', hrs:1, method:'UPI',         status:'confirmed', notes:'Tennis coaching' },
    { ui:6, ti:13, date:dateStr(1),   s:'20:00', e:'22:00', hrs:2, method:'Card',        status:'confirmed', notes:'Futsal league' },
    { ui:7, ti:14, date:dateStr(5),   s:'17:00', e:'18:00', hrs:1, method:'UPI',         status:'confirmed', notes:'Volleyball practice' },
    { ui:8, ti:3,  date:dateStr(2),   s:'06:00', e:'07:00', hrs:1, method:'Cash',        status:'confirmed', notes:'' },
    { ui:1, ti:6,  date:dateStr(-2),  s:'09:00', e:'10:00', hrs:1, method:'UPI',         status:'completed', notes:'' },
    { ui:2, ti:9,  date:dateStr(-4),  s:'07:00', e:'08:00', hrs:1, method:'Card',        status:'completed', notes:'' },
    { ui:3, ti:0,  date:dateStr(-1),  s:'18:00', e:'20:00', hrs:2, method:'UPI',         status:'completed', notes:'Corporate league' },
    { ui:4, ti:4,  date:dateStr(-5),  s:'10:00', e:'14:00', hrs:4, method:'Net Banking', status:'completed', notes:'Club match' },
    { ui:5, ti:7,  date:dateStr(-3),  s:'07:00', e:'08:00', hrs:1, method:'UPI',         status:'completed', notes:'' },
    { ui:6, ti:13, date:dateStr(-6),  s:'20:00', e:'22:00', hrs:2, method:'Card',        status:'completed', notes:'Indoor futsal' },
    { ui:7, ti:15, date:dateStr(-2),  s:'17:00', e:'18:00', hrs:1, method:'UPI',         status:'completed', notes:'Beach volleyball' },
    { ui:8, ti:1,  date:dateStr(-8),  s:'16:00', e:'18:00', hrs:2, method:'Cash',        status:'completed', notes:'Full ground match' },
  ];

  const bookings = bookingData.map(b => {
    const u = regularUsers[b.ui];
    const t = turfs[b.ti];
    return {
      turf: t._id, user: u._id,
      userName: u.name, userEmail: u.email, userPhone: u.phone,
      date: b.date, startTime: b.s, endTime: b.e, hours: b.hrs,
      totalAmount: t.pricePerHour * b.hrs,
      status: b.status,
      paymentStatus: b.status === 'cancelled' ? 'refunded' : 'paid',
      paymentMethod: b.method, notes: b.notes,
    };
  });

  await Booking.create(bookings);
  console.log('📋 ' + bookings.length + ' Bookings seeded');

  console.log('\n✅ Database seeded successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin  → admin@turfpro.com  / admin123');
  console.log('Owner  → ravi@turfpro.com   / owner123');
  console.log('User   → user@turfpro.com   / password123');
  console.log('User   → priya@gmail.com    / password123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Users:'+users.length+' | Turfs:'+turfs.length+' | Bookings:'+bookings.length);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.exit(0);
};

seedData().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
