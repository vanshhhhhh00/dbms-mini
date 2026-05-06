// ============================================================
// models/UserModel.js - User Database Operations
// ============================================================

const db = require('../config/db');

const UserModel = {

  // Find a user by their email address (used during login)
  findByEmail: async (email) => {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0]; // Return the first matching user (or undefined)
  },

  // Find a user by their ID (used for profile and auth checks)
  findById: async (id) => {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  // Create a new user
  create: async (name, email, hashedPassword, role = 'user') => {
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    return result.insertId; // Return the new user's ID
  },

  // Get all users (admin only)
  getAll: async () => {
    const [rows] = await db.execute(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  },

  // Update user profile (name and/or email)
  update: async (id, name, email) => {
    const [result] = await db.execute(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]
    );
    return result.affectedRows > 0;
  },

  // Update user password
  updatePassword: async (id, hashedPassword) => {
    const [result] = await db.execute(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, id]
    );
    return result.affectedRows > 0;
  },

  // Delete a user (admin only)
  delete: async (id) => {
    const [result] = await db.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  },
};

module.exports = UserModel;
