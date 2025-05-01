require('dotenv').config();

// Vérification de la clé API Stripe
console.log("TEST STRIPE KEY", process.env.STRIPE_SECRET_KEY); // 🔍 Vérifie que la clé est bien chargée

const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Ta clé secrète Stripe

// Test de la connexion Stripe
(async () => {
  try {
    const products = await stripe.products.list({ limit: 1 });
    console.log("Stripe fonctionne !", products);
  } catch (err) {
    console.error("Erreur Stripe :", err.message);
  }
})();

// Route POST pour créer la session de paiement
router.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;
  console.log("Items reçus pour Stripe :", items); // Affiche les items reçus pour Stripe

  try {
    // Affichage des détails des items avant de créer la session
    console.log("Détails des items pour la session Stripe :");
    items.forEach(item => {
      console.log(`Nom: ${item.name}, Prix: ${item.price}, Quantité: ${item.quantity}`);
    });

    // Création de la session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: items.map(item => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Conversion en centimes
        },
        quantity: item.quantity,
      })),
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    console.log("Session Stripe créée avec succès !", session.id); // Affiche l'ID de la session créée
    res.json({ sessionId: session.id }); // Retourne l'ID de la session pour redirection
  } catch (error) {
    console.error('Erreur lors de la création de la session Stripe :', error);
    res.status(500).json({ error: 'Erreur lors de la création de la session Stripe.' });
  }
});

module.exports = router;
