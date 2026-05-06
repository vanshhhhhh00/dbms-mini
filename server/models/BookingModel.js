// ============================================================
// models/BookingModel.js - Booking Database Operations
// ============================================================

const db = require('../config/db');

const BookingModel = {

  // Create a new booking
  create: async (userId, eventId, tickets) => {
    const [result] = await db.execute(
      'INSERT INTO bookings (user_id, event_id, tickets, status) VALUES (?, ?, ?, ?)',
      [userId, eventId, tickets, 'confirmed']
    );
    return result.insertId;
  },

  // Get all bookings for a specific user (with event details)
  getByUser: async (userId) => {
    const [rows] = await db.execute(`
      SELECT 
        b.id, b.tickets, b.status, b.booking_date,
        e.id AS event_id, e.title, e.date, e.location, 
        e.price, e.image_url, e.category,
        p.amount, p.payment_status
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      LEFT JOIN payments p ON b.id = p.booking_id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC
    `, [userId]);
    return rows;
  },

  // Get a single booking by ID
  findById: async (id) => {
    const [rows] = await db.execute(
      'SELECT * FROM bookings WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  // Cancel a booking (change status to 'cancelled')
  cancel: async (id, userId) => {
    // Ensure the booking belongs to this user before cancelling
    const [result] = await db.execute(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status = 'confirmed'",
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  // Get all bookings (admin view)
  getAll: async () => {
    const [rows] = await db.execute(`
      SELECT 
        b.id, b.tickets, b.status, b.booking_date,
        u.name AS user_name, u.email AS user_email,
        e.title AS event_title, e.date AS event_date,
        p.amount, p.payment_status
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN events e ON b.event_id = e.id
      LEFT JOIN payments p ON b.id = p.booking_id
      ORDER BY b.booking_date DESC
    `);
    return rows;
  },
};

module.exports = BookingModel;
