// ============================================================
// models/PaymentModel.js - Payment Database Operations
// ============================================================

const db = require('../config/db');

const PaymentModel = {

  // Create a payment record after a booking
  create: async (bookingId, amount) => {
    const [result] = await db.execute(
      'INSERT INTO payments (booking_id, amount, payment_status) VALUES (?, ?, ?)',
      [bookingId, amount, 'completed']
    );
    return result.insertId;
  },

  // Get payment by booking ID
  getByBookingId: async (bookingId) => {
    const [rows] = await db.execute(
      'SELECT * FROM payments WHERE booking_id = ?',
      [bookingId]
    );
    return rows[0];
  },

  // Update payment status (e.g., to 'refunded' on cancellation)
  updateStatus: async (bookingId, status) => {
    const [result] = await db.execute(
      'UPDATE payments SET payment_status = ? WHERE booking_id = ?',
      [status, bookingId]
    );
    return result.affectedRows > 0;
  },

  // Get all payments (admin view)
  getAll: async () => {
    const [rows] = await db.execute(`
      SELECT 
        p.id, p.amount, p.payment_status, p.payment_date,
        b.tickets, b.status AS booking_status,
        u.name AS user_name,
        e.title AS event_title
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN users u ON b.user_id = u.id
      JOIN events e ON b.event_id = e.id
      ORDER BY p.payment_date DESC
    `);
    return rows;
  },

  // Get total revenue (completed payments only)
  getTotalRevenue: async () => {
    const [rows] = await db.execute(
      "SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE payment_status = 'completed'"
    );
    return rows[0].total;
  },
};

module.exports = PaymentModel;
