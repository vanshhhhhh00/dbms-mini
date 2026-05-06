// ============================================================
// middleware/errorMiddleware.js - Global Error Handler
// ============================================================

// This middleware catches any errors thrown in route handlers.
// It must be registered LAST in server.js (after all routes).

const errorHandler = (err, req, res, next) => {
  // Log the full error stack for debugging
  console.error('❌ Server Error:', err.stack);

  // Use the error's status code or default to 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    // Show detailed error only in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

// Helper function to create custom errors with status codes
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = { errorHandler, createError };
