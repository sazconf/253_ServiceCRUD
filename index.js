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

// POST: http://localhost:3000/biodata
app.post('/biodata', async (req, res) => {
  const { nama, nim, kelas } = req.body;
  if (!nama || !nim || !kelas) {
    return res.status(400).json({ message: 'nama, nim, and kelas are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3) RETURNING *',
      [nama, nim, kelas]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT: http://localhost:3000/biodata/:id
app.put('/biodata/:id', async (req, res) => {
  const { id } = req.params;
  const { nama, nim, kelas } = req.body;

  try {
    const result = await pool.query(
      'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *',
      [nama, nim, kelas, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }
    res.json({ message: 'Data berhasil diupdate', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
