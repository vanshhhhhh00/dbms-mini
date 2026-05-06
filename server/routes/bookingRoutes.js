// ============================================================
// routes/bookingRoutes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking, getAllBookings } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, createBooking);              // POST /api/bookings (book an event)
router.get('/my', protect, getMyBookings);             // GET  /api/bookings/my
router.put('/:id/cancel', protect, cancelBooking);    // PUT  /api/bookings/:id/cancel
router.get('/', protect, adminOnly, getAllBookings);   // GET  /api/bookings (admin only)

module.exports = router;
