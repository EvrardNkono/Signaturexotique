const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const util = require('util');

const db = require('../../config/db'); // Connexion à la base SQLite
const dbAll = util.promisify(db.all).bind(db); // Promisify pour db.all

const router = express.Router();
const fs = require('fs');
const fsPromises = require('fs').promises;

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
      reduction,
      lotQuantity,
      lotPrice,
      inStock,
      retailWeight,     // ✅ Poids pour particulier (nouveau nom)
      wholesaleWeight,  // ✅ Poids pour grossiste
      details           // ✅ Détails supplémentaires du produit (nouveau champ)
    } = req.body;

    const image = req.file ? req.file.filename : null;

    // Validation des champs obligatoires
    if (!name || !category || !unitPrice || !wholesalePrice || !retailWeight || !wholesaleWeight || !details) {
      return res.status(400).json({ message: 'Tous les champs sont requis, y compris les détails.' });
    }

    // Validation de inStock (par défaut à true si non fourni)
    const stockStatus = inStock === undefined ? 1 : inStock === 'true' ? 1 : 0;

    try {
      // Création de l'insertion SQL avec le champ details
      const insertSql = `
        INSERT INTO products (
          name, category, unitPrice, wholesalePrice, image, reduction,
          lotQuantity, lotPrice, inStock, retailWeight, wholesaleWeight, details
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const result = await db.run(insertSql, [
        name,
        category,
        unitPrice,
        wholesalePrice,
        image,
        reduction || 0,
        lotQuantity || null,
        lotPrice || null,
        stockStatus,
        retailWeight,       // ✅ Poids pour particulier
        wholesaleWeight,    // ✅ Poids pour grossiste
        details             // ✅ Nouveau champ "details" pour description
      ]);

      res.status(201).json({
        message: 'Produit créé avec succès',
        product: {
          id: result.lastID,
          name,
          category,
          unitPrice,
          wholesalePrice,
          reduction: reduction || 0,
          lotQuantity: lotQuantity || null,
          lotPrice: lotPrice || null,
          inStock: stockStatus === 1,
          retailWeight,      // ✅ Poids pour particulier
          wholesaleWeight,   // ✅ Poids pour grossiste
          details,           // ✅ Détails du produit
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
    const {
      nom,
      categorie,
      prixMax,
      poidsMinRetail,     // ✅ Nouveau nom
      poidsMaxRetail,     // ✅ Nouveau nom
      poidsMinWholesale,
      poidsMaxWholesale
    } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';

    if (nom) {
      query += ` AND name LIKE '%${nom}%'`;
    }

    if (categorie) {
      query += ` AND category = '${categorie}'`;
    }

    if (prixMax) {
      query += ` AND unitPrice <= ${prixMax}`;
    }

    if (poidsMinRetail) {
      query += ` AND retailWeight >= ${poidsMinRetail}`;  // ✅ nouvelle colonne
    }

    if (poidsMaxRetail) {
      query += ` AND retailWeight <= ${poidsMaxRetail}`;  // ✅ nouvelle colonne
    }

    if (poidsMinWholesale) {
      query += ` AND wholesaleWeight >= ${poidsMinWholesale}`;
    }

    if (poidsMaxWholesale) {
      query += ` AND wholesaleWeight <= ${poidsMaxWholesale}`;
    }

    // Récupération des produits avec tous les critères
    const products = await dbAll(query);

    // Envoi des produits récupérés avec les détails
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
    const {
      name,
      category,
      unitPrice,
      wholesalePrice,
      retailWeight,
      wholesaleWeight,
      reduction,
      lotQuantity,
      lotPrice,
      inStock,
      details
    } = req.body;

    // 🧳 DEBUG EXPRESS : ce qu’on reçoit dans req.body et req.file
    console.log('📦 Champs reçus (req.body):', req.body);
    console.log('🖼️ Fichier reçu (req.file):', req.file);

    if (!name || !category || !unitPrice || !wholesalePrice) {
      return res.status(400).json({ message: 'Tous les champs obligatoires ne sont pas remplis.' });
    }

    try {
      const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      // Gestion image : nouvelle image > image envoyée dans le body > image déjà en DB
      const imageToUpdate = req.file?.filename || req.body.image || product.image;

      // Autres champs
      const retailWeightToUpdate = retailWeight ?? product.retailWeight;
      const wholesaleWeightToUpdate = wholesaleWeight ?? product.wholesaleWeight;
      const detailsToUpdate = details ?? product.details;
      const stockStatus = inStock !== undefined
        ? (inStock === 'true' || inStock === '1' || inStock === 1 ? 1 : 0)
        : product.inStock;
      const reductionToUpdate = reduction ?? product.reduction;
      const lotQuantityToUpdate = lotQuantity ?? product.lotQuantity;
      const lotPriceToUpdate = lotPrice ?? product.lotPrice;

      console.log("🖼️ Image utilisée pour update :", {
        file: req.file?.filename,
        bodyImage: req.body.image,
        finalImage: imageToUpdate
      });

      await db.run(`
        UPDATE products
        SET name = ?, category = ?, unitPrice = ?, wholesalePrice = ?, image = ?, unit = ?, wholesaleUnit = ?, 
            reduction = ?, lotQuantity = ?, lotPrice = ?, inStock = ?, retailWeight = ?, wholesaleWeight = ?, details = ?
        WHERE id = ?
      `, [
        name,
        category,
        unitPrice,
        wholesalePrice,
        imageToUpdate,
        product.unit,
        product.wholesaleUnit,
        reductionToUpdate,
        lotQuantityToUpdate,
        lotPriceToUpdate,
        stockStatus,
        retailWeightToUpdate,
        wholesaleWeightToUpdate,
        detailsToUpdate,
        id
      ]);

      res.status(200).json({
        message: 'Produit mis à jour avec succès',
        product: {
          id,
          name,
          category,
          unitPrice,
          wholesalePrice,
          unit: product.unit,
          wholesaleUnit: product.wholesaleUnit,
          reduction: reductionToUpdate,
          lotQuantity: lotQuantityToUpdate,
          lotPrice: lotPriceToUpdate,
          imageURL: imageToUpdate ? `/uploads/${imageToUpdate}` : null,
          inStock: stockStatus,
          retailWeight: retailWeightToUpdate,
          wholesaleWeight: wholesaleWeightToUpdate,
          details: detailsToUpdate
        }
      });

    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du produit :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);








/**
 * ============================================
 *        SUPPRESSION D'UN PRODUIT
 * ============================================
 * Route : DELETE /admin/products/:id
 * Accès : Admin ou Superadmin uniquement
 */
router.delete('/:id', verifyJWT, checkRole(['admin', 'superadmin']), async (req, res) => {
  const { id } = req.params;

  try {
    // Récupération du produit pour obtenir l'image
    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    // Suppression de l'image si elle existe
    if (product.image) {
      const fs = require('fs');
      const imagePath = path.join(__dirname, '../../public/uploads/', product.image);

      // Supprime le fichier (sans casser si il n'existe pas)
      fs.unlink(imagePath, (err) => {
        if (err) console.warn("Image non supprimée ou déjà absente :", err.message);
      });
    }

    // Suppression du produit
    await db.run('DELETE FROM products WHERE id = ?', [id]);

    res.json({ message: 'Produit supprimé avec succès' });

  } catch (err) {
    console.error('Erreur suppression produit :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});





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
