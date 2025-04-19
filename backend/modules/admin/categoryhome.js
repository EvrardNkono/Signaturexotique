const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // Assure-toi de bien connecter la base de données ici

// Route pour récupérer les produits par catégorie
router.get('/', async (req, res) => {
  const { categorie } = req.query; // Récupérer la catégorie depuis les paramètres de requête

  if (!categorie) {
    return res.status(400).json({ error: 'Aucune catégorie spécifiée' });
  }

  try {
    // Requête SQL pour récupérer les produits filtrés par catégorie
    const products = await db('products')
      .join('categories', 'products.categoryId', '=', 'categories.id')
      .where('categories.name', categorie)
      .select('products.id', 'products.name', 'products.price', 'products.image', 'products.description'); // Sélectionner les colonnes pertinentes
    
    res.json(products); // Retourner les produits trouvés
  } catch (error) {
    console.error('Erreur lors de la récupération des produits par catégorie:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des produits.' });
  }
});

module.exports = router;
