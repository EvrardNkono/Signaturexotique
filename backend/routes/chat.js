const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'database.db');

// Connexion à la base de données SQLite
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Erreur d’ouverture de la base de données :', err.message);
  } else {
    console.log('Connexion à la base de données SQLite réussie ✅');
  }
});

// Fonction pour récupérer tous les produits
const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT name, category, unitPrice, details FROM products', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Route pour gérer les messages et la communication avec OpenRouter
router.post('/', async (req, res) => {
  const { messages } = req.body;
  console.log("Messages reçus :", messages);

  // Vérification que les messages sont bien un tableau
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Les messages doivent être un tableau' });
  }

  try {
    // Récupérer tous les produits
    const products = await getAllProducts();
    const productContext = formatProductData(products);

    const systemPrompt = `
Tu es un assistant virtuel sympathique, professionnel et chaleureux, conçu et développé par les développeurs de Meka France. 

Tu n'es **pas** une intelligence artificielle développée par OpenAI, Microsoft ou Google. Tu fais partie de l'expérience Meka France, une plateforme e-commerce spécialisée dans les produits alimentaires exotiques du monde entier : épices, condiments, fruits secs, boissons rares, etc.

Ta mission :
- Répondre aux questions des clients sur les produits, les commandes, les recettes ou le fonctionnement du site.
- Donner des recommandations personnalisées (par exemple : « Tu cherches du piment ? J’en ai plusieurs sortes à te proposer ! »).
- Tu n'es pas un vendeur de vêtements, tu guides uniquement dans l’univers alimentaire exotique.

Voici les produits disponibles :
${productContext}

Sois naturel, dynamique, et toujours tourné vers l’aide à l’utilisateur.
`;


    // Envoi à OpenRouter avec les messages
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages, // Ajoute les messages précédents
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.FRONTEND_URL,
          'X-Title': 'Meka France',
        },
      }
    );

    // Vérifier que la réponse contient les données attendues
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      res.json(response.data);
    } else {
      res.status(500).json({
        error: 'Réponse incorrecte reçue d\'OpenRouter',
        details: response.data || 'Aucune réponse valide reçue.',
      });
    }
  } catch (error) {
    // Gestion des erreurs lors de l'appel à OpenRouter
    console.error('Erreur OpenRouter/OpenAI:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Erreur lors de la communication avec OpenAI via OpenRouter',
      details: error.response?.data || error.message,
    });
  }
});

// Fonction pour formater les données des produits à envoyer au prompt
function formatProductData(products) {
  return products.map(p =>
    `- ${p.name} (${p.category}) - ${p.unitPrice}€ : ${p.details}`
  ).join('\n');
}

module.exports = router;
