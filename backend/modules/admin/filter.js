const express = require('express');
const router = express.Router();
const db = require('../../config/db');

// ✅ LOG pour confirmer le chargement du module
console.log('✅ [filter.js] Route de filtre chargée');

// GET /admin/product/filter?nom=...&categorie=...&prixMax=...
router.get('/product/filter', (req, res) => {
  const { nom, categorie, prixMax } = req.query;

  console.log('🔍 [Filtrage] Paramètres reçus :', req.query);

  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (nom && nom.trim() !== '') {
    query += ' AND name LIKE ?';
    params.push(`%${nom.trim()}%`);
  }

  if (categorie && categorie.trim() !== '') {
    query += ' AND category = ?';
    params.push(categorie.trim());
  }

  const maxPrice = parseFloat(prixMax);
  if (!isNaN(maxPrice)) {
    query += ' AND (unitPrice <= ? OR wholesalePrice <= ?)';
    params.push(maxPrice, maxPrice);
  }

  console.log('🟡 [Filtrage] Requête SQL :', query);
  console.log('🟡 [Filtrage] Paramètres SQL :', params);

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('🔴 [Filtrage] ERREUR SQL :', err.message);
      console.error('🔴 Stack trace :', err.stack);

      return res.status(500).json({
        message: 'Erreur lors de la récupération des produits',
        error: err.message,
        stack: err.stack,
        query,
        params,
      });
    }

    console.log('🟢 [Filtrage] Produits trouvés :', rows.length);
    res.json(rows);
  });
});

// GET /admin/category (récupérer les catégories distinctes)
router.get('/category', (req, res) => {
  const query = 'SELECT DISTINCT category FROM products';

  console.log('--- [Catégorie] Requête SQL :', query);

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('🔴 [Catégorie] Erreur SQL :', err.message);
      console.error('Stack trace :', err.stack);
      return res.status(500).json({ message: 'Erreur serveur', error: err.message, stack: err.stack });
    }

    console.log('🟢 [Catégorie] Catégories récupérées :', rows);
    res.json(rows);
  });
});

module.exports = router;
