// backend/modules/checkout.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Créer la table orders si elle n'existe pas (à faire une fois)
db.run(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    address TEXT,
    city TEXT,
    postalCode TEXT,
    country TEXT,
    phone TEXT,
    deliveryMethod TEXT,
    paymentMethod TEXT,
    items TEXT,
    total REAL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Route pour récupérer toutes les commandes
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM orders';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erreur SQL :', err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
    res.json(rows);  // Renvoie les commandes sous forme de tableau
  });
});

// Route pour enregistrer une commande (déjà présente)
router.post('/', (req, res) => {
  const {
    customer: {
      firstName,
      lastName,
      address,
      city,
      postalCode,
      country,
      phone,
      deliveryMethod,
      paymentMethod
    },
    items,
    total
  } = req.body;

  const itemsString = JSON.stringify(items);

  const sql = `
    INSERT INTO orders (
      firstName, lastName, address, city,
      postalCode, country, phone, deliveryMethod,
      paymentMethod, items, total
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    firstName, lastName, address, city,
    postalCode, country, phone, deliveryMethod,
    paymentMethod, itemsString, total
  ], function (err) {
    if (err) {
      console.error('Erreur SQL :', err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }
    res.status(201).json({ message: 'Commande enregistrée.', orderId: this.lastID });
  });
});

module.exports = router;
