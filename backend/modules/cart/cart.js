const express = require('express');
const db = require('../../config/db');
const router = express.Router();

// Middleware d'authentification pour récupérer l'utilisateur connecté à partir du token JWT
const authmiddleware = require('../../middleware/authmiddleware');

// ➕ Ajouter un produit au panier
// ➕ Ajouter un produit au panier (avec gestion des lots)
router.post('/', authmiddleware, (req, res) => {
  const { productId, quantity, price, clientType } = req.body;
  const user_id = req.user.id;

  console.log('📥 Requête ajout au panier :');
  console.log('➡️ productId:', productId, '| quantity:', quantity, '| price:', price, '| clientType:', clientType, '| user_id:', user_id);

  if (!productId || quantity <= 0 || !clientType || price === undefined) {
    console.log('❌ Données invalides reçues.');
    return res.status(400).json({ message: 'Données invalides : ID produit, quantité, type client ou prix manquant.' });
  }

  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err) {
      console.error('❌ Erreur lors de la récupération du produit :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération du produit.' });
    }
    if (!product) {
      console.warn('⚠️ Produit introuvable pour l\'ID:', productId);
      return res.status(404).json({ error: 'Produit non trouvé.' });
    }

    console.log('📦 Produit trouvé :', product.name);
    console.log('💶 Prix client (frontend envoyé) :', price);
    console.log('📊 Données du produit -> lotQuantity:', product.lotQuantity, '| lotPrice:', product.lotPrice);
    console.log('👤 Client Type:', clientType);

    db.get('SELECT * FROM cart WHERE productId = ? AND user_id = ?', [productId, user_id], (err, row) => {
      if (err) {
        console.error('❌ Erreur lors de la recherche dans le panier :', err);
        return res.status(500).json({ error: 'Erreur lors de la recherche dans le panier.' });
      }

      if (row) {
        const newQuantity = row.quantity + quantity;
        const newPrice = row.price + price;

        console.log('🔁 Produit déjà dans le panier. Mise à jour :');
        console.log('🆕 Nouvelle quantité:', newQuantity, '| 🆕 Nouveau prix cumulé:', newPrice);

        db.run(
          'UPDATE cart SET quantity = ?, price = ? WHERE productId = ? AND user_id = ?',
          [newQuantity, newPrice, productId, user_id],
          function (err) {
            if (err) {
              console.error('❌ Erreur mise à jour du panier :', err);
              return res.status(500).json({ error: 'Erreur lors de la mise à jour du panier.' });
            }
            console.log('✅ Panier mis à jour avec succès.');
            res.json({
              message: 'Quantité et prix mis à jour.',
              productId,
              quantity: newQuantity,
              price: newPrice
            });
          }
        );
      } else {
        console.log('➕ Produit pas encore dans le panier. Insertion...');
        db.run(
          'INSERT INTO cart (productId, quantity, price, clientType, user_id) VALUES (?, ?, ?, ?, ?)',
          [productId, quantity, price, clientType, user_id],
          function (err) {
            if (err) {
              console.error('❌ Erreur lors de l\'insertion :', err);
              return res.status(500).json({ error: 'Erreur lors de l\'ajout du produit au panier.' });
            }
            console.log('✅ Produit ajouté au panier.');
            res.status(201).json({
              message: 'Produit ajouté au panier.',
              productId,
              quantity,
              price
            });
          }
        );
      }
    });
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
  const user_id = req.user.id;

  db.all(`
    SELECT cart.id, cart.productId, cart.quantity, cart.price, products.name, products.unitPrice, products.image, products.lotQuantity, products.lotPrice
    FROM cart
    JOIN products ON cart.productId = products.id
    WHERE cart.user_id = ?
  `, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const response = Array.isArray(rows) ? rows : [];

    // NE PAS TOUCHER À item.price ici, il est déjà bon !
    console.log('[GET] Panier récupéré :', response.length, 'produits');
    res.json(response);
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
