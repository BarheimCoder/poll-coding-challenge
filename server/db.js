const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE,
});

// Create tables SQL - you'll want to run this during initial setup
const createTablesSQL = `
CREATE TABLE IF NOT EXISTS polls (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    option_id INTEGER REFERENCES poll_options(id) ON DELETE CASCADE,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const initializeDB = async () => {
  try {
    await pool.query(createTablesSQL);
    console.log('Database tables created successfully');
  } catch (err) {
    console.error('Error creating database tables:', err);
    throw err;
  }
};

module.exports = {
  pool,
  initializeDB
};