const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
});

// Test the connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Successfully connected to PostgreSQL database');
  }
});

module.exports = { pool };