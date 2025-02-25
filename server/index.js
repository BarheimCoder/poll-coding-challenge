const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

/* 
 * Middleware
 */
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

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

    await db.pool.query('UPDATE polls SET active = NOT active WHERE id = $1', [pollId]);
    res.json({ message: 'Poll status toggled successfully' });
  } catch (err) {
    console.error('Error toggling active poll:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new poll
app.post('/api/polls', async (req, res) => {
  try {
    const { question, options } = req.body;

    // Start a transaction
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // Insert the poll
      const pollResult = await client.query(
        'INSERT INTO polls (question) VALUES ($1) RETURNING id',
        [question]
      );
      const pollId = pollResult.rows[0].id;

      // Insert all options
      const optionValues = options.map((option_text) =>
        `(${pollId}, '${option_text}')`
      ).join(', ');

      await client.query(
        `INSERT INTO poll_options (poll_id, option_text) VALUES ${optionValues}`
      );

      await client.query('COMMIT');
      res.status(201).json({ message: 'Poll created successfully', pollId });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error creating poll:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Vote for an option
app.post('/api/polls/:pollId/vote', async (req, res) => {
  try {
    const { pollId } = req.params;
    const { optionId } = req.body;

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

    const result = await db.pool.query(
      'SELECT po.option_text, COUNT(v.id) as vote_count FROM poll_options po LEFT JOIN votes v ON po.id = v.option_id WHERE po.poll_id = $1 GROUP BY po.id',
      [pollId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching votes:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* 
 * Start the server
 */
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});