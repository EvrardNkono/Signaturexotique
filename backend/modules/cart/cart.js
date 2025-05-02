const express = require('express');
const db = require('../../config/db');
const router = express.Router();

// Middleware d'authentification pour récupérer l'utilisateur connecté à partir du token JWT
const authmiddleware = require('../../middleware/authmiddleware');

// ➕ Ajouter un produit au panier
router.post('/', authmiddleware, (req, res) => {
  const { productId, quantity, clientType, unitPrice, wholesalePrice } = req.body;
  const user_id = req.user.id; // Récupérer l'ID de l'utilisateur du token JWT

  if (!productId || quantity <= 0 || !clientType) {
    return res.status(400).json({ message: 'ID de produit, quantité ou type de client invalide.' });
  }

  const priceToUse = clientType === 'wholesale' && wholesalePrice ? wholesalePrice : unitPrice;

  db.get('SELECT * FROM cart WHERE productId = ? AND user_id = ?', [productId, user_id], (err, row) => {
    if (err) {
      console.error('Erreur lors de la recherche dans le panier:', err);
      return res.status(500).json({ error: 'Erreur lors de la recherche dans le panier.' });
    }

    if (row) {
      const newQuantity = row.quantity + quantity;
      db.run('UPDATE cart SET quantity = ?, price = ? WHERE productId = ? AND user_id = ?', [newQuantity, priceToUse, productId, user_id], function (err) {
        if (err) {
          console.error('Erreur lors de la mise à jour du panier:', err);
          return res.status(500).json({ error: 'Erreur lors de la mise à jour du panier.' });
        }
        res.json({ message: 'Quantité mise à jour.', productId, quantity: newQuantity, price: priceToUse });
      });
    } else {
      db.run('INSERT INTO cart (productId, quantity, price, clientType, user_id) VALUES (?, ?, ?, ?, ?)', [productId, quantity, priceToUse, clientType, user_id], function (err) {
        if (err) {
          console.error('Erreur lors de l\'ajout du produit au panier:', err);
          return res.status(500).json({ error: 'Erreur lors de l\'ajout du produit au panier.' });
        }
        res.status(201).json({ message: 'Produit ajouté au panier.', productId, quantity, price: priceToUse });
      });
    }
  });
});

// ➖ Supprimer un produit (via productId)
router.delete('/:productId', authmiddleware, (req, res) => {
  console.log('DELETE /cart/:productId appelé avec :', req.params.productId);
  const user_id = req.user.id; // Récupérer l'ID de l'utilisateur à partir du token JWT
  const { productId } = req.params;
  console.log('[DELETE] Produit à supprimer :', productId);

  db.get('SELECT * FROM cart WHERE productId = ? AND user_id = ?', [productId, user_id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Erreur lors de la recherche' });

    if (!row) return res.status(404).json({ error: 'Produit non trouvé dans votre panier' });

    db.run('DELETE FROM cart WHERE productId = ? AND user_id = ?', [productId, user_id], function(err) {
      if (err) return res.status(500).json({ error: 'Erreur lors de la suppression' });

      console.log('[DELETE] Produit supprimé avec succès :', productId);
      res.json({ message: 'Produit supprimé du panier' });
    });
  });
});

// 🧹 Vider tout le panier
router.delete('/', authmiddleware, (req, res) => {
  const user_id = req.user.id; // Récupérer l'ID de l'utilisateur à partir du token JWT
  console.log('[DELETE] Vider panier');

  db.run('DELETE FROM cart WHERE user_id = ?', [user_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Panier vidé.' });
  });
});

// 📦 Récupérer les produits du panier
router.get('/', authmiddleware, (req, res) => {
  const user_id = req.user.id; // Récupérer l'ID de l'utilisateur à partir du token JWT

  db.all(`
    SELECT cart.id, cart.productId, cart.quantity, cart.price, products.name, products.unitPrice, products.image
    FROM cart
    JOIN products ON cart.productId = products.id
    WHERE cart.user_id = ?
  `, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Si il n'y a pas de produits dans le panier, on retourne un tableau vide
    const response = Array.isArray(rows) ? rows : [];
    console.log('[GET] Panier récupéré :', response.length, 'produits');
    res.json(response); // Toujours renvoyer un tableau, même s'il est vide
  });
});

// 🔄 Modifier la quantité via cart.id
router.put('/:cartId', authmiddleware, (req, res) => {
  const user_id = req.user.id; // Récupérer l'ID de l'utilisateur à partir du token JWT
  const cartId = req.params.cartId;
  const { quantity } = req.body;

  console.log('[PUT] MAJ quantité via cartId:', cartId, 'Nouvelle quantité:', quantity);

  if (quantity < 1) {
    return res.status(400).json({ error: 'La quantité doit être au moins 1' });
  }

  db.run('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, cartId, user_id], function (err) {
    if (err) {
      console.error('[PUT] Erreur lors de la mise à jour de la quantité :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    console.log('[PUT] Nombre de lignes modifiées:', this.changes);

    if (this.changes === 0) {
      console.log('[PUT] Aucune ligne mise à jour, vérifier les identifiants');
      return res.status(404).json({ error: 'Produit non trouvé dans votre panier' });
    }

    console.log('[PUT] Quantité mise à jour avec succès pour cartId:', cartId);

    // 🎁 Voici la petite magie que ton Front adore
    return res.status(200).json({
      id: Number(cartId),      // Bien sûr, on retourne l'ID mis à jour
      quantity: quantity       // Et la nouvelle quantité
    });
  });
});



module.exports = router;
