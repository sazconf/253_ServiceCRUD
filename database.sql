-- Run this while connected to the mahasiswa database.
CREATE TABLE IF NOT EXISTS biodata (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    nim VARCHAR(30) NOT NULL,
    kelas VARCHAR(50) NOT NULL
);

INSERT INTO biodata (nama, nim, kelas)
SELECT 'Contoh Mahasiswa', '12345678', 'TI-A'
WHERE NOT EXISTS (SELECT 1 FROM biodata);
