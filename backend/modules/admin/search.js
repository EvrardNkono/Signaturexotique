const express = require('express');
const db = require('../../config/db'); // Assure-toi que ce chemin est correct
const util = require('util');
const dbAll = util.promisify(db.all).bind(db);
const router = express.Router();

/**
 * Route : GET /search
 * Objectif : Recherche des produits en fonction des critères (nom, catégorie, prix max)
 * Paramètres : nom, categorie, prixMax
 */
router.get('/', async (req, res) => {
  try {
    const { nom, categorie, prixMax } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';  // Condition de base pour pouvoir ajouter dynamiquement les autres
    const params = [];

    if (nom) {
      query += ' AND name LIKE ?';  // Recherche par nom
      params.push(`%${nom}%`);
    }

    if (categorie) {
      query += ' AND category = ?';  // Recherche par catégorie
      params.push(categorie);
    }

    if (prixMax) {
      query += ' AND unitPrice <= ?';  // Recherche par prix maximum
      params.push(prixMax);
    }

    const products = await dbAll(query, params); // Exécution de la requête
    res.json(products); // Retourne les résultats de la recherche
  } catch (err) {
    console.error('Erreur lors de la recherche des produits:', err);
    res.status(500).json({ message: 'Erreur lors de la recherche des produits' });
  }
});

module.exports = router;
