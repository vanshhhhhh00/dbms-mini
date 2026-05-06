// ============================================================
// routes/adminRoutes.js
// ============================================================
const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, deleteUser, getAllEvents, deleteEvent } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// All admin routes require authentication AND admin role
router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);   // GET  /api/admin/dashboard
router.get('/users', getAllUsers);             // GET  /api/admin/users
router.delete('/users/:id', deleteUser);      // DEL  /api/admin/users/:id
router.get('/events', getAllEvents);           // GET  /api/admin/events
router.delete('/events/:id', deleteEvent);    // DEL  /api/admin/events/:id

module.exports = router;
