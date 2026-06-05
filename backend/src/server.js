const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// ── CORS — allow both port 3000 and 5173 ────
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── ROUTES ──────────────────────────────────
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/turfs',    require('./routes/turfRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/users',    require('./routes/userRoutes'));
app.use('/api/payment',  require('./routes/paymentRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TurfPro API is running' });
});

// ── ERROR HANDLERS ───────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── START SERVER ─────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 TurfPro server running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log(`   Health:      http://localhost:${PORT}/api/health\n`);
});
