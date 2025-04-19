const Cart = require('../models/cartModel');

// Ajouter un produit au panier
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  // Vérification de la quantité
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({ message: 'La quantité doit être un nombre entier positif.' });
  }

  try {
    // Vérifier si le produit existe déjà dans le panier
    const existingProduct = await Cart.findOne({
      where: { productId },
    });

    if (existingProduct) {
      // Si le produit est déjà dans le panier, mettre à jour la quantité
      existingProduct.quantity += quantity;
      await existingProduct.save();
      return res.status(200).json({ message: 'Quantité mise à jour' });
    }

    // Si le produit n'existe pas, l'ajouter au panier
    await Cart.create({ productId, quantity });
    res.status(201).json({ message: 'Produit ajouté au panier' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un produit du panier
const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Cart.findOne({
      where: { productId },
    });

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
    }

    await product.destroy();
    res.status(200).json({ message: 'Produit supprimé du panier' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Vider le panier
const clearCart = async (req, res) => {
  try {
    await Cart.destroy({ where: {} }); // Supprime tous les produits du panier
    res.status(200).json({ message: 'Panier vidé' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addToCart, removeFromCart, clearCart };
