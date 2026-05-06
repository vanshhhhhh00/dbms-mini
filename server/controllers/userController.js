// ============================================================
// controllers/userController.js - User Profile Operations
// ============================================================

const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');

// ============================================================
// GET /api/users/profile
// Get the current user's profile
// ============================================================
const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile.' });
  }
};

// ============================================================
// PUT /api/users/profile
// Update name and email
// ============================================================
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' });
    }

    // Check if the email is taken by someone else
    const existing = await UserModel.findByEmail(email);
    if (existing && existing.id !== req.user.id) {
      return res.status(400).json({ message: 'Email is already in use by another account.' });
    }

    await UserModel.update(req.user.id, name, email);
    const updatedUser = await UserModel.findById(req.user.id);

    res.json({ message: 'Profile updated successfully!', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile.' });
  }
};

// ============================================================
// PUT /api/users/change-password
// Change user password
// ============================================================
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    // Fetch full user record (with hashed password)
    const [rows] = await require('../config/db').execute(
      'SELECT * FROM users WHERE id = ?', [req.user.id]
    );
    const user = rows[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    // Hash new password and update
    const hashedNew = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(req.user.id, hashedNew);

    res.json({ message: 'Password changed successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password.' });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
