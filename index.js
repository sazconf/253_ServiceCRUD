import express from 'express';
import pg from 'pg';

const app = express();
const port = 3000;
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mahasiswa',
  password: process.env.PG_PASSWORD || '1234',
  port: 5432,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET ALL: http://localhost:3000/
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM biodata ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
