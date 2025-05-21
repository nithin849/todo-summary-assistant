require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const axios = require('axios');
const app = express();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Todo endpoints
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/todos', async (req, res) => {
  const { text, completed = false } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO todos (text, completed) VALUES ($1, $2) RETURNING *',
      [text, completed]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM todos WHERE id = $1', [req.params.id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  const { text, completed } = req.body;
  try {
    const result = await pool.query(
      'UPDATE todos SET text = $1, completed = $2 WHERE id = $3 RETURNING *',
      [text, completed, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Summarize and send to Slack
app.post('/api/summarize', async (req, res) => {
  try {
    // Get pending todos
    const result = await pool.query('SELECT * FROM todos WHERE completed = false');
    const todos = result.rows;
    
    if (todos.length === 0) {
      return res.json({ message: 'No pending todos to summarize' });
    }

    // Generate summary using LLM
    const summary = await generateSummary(todos);
    
    // Send to Slack
    await sendToSlack(summary);
    
    res.json({ message: 'Summary successfully sent to Slack!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate and send summary' });
  }
});

// LLM Integration (OpenAI)
async function generateSummary(todos) {
  const todoList = todos.map(t => `- ${t.text}`).join('\n');
  const prompt = `Create a concise, motivational summary of these pending tasks:\n\n${todoList}\n\nSummary:`;
  
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating summary:', error.response?.data || error.message);
    throw new Error('Failed to generate summary');
  }
}

// Slack Integration
async function sendToSlack(message) {
  try {
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `*Todo Summary:*\n${message}`
    });
  } catch (error) {
    console.error('Error sending to Slack:', error.response?.data || error.message);
    throw new Error('Failed to send to Slack');
  }
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
