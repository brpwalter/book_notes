import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Express für Formulardaten (POST) und JSON konfigurieren
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS View Engine einrichten
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const { Pool } = pg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Hauptseite: Liest Daten und rendert das EJS-Template
app.get('/', async (req, res) => {
  const whitelistFields = { rating: 'rating', recency: 'created_at' };
  const whitelistOrders = ['ASC', 'DESC'];

  const sortBy = whitelistFields[req.query.sortBy] || 'created_at';
  const order = whitelistOrders.includes(req.query.order?.toUpperCase()) 
    ? req.query.order.toUpperCase() 
    : 'DESC';

  try {
    const queryText = `SELECT * FROM books ORDER BY ${sortBy} ${order};`;
    const { rows: books } = await pool.query(queryText);
    
    // Aktuelle Sortierung mitsenden, um UI-Elemente aktiv zu setzen
    res.render('index', { books, currentSort: req.query.sortBy || 'recency' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// API-Endpunkt für ein einzelnes Buch (wichtig für die Edit-Funktion via Axios)
app.get('/api/books/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Nicht gefunden' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE / UPDATE Route (Formular-Ziel)
// CREATE / UPDATE Route (Formular-Ziel mit ISBN-Validierung)
app.post('/books/save', async (req, res) => {
  const { id, title, author, isbn, review, rating } = req.body;
  
  // 1. ISBN bereinigen (Leerzeichen und Bindestriche weg)
  const cleanIsbn = isbn ? isbn.replace(/[\s-]/g, '') : null;

  // 2. ISBN Format prüfen, falls eine angegeben wurde
  if (cleanIsbn) {
    const isbnRegex = /^(?:\d{9}[\dX]|\d{13})$/i;
    if (!isbnRegex.test(cleanIsbn)) {
      return res.status(400).send('Fehler: Ungültiges ISBN-Format. Erlaubt sind 10 oder 13 Zeichen (Ziffern/X).');
    }
  }

  try {
    if (id) {
      // UPDATE (Speichert die saubere ISBN)
      const queryText = `
        UPDATE books SET title = $1, author = $2, isbn = $3, review = $4, rating = $5 
        WHERE id = $6;
      `;
      await pool.query(queryText, [title, author, cleanIsbn, review, rating, id]);
    } else {
      // CREATE (Speichert die saubere ISBN)
      const queryText = `
        INSERT INTO books (title, author, isbn, review, rating) 
        VALUES ($1, $2, $3, $4, $5);
      `;
      await pool.query(queryText, [title, author, cleanIsbn, review, rating]);
    }
    res.redirect('/');
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// DELETE Route via API (wird im Frontend per Axios aufgerufen)
app.delete('/api/books/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Nicht gefunden' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
