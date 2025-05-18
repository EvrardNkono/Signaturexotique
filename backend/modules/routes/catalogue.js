const express = require('express');
const router = express.Router();
const db = require('../../config/db');

const dbAll = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

/**
 * ============================================
 *       PRODUITS VISIBLES POUR CATALOGUE
 * ============================================
 * Route : GET /admin/catalogue
 * Accès : Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      nom,
      categorie,
      prixMax,
      poidsMinRetail,
      poidsMaxRetail,
      poidsMinWholesale,
      poidsMaxWholesale
    } = req.query;

    let query = 'SELECT * FROM products WHERE isVisible = 1';
    const params = [];

    if (nom) {
      query += ' AND name LIKE ?';
      params.push(`%${nom}%`);
    }

    if (categorie) {
      query += ' AND category = ?';
      params.push(categorie);
    }

    if (prixMax) {
      query += ' AND unitPrice <= ?';
      params.push(prixMax);
    }

    if (poidsMinRetail) {
      query += ' AND retailWeight >= ?';
      params.push(poidsMinRetail);
    }

    if (poidsMaxRetail) {
      query += ' AND retailWeight <= ?';
      params.push(poidsMaxRetail);
    }

    if (poidsMinWholesale) {
      query += ' AND wholesaleWeight >= ?';
      params.push(poidsMinWholesale);
    }

    if (poidsMaxWholesale) {
      query += ' AND wholesaleWeight <= ?';
      params.push(poidsMaxWholesale);
    }

    const products = await dbAll(query, params);

    const baseUrl = `${req.protocol}://${req.get('host')}/`; // 🔧 Corrigé ici aussi

const productsWithImageUrl = products.map(product => {
  const fullUrl = product.image ? baseUrl + product.image : null;
  console.log(`🖼️ [FILTER] Image récupérée pour "${product.name}": ${fullUrl}`);
  return {
    ...product,
    imageUrl: fullUrl
  };
});



    res.json(productsWithImageUrl);
  } catch (err) {
    console.error('Erreur récupération catalogue :', err);
    res.status(500).json({ message: 'Erreur lors de la récupération du catalogue' });
  }
});


/**
 * ============================================
 *         FILTRAGE DE PRODUITS (BASIC)
 * ============================================
 * Route : GET /admin/catalogue/filter
 * Accès : Public
 */
router.get('/filter', async (req, res) => {
  const { nom, categorie, prixMax } = req.query;

  try {
    let query = `SELECT * FROM products WHERE isVisible = 1`;
    const params = [];

    if (nom) {
      query += ` AND name LIKE ?`;
      params.push(`%${nom}%`);
    }

    if (categorie) {
      query += ` AND category = ?`;
      params.push(categorie);
    }

    if (prixMax) {
      query += ` AND unitPrice <= ?`;
      params.push(parseFloat(prixMax));
    }

    const products = await dbAll(query, params);

    const baseUrl = `${req.protocol}://${req.get('host')}/static/`;
    const productsWithImageUrl = products.map(product => ({
      ...product,
      imageUrl: product.image ? baseUrl + product.image : null
    }));

    res.json(productsWithImageUrl);
  } catch (error) {
    console.error('Erreur lors du filtrage des produits:', error);
    res.status(500).json({ error: 'Erreur serveur lors du filtrage' });
  }
});

module.exports = router;
