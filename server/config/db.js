// ============================================================
// config/db.js - PostgreSQL Database Connection
// ============================================================

const { Pool } = require('pg');
require('dotenv').config();

// Create a connection pool for PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'eventsphere',
});

// A wrapper to mimic mysql2's promise pool behaviour
const db = {
  execute: async (sql, params = []) => {
    // 1. Convert '?' to '$1, $2, ...' for Postgres
    let paramIndex = 1;
    let pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    
    // 2. Postgres requires RETURNING id for insertId equivalent
    const isInsert = pgSql.trim().toUpperCase().startsWith('INSERT');
    if (isInsert && !pgSql.toUpperCase().includes('RETURNING')) {
      pgSql += ' RETURNING id';
    }

    try {
      const result = await pool.query(pgSql, params);
      
      const isSelect = pgSql.trim().toUpperCase().startsWith('SELECT');
      
      if (isSelect) {
         // mysql2 returns [rows, fields]
         return [result.rows, result.fields];
      } else {
         // mysql2 returns [{ affectedRows, insertId }, fields]
         const resultObj = {
           affectedRows: result.rowCount,
           insertId: (isInsert && result.rows.length > 0) ? result.rows[0].id : null,
         };
         return [resultObj, result.fields];
      }
    } catch (err) {
      throw err;
    }
  }
};

// Test the database connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('💡 Make sure PostgreSQL is running and your .env credentials are correct.');
    return;
  }
  console.log('✅ PostgreSQL Database connected successfully!');
  release(); // Release the client back to the pool
});

module.exports = db;
