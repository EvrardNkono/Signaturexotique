const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../../config/db'); // Assure-toi que ce chemin pointe bien vers ton instance SQLite
const util = require('util');
const dbAll = util.promisify(db.all).bind(db);
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Configuration de multer pour enregistrer les fichiers uploadés
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Assure-toi que ce dossier existe
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

/**
 * Route : POST /admin/products
 * Objectif : Créer un nouveau produit
 * Reçoit : name, category, unitPrice, wholesalePrice, image
 */
// Route de création de produit dans le backend
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, category, unitPrice, wholesalePrice } = req.body;
        const image = req.file ? req.file.filename : null;  // Le nom unique de l'image

        // Validation simple
        if (!name || !category || !unitPrice || !wholesalePrice) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        // Insertion dans la base SQLite avec l'image et autres informations
        const result = await db.run(
            `INSERT INTO products (name, category, unitPrice, wholesalePrice, image)
             VALUES (?, ?, ?, ?, ?)`,
            [name, category, unitPrice, wholesalePrice, image]
        );

        res.status(201).json({
            message: 'Produit créé avec succès',
            product: {
                id: result.lastID,
                name,
                category,
                unitPrice,
                wholesalePrice,
                imageURL: image ? `/uploads/${image}` : null  // Retourne le chemin de l'image avec le nom unique
            }
        });
    } catch (error) {
        console.error('Erreur création produit :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});


// Dans ton fichier routes/products.js ou équivalent
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

    const products = await dbAll(query); // Récupérer les produits selon la requête
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des produits' });
  }
});




  router.put('/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params; // Récupère l'id du produit depuis l'URL
    const { name, category, unitPrice, wholesalePrice } = req.body; // Récupère les autres données du produit
    const image = req.file ? req.file.filename : null; // Vérifie si une nouvelle image est envoyée
  
    if (!name || !category || !unitPrice || !wholesalePrice) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
  
    try {
      // Vérification si le produit existe déjà dans la base
      const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }
  
      // Prépare la requête de mise à jour
      const updateSql = `UPDATE products SET name = ?, category = ?, unitPrice = ?, wholesalePrice = ?, image = ? WHERE id = ?`;
  
      // Si aucune image n'est envoyée, ne pas modifier l'image existante
      const imageToUpdate = image || product.image;
  
      // Exécute la mise à jour du produit
      await db.run(updateSql, [name, category, unitPrice, wholesalePrice, imageToUpdate, id]);
  
      res.status(200).json({
        message: 'Produit mis à jour avec succès',
        product: {
          id,
          name,
          category,
          unitPrice,
          wholesalePrice,
          imageURL: imageToUpdate ? `/uploads/${imageToUpdate}` : null
        }
      });
    } catch (error) {
      console.error('Erreur mise à jour produit :', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  

  

module.exports = router;