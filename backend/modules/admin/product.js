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
    const {
      name,
      category,
      unitPrice,
      wholesalePrice,
      unit,
      wholesaleUnit,
      reduction,
      lotQuantity,
      lotPrice,
      inStock,  // On récupère la donnée inStock
    } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validation des champs obligatoires
    if (!name || !category || !unitPrice || !wholesalePrice || !unit || !wholesaleUnit) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    // Validation de inStock (par défaut à true si non fourni)
    const stockStatus = inStock === undefined ? 1 : inStock === 'true' ? 1 : 0;

    try {
      // Création de l'insertion SQL en ajoutant inStock et les champs de lot seulement s'ils existent
      const insertSql = `
        INSERT INTO products (name, category, unitPrice, wholesalePrice, image, unit, wholesaleUnit, reduction, lotQuantity, lotPrice, inStock)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await db.run(insertSql, [
        name,
        category,
        unitPrice,
        wholesalePrice,
        image,
        unit,
        wholesaleUnit,
        reduction || 0,  // Si aucune réduction n'est fournie, on garde 0 comme valeur par défaut
        lotQuantity || null,  // Si la quantité de lot est vide, on la garde à null
        lotPrice || null,     // Si le prix de lot est vide, on le garde à null
        stockStatus,          // Ajout de la valeur inStock
      ]);

      // Réponse après création
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
          lotQuantity: lotQuantity || null,  // Si le champ est non défini, il sera `null`
          lotPrice: lotPrice || null,        // Idem pour le prix de lot
          inStock: stockStatus === 1,        // Affichage de inStock comme un booléen
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

    // Filtrage par nom (colonne "name")
    if (nom) {
      query += ` AND name LIKE '%${nom}%'`;
    }

    // Filtrage par catégorie (colonne "category")
    if (categorie) {
      query += ` AND category = '${categorie}'`;
    }

    // Filtrage par prix max (colonne "unitPrice")
    if (prixMax) {
      query += ` AND unitPrice <= ${prixMax}`;
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
    const { name, category, unitPrice, wholesalePrice, unit, wholesaleUnit, reduction, lotQuantity, lotPrice, inStock } = req.body;
    const image = req.file ? req.file.filename : null;

    // Validation des champs obligatoires
    if (!name || !category || !unitPrice || !wholesalePrice || !unit || !wholesaleUnit) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    try {
      // Récupère le produit existant
      const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);

      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      // Traitement de l'état du stock (inStock)
      const stockStatus = inStock === undefined ? product.inStock : (inStock === 'true' ? 1 : 0);

      // Préparation de l'update
      const updateSql = `
        UPDATE products
        SET name = ?, category = ?, unitPrice = ?, wholesalePrice = ?, image = ?, unit = ?, wholesaleUnit = ?, reduction = ?, 
            lotQuantity = ?, lotPrice = ?, inStock = ?
        WHERE id = ?
      `;

      // Si image existe, on utilise la nouvelle image, sinon on garde l'existante
      const imageToUpdate = image || product.image;

      // Mise à jour dans la base de données
      await db.run(updateSql, [
        name,
        category,
        unitPrice,
        wholesalePrice,
        imageToUpdate,
        unit,
        wholesaleUnit,
        reduction || 0,  // Si la réduction est vide, on la garde à 0
        lotQuantity || null,  // Si lotQuantity est vide, on le garde à null
        lotPrice || null,     // Idem pour lotPrice
        stockStatus,          // Mise à jour du statut du stock
        id
      ]);

      // Réponse après mise à jour
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
          reduction: reduction || 0,
          lotQuantity: lotQuantity || null,  // Si le champ lotQuantity n'est pas fourni, il est null
          lotPrice: lotPrice || null,        // Idem pour lotPrice
          imageURL: imageToUpdate ? `/uploads/${imageToUpdate}` : null,
          inStock: stockStatus  // On retourne le nouveau statut du stock
        }
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit :', error);
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
  const userId = req.user.id;

  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: 'Le panier est vide.' });
  }

  try {
    for (const item of cart) {
      const { productId, quantity: incomingQty, clientType } = item;

      const product = await db.get('SELECT * FROM products WHERE id = ?', [productId]);
      if (!product) continue;

      const unitPrice = clientType === 'retail' ? product.price_retail : product.price_wholesale;
      const lotQty = product.lot_quantity;
      const lotPrice = product.lot_price;

      const existing = await db.get(
        'SELECT * FROM cart WHERE user_id = ? AND productId = ?',
        [userId, productId]
      );

      let totalQty = incomingQty;
      if (existing) totalQty += existing.quantity;

      let finalTotalPrice;
      if (lotQty && lotPrice && totalQty >= lotQty) {
        const lots = Math.floor(totalQty / lotQty);
        const rest = totalQty % lotQty;
        finalTotalPrice = lots * lotPrice + rest * unitPrice;
      } else {
        finalTotalPrice = totalQty * unitPrice;
      }

      const finalUnitPrice = finalTotalPrice / totalQty;

      if (existing) {
        await db.run(
          'UPDATE cart SET quantity = ?, price = ? WHERE user_id = ? AND productId = ?',
          [totalQty, finalUnitPrice, userId, productId]
        );
      } else {
        await db.run(
          'INSERT INTO cart (productId, quantity, price, clientType, user_id) VALUES (?, ?, ?, ?, ?)',
          [productId, incomingQty, finalUnitPrice, clientType, userId]
        );
      }
    }

    res.status(200).json({ message: 'Panier mis à jour avec les bons prix (lot inclus).' });
  } catch (err) {
    console.error('Erreur panier:', err);
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
