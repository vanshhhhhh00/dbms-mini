// ============================================================
// routes/paymentRoutes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { getAllPayments, getPaymentByBooking } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', protect, adminOnly, getAllPayments);                    // GET /api/payments (admin)
router.get('/booking/:bookingId', protect, getPaymentByBooking);      // GET /api/payments/booking/:id

module.exports = router;
