const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
  const { productId, cart } = req.query;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  const cartProductIds = cart ? cart.split(',') : [];

  // Logique de recommandation : récupérer des produits d'autres catégories que ceux déjà dans le panier
  db.all(
    `SELECT * FROM products 
    WHERE category = (SELECT category FROM products WHERE id = ?) 
    AND id != ? 
    AND id NOT IN (?) 
    LIMIT 3`, 
    [productId, productId, cartProductIds], 
    (err, rows) => {
      if (err) {
        console.error('Erreur lors de la récupération des recommandations:', err);
        return res.status(500).json({ error: 'Erreur lors de la récupération des recommandations' });
      }

      if (rows.length === 0) {
        return res.json([]);
      }

      // Renvoyer les recommandations
      res.json(rows);
    }
  );
});

module.exports = router;
