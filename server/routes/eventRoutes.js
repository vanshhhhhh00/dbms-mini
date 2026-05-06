// ============================================================
// routes/eventRoutes.js
// ============================================================
const express = require('express');
const router = express.Router();
const {
  getAllEvents, getEventById, getMyEvents,
  createEvent, updateEvent, deleteEvent, getAttendees
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const { organizerOrAdmin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getAllEvents);                              // GET  /api/events
router.get('/:id', getEventById);                          // GET  /api/events/:id

// Protected routes
router.get('/organizer/my-events', protect, organizerOrAdmin, getMyEvents); // GET organizer's events
router.get('/:id/attendees', protect, organizerOrAdmin, getAttendees);       // GET attendees

router.post('/', protect, organizerOrAdmin, upload.single('image'), createEvent);  // POST create
router.put('/:id', protect, organizerOrAdmin, upload.single('image'), updateEvent); // PUT update
router.delete('/:id', protect, deleteEvent);               // DELETE (organizer or admin)

module.exports = router;
