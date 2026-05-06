// ============================================================
// server.js - Main Entry Point for EventSphere Backend
// ============================================================

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import all route files
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

// Import error handling middleware
const { errorHandler } = require('./middleware/errorMiddleware');

// Initialize the Express app
const app = express();

// ============================================================
// MIDDLEWARE SETUP
// ============================================================

// Enable CORS - Allow frontend to communicate with backend
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173', // React dev server
  credentials: true,  // Allow cookies/authorization headers
}));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files (event images) as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================================
// API ROUTES
// ============================================================

// Health check route - verify server is running
app.get('/', (req, res) => {
  res.json({ 
    message: '🎉 EventSphere API is running!', 
    version: '1.0.0' 
  });
});

// Mount all API route modules
app.use('/api/auth', authRoutes);        // /api/auth/register, /api/auth/login
app.use('/api/events', eventRoutes);     // /api/events (CRUD)
app.use('/api/bookings', bookingRoutes); // /api/bookings
app.use('/api/payments', paymentRoutes); // /api/payments
app.use('/api/admin', adminRoutes);      // /api/admin (admin only)
app.use('/api/users', userRoutes);       // /api/users/profile

// Handle unknown routes (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// ============================================================
// START SERVER
// ============================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ EventSphere Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});
