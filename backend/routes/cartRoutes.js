const express = require('express');
const { addToCart, removeFromCart, clearCart } = require('../controllers/cartController');
const router = express.Router();

// Ajouter un produit au panier
router.post('/cart', addToCart);

// Supprimer un produit du panier
router.delete('/cart/:productId', removeFromCart);

// Vider le panier
router.delete('/cart', clearCart);

module.exports = router;
