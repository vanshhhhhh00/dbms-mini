// ============================================================
// controllers/adminController.js - Admin Operations
// ============================================================

const UserModel = require('../models/UserModel');
const EventModel = require('../models/EventModel');
const BookingModel = require('../models/BookingModel');
const PaymentModel = require('../models/PaymentModel');
const db = require('../config/db');

// ============================================================
// GET /api/admin/dashboard
// Get dashboard statistics
// ============================================================
const getDashboardStats = async (req, res) => {
  try {
    const [usersResult] = await db.execute('SELECT COUNT(*) AS total FROM users');
    const [eventsResult] = await db.execute('SELECT COUNT(*) AS total FROM events');
    const [bookingsResult] = await db.execute("SELECT COUNT(*) AS total FROM bookings WHERE status = 'confirmed'");
    const totalRevenue = await PaymentModel.getTotalRevenue();

    res.json({
      stats: {
        totalUsers: usersResult[0].total,
        totalEvents: eventsResult[0].total,
        totalBookings: bookingsResult[0].total,
        totalRevenue: parseFloat(totalRevenue),
      },
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
  }
};

// ============================================================
// GET /api/admin/users
// Get all users
// ============================================================
const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.getAll();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

// ============================================================
// DELETE /api/admin/users/:id
// Delete a user
// ============================================================
const deleteUser = async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (parseInt(req.params.id) === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    const deleted = await UserModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};

// ============================================================
// GET /api/admin/events
// Get all events
// ============================================================
const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.getAll();
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events.' });
  }
};

// ============================================================
// DELETE /api/admin/events/:id
// Delete any event
// ============================================================
const deleteEvent = async (req, res) => {
  try {
    const deleted = await EventModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event.' });
  }
};

module.exports = { getDashboardStats, getAllUsers, deleteUser, getAllEvents, deleteEvent };
