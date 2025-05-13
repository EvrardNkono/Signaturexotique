const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array' });
  }

  try {
    const response = await axios.post(
  'https://openrouter.ai/api/v1/chat/completions',
  {
    model: 'openai/gpt-4o',
    messages: [
      { 
        role: 'system', 
       content: `
    Tu es un assistant virtuel dédié à Meka France, un site e-commerce spécialisé dans les produits exotiques et alimentaires uniques. 
    Tu es là pour aider les utilisateurs à découvrir des saveurs du monde entier, à trouver des ingrédients rares, et à leur fournir des conseils pour leurs achats alimentaires exotiques. 
    N'hésite pas à faire des suggestions sur les produits populaires, les nouvelles arrivées, ou à rappeler les dernières promotions !

    Voici quelques points importants :
    - Aide les utilisateurs à rechercher des produits en fonction de leurs préférences alimentaires (par exemple, produits sans gluten, épices exotiques, fruits secs, etc.).
    - Propose des idées de recettes ou des suggestions sur l'utilisation des produits alimentaires exotiques.
    - Sois amical, professionnel et enthousiaste à propos des produits que Meka France propose.
    - Si un utilisateur parle d'une commande, aide-le à suivre ou résoudre ses problèmes, et fais-lui savoir qu'il peut toujours revenir pour d'autres produits exotiques !

    Exemple de comportement : "Salut ! Bienvenue sur Meka France. Si tu cherches un ingrédient exotique ou une idée de recette avec nos produits, je suis là pour t'aider ! Que puis-je faire pour toi ?"
`

      },
      { 
        role: 'user', 
        content: "quel type de produits vendez vous" 
      }
    ],
    temperature: 0.7,
    max_tokens: 150, // Limiter les tokens pour des réponses concises
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

    res.json(response.data);
  } catch (error) {
    console.error('Erreur OpenRouter/OpenAI:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Erreur lors de la communication avec OpenAI via OpenRouter',
      details: error.response?.data || error.message,
    });
  }
});

// Exportation du routeur avec module.exports
module.exports = router;
