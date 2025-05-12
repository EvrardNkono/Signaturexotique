// order.js

const express = require('express');
const db = require('../config/db');
const router = express.Router();
const authmiddleware = require('../middleware/authmiddleware');

// ➕ Passer la commande
router.post('/order', authmiddleware, (req, res) => {
  const user_id = req.user.id;

  // Récupérer les articles du panier de l'utilisateur
  db.all(`
    SELECT cart.quantity, products.retailWeight, products.wholesaleWeight, cart.clientType
    FROM cart
    JOIN products ON cart.productId = products.id
    WHERE cart.user_id = ?
  `, [user_id], (err, rows) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération des produits du panier :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Panier vide' });
    }

    // Calculer le poids total du panier
    let totalWeight = 0;

    rows.forEach(item => {
      const productWeight = item.clientType === 'wholesale' ? item.wholesaleWeight : item.retailWeight;
      totalWeight += productWeight * item.quantity;
    });

    console.log('📦 Poids total du panier :', totalWeight);

    // Simuler l'envoi des informations de la commande à un formulaire de livraison (par exemple via un autre endpoint)
    res.json({
      message: 'Commande passée avec succès.',
      totalWeight: totalWeight
    });
  });
});

module.exports = router;
