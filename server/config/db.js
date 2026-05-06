// ============================================================
// config/db.js - MySQL Database Connection
// ============================================================

const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool (better than single connection - handles multiple requests)
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',       // Database server address
  port: process.env.DB_PORT || 3306,              // MySQL port
  user: process.env.DB_USER || 'root',            // MySQL username
  password: process.env.DB_PASSWORD || 'password',// MySQL password
  database: process.env.DB_NAME || 'eventsphere', // Database name
  waitForConnections: true,    // Wait if all connections are busy
  connectionLimit: 10,         // Max 10 simultaneous connections
  queueLimit: 0,               // Unlimited queue
});

// Get a promise-based version of the pool (lets us use async/await)
const db = pool.promise();

// Test the database connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('💡 Make sure MySQL is running and your .env credentials are correct.');
    return;
  }
  console.log('✅ MySQL Database connected successfully!');
  connection.release(); // Release the connection back to the pool
});

module.exports = db;
