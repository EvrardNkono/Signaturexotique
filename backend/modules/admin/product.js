const express = require('express');
const multer = require('multer');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const util = require('util');
const fs = require('fs');

const db = require('../../config/db'); // Connexion à la base SQLite
const dbAll = util.promisify(db.all).bind(db); // Promisify pour db.all

const router = express.Router();

// Middleware d'authentification
const verifyJWT = require('../../middleware/verifyJWT');
const checkRole = require('../../middleware/checkRole'); // Vérifie les rôles (admin/superadmin)

// Configuration de Multer pour l’upload d’images avec dossier dynamique
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 👉 Force "autres" ici, car req.body.category ne sera pas dispo à ce moment-là
    const uploadPath = path.join(__dirname, '../../public/uploads/images', 'autres');
    console.log('📂 Destination upload:', uploadPath);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    if (!allowedExtensions.includes(ext)) {
      return cb(new Error('Extension de fichier non autorisée'), null);
    }

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
      retailWeight,
      wholesaleWeight,
      details
    } = req.body;

    const safeCategory = category ? category.replace(/\s+/g, '-').toLowerCase() : 'autres';

    if (!name || !category || !unitPrice || !wholesalePrice || !retailWeight || !wholesaleWeight || !details) {
      return res.status(400).json({ message: 'Tous les champs sont requis, y compris les détails.' });
    }

    const stockStatus = inStock === undefined ? 1 : inStock === 'true' ? 1 : 0;

    let imagePath = null;

    try {
      // Gestion de l'image si fournie
      if (req.file) {
        const currentImagePath = req.file.path; // dans le dossier "autres" temporaire
        const newDir = path.join(__dirname, '../../public/uploads/images', safeCategory);
        const newImagePath = path.join(newDir, req.file.filename);

        // Créer le dossier si besoin
        if (!fs.existsSync(newDir)) {
          fs.mkdirSync(newDir, { recursive: true });
        }

        // Déplacer le fichier
        fs.renameSync(currentImagePath, newImagePath);

        // Chemin relatif pour la BDD
        imagePath = `uploads/images/${safeCategory}/${req.file.filename}`;
      }

      // Insertion en BDD
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
        imagePath,
        reduction || 0,
        lotQuantity || null,
        lotPrice || null,
        stockStatus,
        retailWeight,
        wholesaleWeight,
        details
      ]);

      res.status(201).json({
        message: '🎉 Produit créé avec succès',
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
          retailWeight,
          wholesaleWeight,
          details,
          imageURL: imagePath ? `/${imagePath}` : null
        }
      });

    } catch (error) {
      console.error('❌ Erreur lors de la création du produit :', error);
      res.status(500).json({ message: 'Erreur serveur lors de la création du produit.' });
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
  console.log("Requête reçue avec query :", req.query);

  try {
    const {
      nom,
      categorie,
      prixMax,
      poidsMinRetail,
      poidsMaxRetail,
      poidsMinWholesale,
      poidsMaxWholesale,
      includeHidden // ✅ Paramètre admin
    } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // 🔍 Filtrer par visibilité sauf si includeHidden = '1'
    if (includeHidden !== '1') {
      query += ' AND isVisible = 1';
    }

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
  upload.none(), // ✅ permet de parser les champs texte de FormData
  async (req, res) => {
    const { id } = req.params;

    const {
      name,
      category,
      unitPrice,
      wholesalePrice,
      reduction,
      lotQuantity,
      lotPrice,
      inStock,
      retailWeight,
      wholesaleWeight,
      details,
    } = req.body;

    if (!name || !category || !unitPrice || !wholesalePrice) {
      return res.status(400).json({ message: 'Tous les champs obligatoires ne sont pas remplis.' });
    }

    try {
      const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
      if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

      const stockStatus = (inStock !== undefined)
        ? (inStock === 'true' || inStock === '1' || inStock === 1 ? 1 : 0)
        : product.inStock;

      await db.run(
        `
        UPDATE products
        SET 
          name = ?, 
          category = ?, 
          unitPrice = ?, 
          wholesalePrice = ?, 
          reduction = ?, 
          lotQuantity = ?, 
          lotPrice = ?, 
          inStock = ?, 
          retailWeight = ?, 
          wholesaleWeight = ?, 
          details = ?
        WHERE id = ?
        `,
        [
          name,
          category,
          unitPrice,
          wholesalePrice,
          reduction ?? product.reduction,
          lotQuantity ?? product.lotQuantity,
          lotPrice ?? product.lotPrice,
          stockStatus,
          retailWeight ?? product.retailWeight,
          wholesaleWeight ?? product.wholesaleWeight,
          details ?? product.details,
          id,
        ]
      );

      res.status(200).json({
        message: 'Produit mis à jour (sans image) avec succès',
        product: {
          id,
          name,
          category,
          unitPrice,
          wholesalePrice,
          reduction: reduction ?? product.reduction,
          lotQuantity: lotQuantity ?? product.lotQuantity,
          lotPrice: lotPrice ?? product.lotPrice,
          inStock: stockStatus,
          retailWeight: retailWeight ?? product.retailWeight,
          wholesaleWeight: wholesaleWeight ?? product.wholesaleWeight,
          details: details ?? product.details,
          imageURL: product.image ? `/${product.image}` : null,
        },
      });
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du produit (sans image) :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
);






// 2. Route PUT pour mettre à jour l’image
router.put('/:id/image', verifyJWT, checkRole(['admin', 'superadmin']), upload.single('image'), async (req, res) => {
  const { id } = req.params;

  try {
    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    if (!req.file) return res.status(400).json({ message: "Aucune image envoyée." });

    const category = req.body.category || product.category || 'autres';
    const safeCategory = category.replace(/\s+/g, '-').toLowerCase();

    const oldImagePath = product.image ? path.join(__dirname, '../../public', product.image) : null;
    const currentImagePath = req.file.path; // chemin complet dans 'autres'
    const newDir = path.join(__dirname, '../../public/uploads/images', safeCategory);
    const newImageName = req.file.filename;
    const newImagePath = path.join(newDir, newImageName);

    // Création du dossier cible s'il n'existe pas
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir, { recursive: true });
    }

    // Déplacement du fichier vers le dossier catégorie
    fs.renameSync(currentImagePath, newImagePath);

    // Suppression de l'ancienne image si différente
    if (oldImagePath && oldImagePath !== newImagePath && fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath);
    }

    // Mise à jour BDD avec le nouveau chemin relatif
    const relativeImagePath = `uploads/images/${safeCategory}/${newImageName}`;
    await db.run('UPDATE products SET image = ? WHERE id = ?', [relativeImagePath, id]);

    res.status(200).json({
      message: '✅ Image du produit mise à jour avec succès',
      product: {
        id,
        imageURL: `/${relativeImagePath}`,
      },
    });
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour de l’image :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de l’image.' });
  }
});







/**
 * ============================================
 *       Changer la visibilite.
 * ============================================
 **/



// PATCH /products/:id/visibility
router.patch('/:id/visibility', async (req, res) => {
    console.log('PATCH reçu avec id :', req.params.id, 'isVisible :', req.body.isVisible);
  const { id } = req.params;
  const { isVisible } = req.body;

  try {
    await db.run('UPDATE products SET isVisible = ? WHERE id = ?', [isVisible, id]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erreur PATCH visibilité produit :', err);
    res.status(500).json({ error: 'Échec de la mise à jour de visibilité' });
  }
});








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
