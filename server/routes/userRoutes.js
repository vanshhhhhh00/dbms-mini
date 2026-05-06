// ============================================================
// routes/userRoutes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All user routes require authentication
router.get('/profile', protect, getProfile);              // GET  /api/users/profile
router.put('/profile', protect, updateProfile);           // PUT  /api/users/profile
router.put('/change-password', protect, changePassword);  // PUT  /api/users/change-password

module.exports = router;
