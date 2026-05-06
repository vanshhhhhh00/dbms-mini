// ============================================================
// middleware/adminMiddleware.js - Role-Based Access Control
// ============================================================

// This middleware restricts routes to specific roles (admin, organizer).
// Must be used AFTER the `protect` middleware (which sets req.user).

// Restrict access to admin role only
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Access forbidden. Admin privileges required.' 
    });
  }
  next();
};

// Allow access to organizer OR admin
const organizerOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== 'organizer' && req.user.role !== 'admin')) {
    return res.status(403).json({ 
      message: 'Access forbidden. Organizer or Admin privileges required.' 
    });
  }
  next();
};

module.exports = { adminOnly, organizerOrAdmin };
