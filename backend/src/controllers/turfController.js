const Turf = require('../models/Turf');

// @desc    Get all turfs (with filters)
// @route   GET /api/turfs
// @access  Public
const getAllTurfs = async (req, res, next) => {
  try {
    const { sport, location, search, maxPrice, sort } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (sport && sport !== 'All') filter.sport = sport;
    if (location && location !== 'All') {
      filter.location = { $regex: location, $options: 'i' };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { sport: { $regex: search, $options: 'i' } },
      ];
    }
    if (maxPrice) filter.pricePerHour = { $lte: Number(maxPrice) };

    // Build sort
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { pricePerHour: 1 };
    if (sort === 'price_desc') sortOption = { pricePerHour: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const turfs = await Turf.find(filter)
      .sort(sortOption)
      .populate('owner', 'name email');

    res.json(turfs);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single turf by ID
// @route   GET /api/turfs/:id
// @access  Public
const getTurfById = async (req, res, next) => {
  try {
    const turf = await Turf.findById(req.params.id).populate('owner', 'name email');

    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    res.json(turf);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new turf
// @route   POST /api/turfs
// @access  Private (Admin/Owner)
const createTurf = async (req, res, next) => {
  try {
    const turf = await Turf.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json(turf);
  } catch (error) {
    next(error);
  }
};

// @desc    Update turf
// @route   PUT /api/turfs/:id
// @access  Private (Admin/Owner)
const updateTurf = async (req, res, next) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    // Only owner or admin can update
    if (
      turf.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to update this turf' });
    }

    const updated = await Turf.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete turf
// @route   DELETE /api/turfs/:id
// @access  Private (Admin only)
const deleteTurf = async (req, res, next) => {
  try {
    const turf = await Turf.findById(req.params.id);

    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }

    await turf.deleteOne();
    res.json({ message: 'Turf deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get turf stats (admin)
// @route   GET /api/turfs/stats
// @access  Private (Admin)
const getTurfStats = async (req, res, next) => {
  try {
    const total = await Turf.countDocuments();
    const active = await Turf.countDocuments({ isActive: true });
    const sports = await Turf.distinct('sport');
    const ratingAgg = await Turf.aggregate([
      { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);

    res.json({
      total,
      active,
      sports: sports.length,
      avgRating: ratingAgg[0]?.avgRating?.toFixed(1) || '0',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTurfs,
  getTurfById,
  createTurf,
  updateTurf,
  deleteTurf,
  getTurfStats,
};