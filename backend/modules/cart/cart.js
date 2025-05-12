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

    // Calcul du poids total en fonction de la quantité
    const productWeight = clientType === 'wholesale' ? product.wholesaleWeight : product.retailWeight;
    if (!productWeight) {
      return res.status(400).json({ error: 'Poids du produit non spécifié.' });
    }
    const totalWeight = productWeight * quantity; // Poids total du produit en fonction de la quantité

    console.log('📊 Poids total du produit dans le panier :', totalWeight);

    db.get('SELECT * FROM cart WHERE productId = ? AND user_id = ?', [productId, user_id], (err, row) => {
      if (err) {
        console.error('❌ Erreur lors de la recherche dans le panier :', err);
        return res.status(500).json({ error: 'Erreur lors de la recherche dans le panier.' });
      }

      if (row) {
        // Si le produit est déjà dans le panier, mettre à jour la quantité, le prix et le poids total
        const newQuantity = row.quantity + quantity;
        const newPrice = row.price + price;
        const newTotalWeight = row.totalWeight + totalWeight;

        console.log('🔁 Produit déjà dans le panier. Mise à jour :');
        console.log('🆕 Nouvelle quantité:', newQuantity, '| 🆕 Nouveau prix cumulé:', newPrice, '| 🆕 Poids total:', newTotalWeight);

        db.run(
          'UPDATE cart SET quantity = ?, price = ?, totalWeight = ? WHERE productId = ? AND user_id = ?',
          [newQuantity, newPrice, newTotalWeight, productId, user_id],
          function (err) {
            if (err) {
              console.error('❌ Erreur mise à jour du panier :', err);
              return res.status(500).json({ error: 'Erreur lors de la mise à jour du panier.' });
            }
            console.log('✅ Panier mis à jour avec succès.');
            res.json({
              message: 'Quantité, prix et poids mis à jour.',
              productId,
              quantity: newQuantity,
              price: newPrice,
              totalWeight: newTotalWeight
            });
          }
        );
      } else {
        // Si le produit n'est pas encore dans le panier, ajouter une nouvelle entrée
        console.log('➕ Produit pas encore dans le panier. Insertion...');
        db.run(
          'INSERT INTO cart (productId, quantity, price, clientType, user_id, totalWeight) VALUES (?, ?, ?, ?, ?, ?)',
          [productId, quantity, price, clientType, user_id, totalWeight],
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
              price,
              totalWeight
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
    SELECT cart.id, cart.productId, cart.quantity, cart.price, products.name, products.unitPrice, products.image, 
           products.lotQuantity, products.lotPrice, products.retailWeight, products.wholesaleWeight
    FROM cart
    JOIN products ON cart.productId = products.id
    WHERE cart.user_id = ?
  `, [user_id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const response = Array.isArray(rows) ? rows : [];

    // Ajouter le poids total basé sur le type de client
    const responseWithWeight = response.map(item => {
      // Déterminer le poids en fonction du type de client
      const productWeight = req.user.clientType === 'wholesale' ? item.wholesaleWeight : item.retailWeight;

      // Si le poids n'est pas défini, définir une valeur par défaut
      const totalWeight = productWeight ? productWeight * item.quantity : 0;

      // Ajouter le poids total à l'élément de réponse
      return {
        ...item,
        totalWeight
      };
    });

    console.log('[GET] Panier récupéré :', responseWithWeight.length, 'produits');
    res.json(responseWithWeight);
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

  // 1. Récupérer les informations du produit associé à ce panier
  db.get('SELECT * FROM cart WHERE id = ? AND user_id = ?', [cartId, user_id], (err, cartItem) => {
    if (err) {
      console.error('[PUT] Erreur lors de la récupération du produit dans le panier :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (!cartItem) {
      console.warn('[PUT] Produit non trouvé dans le panier pour cartId:', cartId);
      return res.status(404).json({ error: 'Produit non trouvé dans votre panier' });
    }

    // 2. Récupérer les informations du produit
    db.get('SELECT * FROM products WHERE id = ?', [cartItem.productId], (err, product) => {
      if (err) {
        console.error('[PUT] Erreur lors de la récupération du produit :', err);
        return res.status(500).json({ error: 'Erreur serveur lors de la récupération du produit' });
      }

      if (!product) {
        console.warn('[PUT] Produit introuvable pour l\'ID:', cartItem.productId);
        return res.status(404).json({ error: 'Produit introuvable' });
      }

      // 3. Calculer le poids total du produit en fonction de la nouvelle quantité
      const productWeight = cartItem.clientType === 'wholesale' ? product.wholesaleWeight : product.retailWeight;
      if (!productWeight) {
        return res.status(400).json({ error: 'Poids du produit non spécifié' });
      }

      const totalWeight = productWeight * quantity; // Poids total du produit avec la nouvelle quantité

      console.log('[PUT] Poids total mis à jour :', totalWeight);

      // 4. Mettre à jour la quantité et le poids total dans le panier
      db.run(
        'UPDATE cart SET quantity = ?, totalWeight = ? WHERE id = ? AND user_id = ?',
        [quantity, totalWeight, cartId, user_id],
        function (err) {
          if (err) {
            console.error('[PUT] Erreur lors de la mise à jour du panier :', err);
            return res.status(500).json({ error: 'Erreur serveur lors de la mise à jour du panier' });
          }

          console.log('[PUT] Quantité et poids mis à jour avec succès pour cartId:', cartId);

          // 5. Retourner la réponse avec la nouvelle quantité et poids
          return res.status(200).json({
            id: Number(cartId),
            quantity: quantity,
            totalWeight: totalWeight // Inclure le poids mis à jour dans la réponse
          });
        }
      );
    });
  });
});





module.exports = router;
