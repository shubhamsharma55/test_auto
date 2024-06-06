const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: '192.168.1.6',
  database: 'php_training',
  password: 'mawai123',
  port: 5432,
  schema:'aman',
});



app.get('/', (req, res) => {
    res.send('Hello, world!');
});


// ... previous code ...

// A temporary in-memory "database" until you integrate a real database
let books = [];

// Create a Book
app.post('/books', async  (req, res) => {
  // Logic to add a book
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).send('Title, author are required');
  }
  try {
    const result = await pool.query(
      'INSERT INTO aman.books (title, author) VALUES ($1, $2) RETURNING *',
      [title, author]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error adding book');
  }

});

// Get All Books
app.get('/books', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aman.books');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error fetching books');
  }
});

// Get a Single Book
app.get('/books/:id', (req, res) => {
  // Logic to get a single book
});

// Update a Book
app.put('/books/:id', async (req, res) => {
  // Logic to update a book
  const { id } = req.params;
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).send('Title, author are required');
  }

  try {
    const result = await pool.query(
      'UPDATE aman.books SET title = $1, author = $2 WHERE id = $3 RETURNING *',
      [title, author, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send('Book not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error executing query', err.stack);
    res.status(500).send('Error updating book');
  }
});

// Delete a Book
app.delete('/books/:id', (req, res) => {
  // Logic to delete a book
});
// add book
app.post('/books', (req, res) => {
    const { title, author } = req.body;
    if (!title || !author) {
      return res.status(400).send('Missing title or author');
    }
  
    const newBook = { id: books.length + 1, title, author };
    books.push(newBook);
    res.status(201).send(newBook);
  });

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});