const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
// PERUBAHAN PENTING UNTUK CLOUD RUN:
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // Untuk memparsing body request berbentuk JSON

// Konfigurasi koneksi database Cloud
const db = mysql.createConnection({
    host: '34.172.113.167', 
    user: 'admin',                                   
    password: 'mypassword',                        
    database: 'notes_123230032'
});

// Cek koneksi database
db.connect((err) => {
    if (err) {
        console.error('Error koneksi database:', err);
        return;
    }
    // Pesan log diubah biar nggak bingung saat testing
    console.log('Berhasil terhubung ke database MySQL Cloud.');
});

// ==========================================
// ENDPOINT CRUD
// ==========================================

// 1. Tambah catatan (POST)
app.post('/notes', (req, res) => {
    const { judul, isi } = req.body;
    const query = 'INSERT INTO notes (judul, isi) VALUES (?, ?)';
    
    db.query(query, [judul, isi], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Catatan berhasil ditambahkan!', id: result.insertId });
    });
});

// 2. Lihat daftar catatan (GET)
app.get('/notes', (req, res) => {
    const query = 'SELECT * FROM notes ORDER BY tanggal_dibuat DESC';
    
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// 3. Edit catatan (PUT)
app.put('/notes/:id', (req, res) => {
    const { id } = req.params;
    const { judul, isi } = req.body;
    const query = 'UPDATE notes SET judul = ?, isi = ? WHERE id = ?';
    
    db.query(query, [judul, isi, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        res.status(200).json({ message: 'Catatan berhasil diupdate!' });
    });
});

// 4. Hapus catatan (DELETE)
app.delete('/notes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM notes WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Catatan tidak ditemukan' });
        res.status(200).json({ message: 'Catatan berhasil dihapus!' });
    });
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server backend berjalan di port ${port}`);
});