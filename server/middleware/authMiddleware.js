// ============================================================
// middleware/authMiddleware.js - JWT Authentication Middleware
// ============================================================

const jwt = require('jsonwebtoken');

// This middleware verifies the JWT token in the request header.
// Protected routes will call this before running controller logic.

const protect = (req, res, next) => {
  try {
    // Get the Authorization header: "Bearer <token>"
    const authHeader = req.headers.authorization;

    // Check if header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided. Please log in.' 
      });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(' ')[1];

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to the request object for downstream use
    req.user = decoded; // decoded contains: { id, name, email, role }

    // Move to the next middleware or controller
    next();

  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ 
      message: 'Invalid or expired token. Please log in again.' 
    });
  }
};

module.exports = { protect };
