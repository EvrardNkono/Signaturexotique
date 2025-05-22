// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // ou selon ta config

// GET all users
router.get('/', (req, res) => {
  db.all('SELECT * FROM users ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Erreur récupération utilisateurs', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.json(rows);
  });
});

module.exports = router;
