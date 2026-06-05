const express = require('express');
const router = express.Router();
const {
  getAllTurfs,
  getTurfById,
  createTurf,
  updateTurf,
  deleteTurf,
  getTurfStats,
} = require('../controllers/turfController');
const { protect, adminOnly, ownerOrAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getAllTurfs);
router.get('/stats', protect, adminOnly, getTurfStats); // must be before /:id
router.get('/:id', getTurfById);

// Private routes
router.post('/', protect, ownerOrAdmin, createTurf);
router.put('/:id', protect, ownerOrAdmin, updateTurf);
router.delete('/:id', protect, adminOnly, deleteTurf);

module.exports = router;