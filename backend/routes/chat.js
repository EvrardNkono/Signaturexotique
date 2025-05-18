const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();
const path = require('path');

const router = express.Router();
const dbPath = path.join(__dirname, '..', 'database.db');

// Connexion à SQLite
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
  if (err) console.error('Erreur d’ouverture de la base :', err.message);
  else console.log('Connexion SQLite ✅');
});

// Récupérer tous les produits
const getAllProducts = () => {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT name, category, unitPrice, wholesalePrice, lotPrice,
             lotQuantity, reduction, inStock, retailWeight, wholesaleWeight, details
      FROM products
    `, (err, rows) => err ? reject(err) : resolve(rows));
  });
};

// Récupérer le nombre total de produits
const getProductCount = () => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT COUNT(*) AS total FROM products`, (err, row) => {
      if (err) reject(err);
      else resolve(row.total);
    });
  });
};

// Endpoint de chat
router.post('/', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages manquants ou invalides.' });
  }

  try {
    const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
    const demandeProduits = /(produit|prix|promo|lot|épice|boisson|vendu|stock|gros|bouteille|combien)/.test(userMessage);
    
    let productContext = "";
    if (demandeProduits) {
      const products = await getAllProducts();
      const productCount = await getProductCount();
      const produitsPertinents = products.slice(0, 15);
      productContext = `
Nous avons actuellement ${productCount} produits référencés chez Meka France.

Voici un aperçu de quelques-uns :
${formatProductData(produitsPertinents)}
      `.trim();
    }

    const systemPrompt = `
Tu es Eric, l’assistant commercial intelligent de Meka France. Tu travailles dans le domaine des produits alimentaires exotiques. Tu es sympathique, professionnel, réactif, dynamique et toujours orienté solution.

🎯 Ta mission :
1. Répondre aux clients avec pertinence, clarté et concision.
2. Présenter des produits avec précision (prix, poids, conditionnement, stock, promos).
3. Proposer des recommandations personnalisées selon le message du client.
4. Mettre en avant la gamme SIGNATURE EXOTIQUE (marque Meka France) qui sera disponible très bientôt dès que l’occasion se présente.
5. Promouvoir les offres pour les professionnels (gros volumes, restauration, épiceries).

🧠 Tu es aussi capable de :
- Déduire les intentions de l’utilisateur même si elles sont implicites.
- Reformuler ou clarifier une demande floue.
- Guider vers la prochaine étape (découverte produit, commande, info pratique).

⚠️ Limites :
- Tu parles exclusivement d’alimentation exotique (épices, boissons, fruits secs, apéritifs, etc.).
- Tu refuses poliment toute question hors sujet (mode, technologie, politique...).

💬 Style :
- Tu parles avec un ton chaleureux et engageant, comme un vendeur passionné.
- Tu es rapide, précis et toujours orienté “solution client”.
- Tu t’adaptes au style du client (formel, curieux, direct, etc.).
- Tu fais vivre une véritable expérience Meka France.

📍 Informations légales de Meka France :
- **Enseigne** : MEKA France
- **Adresse** : 14 rue de la liberté, 77550 Moissy Cramayel
- **Téléphones** : 09.84.59.44.53 / 06.44.75.80.27
- **SIRET** : 792 947 210 00011
- **TVA Intracom** : FR62 792 947 210
- **Code NAF** : 47.11B
- **Début d’exercice comptable** : 01/05/2013

🧾 Informations à imprimer sur ticket client :
- **Email** : mekafrance@outlook.fr
- **Réseaux sociaux** : Facebook, TikTok, Instagram, Snapchat
- **Horaires** : Ouvert chaque jour de 9h à 21h
- **Autres** :
  - Les produits surgelés ou frais ne sont ni repris ni échangés.
  - Livraison gratuite sous conditions.
  - Expédition de marchandises en France et en Europe.

📦 Voici le contexte produit :
${productContext}

➡️ Commence toujours ta réponse par une salutation ou un clin d’œil adapté.  
➡️ Termine par une question ou une suggestion pour garder la conversation vivante.

    `.trim();

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data?.choices?.length > 0) {
      res.json(response.data);
    } else {
      res.status(500).json({ error: 'Réponse vide de Groq' });
    }

  } catch (error) {
    console.error('Erreur Groq:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur Groq', details: error.response?.data || error.message });
  }
});

// Formatage produit
function formatProductData(products) {
  return products.map(p => {
    const dispo = p.inStock > 0 ? 'En stock' : 'Indisponible';
    const promo = p.reduction > 0 ? `Promo (-${p.reduction}€)` : 'Pas de promo';
    const lot = p.lotQuantity > 1 ? `Lot de ${p.lotQuantity} à ${p.lotPrice}€` : '';
    const poids = p.retailWeight ? `Poids : ${p.retailWeight}g` : '';
    const gros = p.wholesalePrice ? `Gros : ${p.wholesalePrice}€` : '';

    return `- ${p.name} (${p.category}) - ${p.unitPrice}€\n  ${p.details}\n  ${dispo}, ${promo}. ${lot} ${poids} ${gros}`.trim();
  }).join('\n\n');
}

module.exports = router;