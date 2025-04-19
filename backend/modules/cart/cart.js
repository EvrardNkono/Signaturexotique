const express = require('express');
const db = require('../../config/db');
const router = express.Router();

// ➕ Ajouter un produit au panier
// ➕ Ajouter un produit au panier
router.post('/', (req, res) => {
  try {
    const { productId, quantity, clientType, unitPrice, wholesalePrice } = req.body;

    if (!productId || quantity <= 0 || !clientType) {
      return res.status(400).json({ message: 'ID de produit, quantité ou type de client invalide.' });
    }

    const priceToUse = clientType === 'wholesale' && wholesalePrice ? wholesalePrice : unitPrice;

    db.get('SELECT * FROM cart WHERE productId = ?', [productId], (err, row) => {
      if (err) {
        console.error('Erreur lors de la recherche dans le panier:', err); // Log l'erreur
        return res.status(500).json({ error: 'Erreur lors de la recherche dans le panier.' });
      }

      if (row) {
        const newQuantity = row.quantity + quantity;
        db.run('UPDATE cart SET quantity = ?, price = ? WHERE productId = ?', [newQuantity, priceToUse, productId], function (err) {
          if (err) {
            console.error('Erreur lors de la mise à jour du panier:', err); // Log l'erreur
            return res.status(500).json({ error: 'Erreur lors de la mise à jour du panier.' });
          }
          res.json({ message: 'Quantité mise à jour.', productId, quantity: newQuantity, price: priceToUse });
        });
      } else {
        db.run('INSERT INTO cart (productId, quantity, price, clientType) VALUES (?, ?, ?, ?)', [productId, quantity, priceToUse, clientType], function (err) {
          if (err) {
            console.error('Erreur lors de l\'ajout du produit au panier:', err); // Log l'erreur
            return res.status(500).json({ error: 'Erreur lors de l\'ajout du produit au panier.' });
          }
          res.status(201).json({ message: 'Produit ajouté au panier.', productId, quantity, price: priceToUse });
        });
      }
    });
  } catch (err) {
    console.error('Erreur serveur:', err); // Log l'erreur générale
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});




// ➖ Supprimer un produit (via productId)
router.delete('/:productId', (req, res) => {
  const { productId } = req.params;
  console.log('[DELETE] Produit à supprimer :', productId);

  db.get('SELECT * FROM cart WHERE productId = ?', [productId], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de la recherche' });

    if (!row) return res.status(404).json({ error: 'Produit non trouvé dans le panier' });

    db.run('DELETE FROM cart WHERE productId = ?', [productId], function(err) {
      if (err) return res.status(500).json({ error: 'Erreur lors de la suppression' });

      console.log('[DELETE] Produit supprimé avec succès :', productId);
      res.json({ message: 'Produit supprimé du panier' });
    });
  });
});

// 🧹 Vider tout le panier
router.delete('/', (req, res) => {
  console.log('[DELETE] Vider panier');
  db.run('DELETE FROM cart', (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Panier vidé.' });
  });
});

// 📦 Récupérer les produits du panier
router.get('/', (req, res) => {
  db.all(`
    SELECT cart.id, cart.productId, cart.quantity, cart.price, products.name, products.unitPrice, products.image
    FROM cart
    JOIN products ON cart.productId = products.id
  `, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log('[GET] Panier récupéré :', rows.length, 'produits');
    res.json(rows);
  });
  
});

// 🔄 Modifier la quantité via cart.id
router.put('/:cartId', (req, res) => {
  const cartId = req.params.cartId;
  const { quantity } = req.body;

  console.log('[PUT] MAJ quantité via cartId:', cartId, 'Nouvelle quantité:', quantity);

  if (quantity < 1) {
    return res.status(400).json({ error: 'La quantité doit être au moins 1' });
  }

  db.run('UPDATE cart SET quantity = ? WHERE id = ?', [quantity, cartId], function (err) {
    if (err) {
      console.error('[PUT] Erreur lors de la mise à jour de la quantité :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Produit non trouvé dans le panier' });
    }

    console.log('[PUT] Quantité mise à jour avec succès pour cartId:', cartId);
    return res.status(200).json({ message: 'Quantité mise à jour avec succès' });
  });
});

module.exports = router;
