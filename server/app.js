const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');
require('dotenv').config();

app.use(express.json());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['http://localhost', 'http://frontend']
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/* 
 * Middleware
 */
// Update CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['http://localhost', 'http://frontend']
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/* 
 * Routes
 */
// Get currently active poll
app.get('/api/polls/active', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        (
          SELECT json_agg(
            json_build_object(
              'id', po.id,
              'option_text', po.option_text,
              'votes', COALESCE(vote_counts.vote_count, 0)
            )
          )
          FROM poll_options po
          LEFT JOIN (
            SELECT option_id, COUNT(*) as vote_count
            FROM votes
            GROUP BY option_id
          ) vote_counts ON po.id = vote_counts.option_id
          WHERE po.poll_id = p.id
        ) as options
      FROM polls p
      WHERE p.active = true
      LIMIT 1
    `;

    const result = await db.pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No active poll found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching active poll:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle active poll
app.post('/api/polls/toggle-active', async (req, res) => {
  try {
    const { pollId } = req.body;

    // Check if poll exists
    const pollCheck = await db.pool.query('SELECT id FROM polls WHERE id = $1', [pollId]);
    if (pollCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('UPDATE polls SET active = false');
      await client.query('UPDATE polls SET active = true WHERE id = $1', [pollId]);
      await client.query('COMMIT');

      res.json({ message: 'Poll activated successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error toggling active poll:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new poll
app.post('/api/polls', async (req, res) => {
  try {
    const { question, options } = req.body;

    // Debug logging
    console.log('Received request:', { question, options });

    // Validate input
    if (!question?.trim()) {
      return res.status(400).json({ error: 'Question cannot be empty' });
    }
    if (!options?.length || options.length < 2) {
      return res.status(400).json({ error: 'Poll must have at least 2 options' });
    }

    // Check for duplicate options
    const uniqueOptions = new Set(options.map(opt => opt.trim()));
    if (uniqueOptions.size !== options.length) {
      return res.status(400).json({ error: 'Duplicate options are not allowed' });
    }

    const client = await db.pool.connect();
    try {
      // Debug logging
      console.log('Connected to database');

      await client.query('BEGIN');

      const pollResult = await client.query(
        'INSERT INTO polls (question) VALUES ($1) RETURNING id',
        [question]
      );
      const pollId = pollResult.rows[0].id;

      const optionQueries = options.map((_, index) =>
        `($1, $${index + 2})`
      ).join(', ');

      const optionParams = [pollId, ...options];

      await client.query(
        `INSERT INTO poll_options (poll_id, option_text) VALUES ${optionQueries}`,
        optionParams
      );

      await client.query('COMMIT');
      res.status(201).json({ message: 'Poll created successfully', pollId });
    } catch (err) {
      console.error('Database error:', err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error creating poll:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Vote for an option
app.post('/api/polls/:pollId/vote', async (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionId } = req.body;

    // Verify option belongs to poll
    const optionCheck = await db.pool.query(
      'SELECT id FROM poll_options WHERE id = $1 AND poll_id = $2',
      [optionId, pollId]
    );

    if (optionCheck.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid option for this poll' });
    }

    await db.pool.query(
      'INSERT INTO votes (poll_id, option_id) VALUES ($1, $2)',
      [pollId, optionId]
    );

    res.status(200).json({ message: 'Vote recorded successfully' });
  } catch (err) {
    console.error('Error recording vote:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// View votes for a poll
app.get('/api/polls/:pollId/votes', async (req, res) => {
  try {
    const { pollId } = req.params;

    // First check if poll exists
    const pollCheck = await db.pool.query('SELECT id FROM polls WHERE id = $1', [pollId]);
    if (pollCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    const query = `
      SELECT 
        po.option_text,
        v.voted_at,
        COUNT(*) OVER() as total_votes
      FROM votes v
      JOIN poll_options po ON po.id = v.option_id
      WHERE po.poll_id = $1
      ORDER BY v.voted_at DESC
    `;

    const result = await db.pool.query(query, [pollId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching votes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a poll
app.delete('/api/polls/:pollId', async (req, res) => {
  try {
    const { pollId } = req.params;

    // Check if poll exists
    const pollCheck = await db.pool.query('SELECT id FROM polls WHERE id = $1', [pollId]);
    if (pollCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Poll not found' });
    }

    await db.pool.query('DELETE FROM polls WHERE id = $1', [pollId]);
    res.json({ message: 'Poll deleted successfully' });
  } catch (err) {
    console.error('Error deleting poll:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
