const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const util = require('util');

const db = require('../../config/db'); // Connexion à la base SQLite
const dbAll = util.promisify(db.all).bind(db); // Promisify pour db.all

const router = express.Router();

// Middleware d'authentification
const verifyJWT = require('../../middleware/verifyJWT');
const checkRole = require('../../middleware/checkRole'); // Vérifie les rôles (admin/superadmin)

// Configuration de Multer pour l’upload d’images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

/**
 * ============================================
 *              CRÉATION DE PRODUIT
 * ============================================
 * Route : POST /admin/products
 * Accès : Admin ou Superadmin uniquement
 */
router.post(
  '/',
  verifyJWT,
  checkRole(['admin', 'superadmin']),
  upload.single('image'),
  async (req, res) => {
    try {
      const {
        name,
        category,
        unitPrice,
        wholesalePrice,
        unit,
        wholesaleUnit,
        reduction // 👈 Ajouté ici
      } = req.body;

      const image = req.file ? req.file.filename : null;

      if (!name || !category || !unitPrice || !wholesalePrice || !unit || !wholesaleUnit) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
      }

      const result = await db.run(
        `INSERT INTO products (name, category, unitPrice, wholesalePrice, image, unit, wholesaleUnit, reduction)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, category, unitPrice, wholesalePrice, image, unit, wholesaleUnit, reduction || 0]
      );

      res.status(201).json({
        message: 'Produit créé avec succès',
        product: {
          id: result.lastID,
          name,
          category,
          unitPrice,
          wholesalePrice,
          unit,
          wholesaleUnit,
          reduction: reduction || 0,
          imageURL: image ? `/uploads/${image}` : null
        }
      });

    } catch (error) {
      console.error('Erreur lors de la création du produit :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

  

/**
 * ============================================
 *          RÉCUPÉRATION DES PRODUITS
 * ============================================
 * Route : GET /admin/products
 * Accès : Public
 */
router.get('/', async (req, res) => {
    try {
        const { nom, categorie, prixMax } = req.query;

        let query = 'SELECT * FROM products WHERE 1=1';

        if (nom) {
            query += ` AND nom LIKE '%${nom}%'`;
        }

        if (categorie) {
            query += ` AND categorie = '${categorie}'`;
        }

        if (prixMax) {
            query += ` AND prix <= ${prixMax}`;
        }

        const products = await dbAll(query);
        res.json(products);

    } catch (err) {
        console.error('Erreur récupération produits :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
    }
});

/**
 * ============================================
 *          MISE À JOUR D’UN PRODUIT
 * ============================================
 * Route : PUT /admin/products/:id
 * Accès : Admin ou Superadmin
 */
router.put(
  '/:id',
  verifyJWT,
  checkRole(['admin', 'superadmin']),
  upload.single('image'),
  async (req, res) => {
    const { id } = req.params;
    const { name, category, unitPrice, wholesalePrice, unit, wholesaleUnit, reduction } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validation des champs
    if (!name || !category || !unitPrice || !wholesalePrice || !unit || !wholesaleUnit) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
      // Récupère le produit existant
      const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);

      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      // Prépare la requête UPDATE avec la réduction
      const updateSql = `
        UPDATE products
        SET name = ?, category = ?, unitPrice = ?, wholesalePrice = ?, image = ?, unit = ?, wholesaleUnit = ?, reduction = ?
        WHERE id = ?
      `;

      const imageToUpdate = image || product.image;

      await db.run(updateSql, [
        name,
        category,
        unitPrice,
        wholesalePrice,
        imageToUpdate,
        unit,
        wholesaleUnit,
        reduction || 0,  // Si aucune réduction n'est fournie, on garde 0 comme valeur par défaut
        id
      ]);

      // Répond avec les infos mises à jour
      res.status(200).json({
        message: 'Produit mis à jour avec succès',
        product: {
          id,
          name,
          category,
          unitPrice,
          wholesalePrice,
          unit,
          wholesaleUnit,
          reduction: reduction || 0,  // Inclut la réduction dans la réponse
          imageURL: imageToUpdate ? `/uploads/${imageToUpdate}` : null
        }
      });

    } catch (error) {
      console.error('Erreur mise à jour produit :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);

  

/**
 * ============================================
 *          AJOUTER UN PRODUIT AU PANIER
 * ============================================
 * Route : POST /cart
 * Accès : Authentifié (JWT)
 */
router.post('/cart', verifyJWT, async (req, res) => {
  const { cart } = req.body;
  const userId = req.user.id; // Utilisation de l'ID utilisateur à partir du token JWT

  // Vérifier que le panier existe
  if (!cart || !cart.length) {
    return res.status(400).json({ message: 'Le panier est vide.' });
  }

  try {
    // Pour chaque produit du panier, soit on l'ajoute soit on met à jour la quantité
    for (const item of cart) {
      const { productId, quantity, price, clientType } = item;

      // Vérifier si le produit est déjà dans le panier de cet utilisateur
      const existingItem = await db.get('SELECT * FROM cart WHERE user_id = ? AND productId = ?', [userId, productId]);

      if (existingItem) {
        // Si le produit existe déjà, on met à jour la quantité
        const updatedQuantity = existingItem.quantity + quantity;

        await db.run('UPDATE cart SET quantity = ? WHERE user_id = ? AND productId = ?', [updatedQuantity, userId, productId]);
      } else {
        // Sinon on l'ajoute
        await db.run('INSERT INTO cart (productId, quantity, price, clientType, user_id) VALUES (?, ?, ?, ?, ?)', 
          [productId, quantity, price, clientType, userId]);
      }
    }

    res.status(200).json({ message: 'Panier mis à jour avec succès.' });
  } catch (err) {
    console.error('Erreur lors de la mise à jour du panier:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});



/**
 * ============================================
 *          RÉCUPÉRER LE PANIER DE L'UTILISATEUR
 * ============================================
 * Route : GET /cart
 * Accès : Authentifié (JWT)
 */
router.get('/cart', verifyJWT, async (req, res) => {
  const userId = req.user.id; // On récupère l'ID de l'utilisateur du token

  try {
      // Récupérer tous les produits dans le panier de cet utilisateur
      const cartItems = await db.all('SELECT * FROM cart WHERE user_id = ?', [userId]);
      
      if (!cartItems.length) {
          return res.status(404).json({ message: 'Votre panier est vide.' });
      }

      res.json(cartItems);
  } catch (err) {
      console.error('Erreur lors de la récupération du panier:', err);
      res.status(500).json({ message: 'Erreur serveur.' });
  }
});



router.get('/deals', async (req, res) => {
  try {
    const productsOnSale = await db.all(`
      SELECT * FROM products
      WHERE reduction > 0
    `);

    res.status(200).json(productsOnSale);
  } catch (error) {
    console.error('Erreur récupération bons plans :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// /modules/products/products.js

module.exports = router;
