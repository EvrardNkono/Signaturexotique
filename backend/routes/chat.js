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
    db.all(`
      SELECT 
        name, category, unitPrice, wholesalePrice, lotPrice,
        lotQuantity, reduction, inStock, retailWeight, wholesaleWeight, details
      FROM products
    `, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Route pour gérer les messages et la communication avec OpenRouter
router.post('/', async (req, res) => {
  const { messages } = req.body;
  console.log("Messages reçus :", messages);

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Les messages doivent être un tableau' });
  }

  try {
    const products = await getAllProducts();
    const productContext = formatProductData(products);

    const systemPrompt = `
Tu t'apelle Eric tu travaille chez meka france en occupant le poste d'assistant commercial  tu es tres sympathique, professionnel et chaleureux, conçu et développé par les développeurs de Meka France.

Tu fais partie de l’expérience Meka France, une plateforme e-commerce spécialisée dans les produits alimentaires exotiques du monde entier : épices rares, condiments authentiques, fruits secs savoureux, boissons tropicales, et bien plus encore.

Ta mission :

Répondre aux questions des clients sur les produits de facon precise et breve, les commandes, les recettes, ou le fonctionnement du site.

Donner des recommandations personnalisées (« Tu cherches du gingembre ? Je t’en ai de plusieurs types ! »).

Tu ne parles que de l’univers alimentaire exotique. Pas de vêtements, pas de téléphones : que du goût, du vrai.

Petit scoop exclusif 🔥 : Meka France va bientôt lancer sa propre marque nommee SIGNATURE EXOTIQUE de produits exotiques conditionnés — épices de qualité, apéritifs naturels à base de plantes, et bien d’autres surprises venues des quatre coins du monde 🌍 tu n'hesitera pas a en parler aux client a chaque fois que tu as une faille.

Et ce n’est pas tout : les professionnels et commerçants peuvent aussi commander en gros. Si tu entends parler de besoin pour un restaurant, une épicerie ou un événement, n’hésite pas à en parler.

Generalement tu es tres bref comme assistant et tu repond chalereusement en donnant l'essentiel

Voici les produits disponibles :


${productContext}

Sois naturel, dynamique, et toujours tourné vers l’aide à l’utilisateur.
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
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

    if (response.data?.choices?.length > 0) {
      res.json(response.data);
    } else {
      res.status(500).json({
        error: 'Réponse incorrecte reçue d\'OpenRouter',
        details: response.data || 'Aucune réponse valide reçue.',
      });
    }
  } catch (error) {
    console.error('Erreur OpenRouter/OpenAI:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Erreur lors de la communication avec OpenAI via OpenRouter',
      details: error.response?.data || error.message,
    });
  }
});

// Fonction pour formater les données des produits à envoyer au prompt
function formatProductData(products) {
  return products.map(p => {
    const dispo = p.inStock > 0 ? 'En stock' : 'Indisponible';
    const promo = p.reduction > 0 ? `Actuellement en promotion (-${p.reduction}€)` : 'Pas de promotion';
    const lot = p.lotQuantity > 1 ? `Disponible en lot de ${p.lotQuantity} pour ${p.lotPrice}€` : '';
    const poids = p.retailWeight ? `Poids : ${p.retailWeight}g` : '';
    const gros = p.wholesalePrice ? `Prix de gros : ${p.wholesalePrice}€` : '';
    
    return `- ${p.name} (${p.category}) - ${p.unitPrice}€\n  ${p.details}\n  ${dispo}, ${promo}. ${lot} ${poids} ${gros}`.trim();
  }).join('\n\n');
}

module.exports = router;
