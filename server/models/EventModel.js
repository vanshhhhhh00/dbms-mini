// ============================================================
// models/EventModel.js - Event Database Operations
// ============================================================

const db = require('../config/db');

const EventModel = {

  // Get all events with organizer name (using JOIN)
  getAll: async () => {
    const [rows] = await db.execute(`
      SELECT 
        e.*, 
        u.name AS organizer_name, 
        u.email AS organizer_email
      FROM events e
      JOIN users u ON e.organizer_id = u.id
      ORDER BY e.date ASC
    `);
    return rows;
  },

  // Get a single event by ID with organizer details
  findById: async (id) => {
    const [rows] = await db.execute(`
      SELECT 
        e.*, 
        u.name AS organizer_name, 
        u.email AS organizer_email
      FROM events e
      JOIN users u ON e.organizer_id = u.id
      WHERE e.id = ?
    `, [id]);
    return rows[0];
  },

  // Get all events created by a specific organizer
  getByOrganizer: async (organizerId) => {
    const [rows] = await db.execute(`
      SELECT 
        e.*,
        COUNT(b.id) AS total_bookings,
        COALESCE(SUM(b.tickets), 0) AS tickets_sold
      FROM events e
      LEFT JOIN bookings b ON e.id = b.event_id AND b.status = 'confirmed'
      WHERE e.organizer_id = ?
      GROUP BY e.id
      ORDER BY e.date ASC
    `, [organizerId]);
    return rows;
  },

  // Create a new event
  create: async (eventData) => {
    const { title, description, date, location, price, total_seats, category, image_url, organizer_id } = eventData;
    const [result] = await db.execute(
      `INSERT INTO events 
        (title, description, date, location, price, total_seats, available_seats, category, image_url, organizer_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, date, location, price, total_seats, total_seats, category, image_url || null, organizer_id]
    );
    return result.insertId;
  },

  // Update an event
  update: async (id, eventData) => {
    const { title, description, date, location, price, total_seats, category, image_url } = eventData;
    const [result] = await db.execute(
      `UPDATE events 
       SET title=?, description=?, date=?, location=?, price=?, total_seats=?, category=?, image_url=?
       WHERE id=?`,
      [title, description, date, location, price, total_seats, category, image_url || null, id]
    );
    return result.affectedRows > 0;
  },

  // Delete an event
  delete: async (id) => {
    const [result] = await db.execute('DELETE FROM events WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Reduce available seats when a booking is made
  decrementSeats: async (id, count) => {
    const [result] = await db.execute(
      'UPDATE events SET available_seats = available_seats - ? WHERE id = ? AND available_seats >= ?',
      [count, id, count]
    );
    return result.affectedRows > 0; // Returns false if not enough seats
  },

  // Restore seats when a booking is cancelled
  incrementSeats: async (id, count) => {
    await db.execute(
      'UPDATE events SET available_seats = available_seats + ? WHERE id = ?',
      [count, id]
    );
  },

  // Get attendees for a specific event
  getAttendees: async (eventId) => {
    const [rows] = await db.execute(`
      SELECT 
        u.name, u.email, 
        b.tickets, b.status, b.booking_date
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.event_id = ?
      ORDER BY b.booking_date DESC
    `, [eventId]);
    return rows;
  },
};

module.exports = EventModel;
