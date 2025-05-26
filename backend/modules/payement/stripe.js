require('dotenv').config();
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const db = require('../../config/db'); // ← SQLite ici

// Helper pour les requêtes SQLite en Promesse
const getProductByName = (name) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT name, unitPrice FROM products WHERE name = ?", [name], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Route POST pour créer la session de paiement
router.post('/create-checkout-session', async (req, res) => {
  console.log("✅ Requête reçue sur /create-checkout-session !");
  const { items } = req.body;
  console.log("Items reçus pour Stripe :", items);

  try {
    const stripeItems = [];

for (const item of items) {
  if (!item.name) continue;

  if (item.name === 'Frais de livraison') {
    stripeItems.push({
      price_data: {
        currency: 'eur',
        product_data: { name: 'Frais de livraison' },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: 1,
    });
    continue;
  }

  const product = await getProductByName(item.name);

  if (product) {
    stripeItems.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: product.name,
        },
        unit_amount: Math.round(Number(product.unitPrice) * 100),
      },
      quantity: item.quantity || 1,
    });
  } else {
    console.warn(`🛑 Produit non trouvé en base : ${item.name}`);
  }
}


    if (stripeItems.length === 0) {
      return res.status(400).json({ error: 'Aucun article valide pour Stripe.' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: stripeItems,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    console.log("✅ Session Stripe créée avec succès :", session.id);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('❌ Erreur lors de la création de la session Stripe :', error.message);
    res.status(500).json({ error: 'Erreur serveur lors de la création de la session Stripe.' });
  }
});

module.exports = router;
