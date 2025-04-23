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
            const { name, category, unitPrice, wholesalePrice } = req.body;
            const image = req.file ? req.file.filename : null;

            if (!name || !category || !unitPrice || !wholesalePrice) {
                return res.status(400).json({ message: 'Tous les champs sont requis.' });
            }

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
        const { name, category, unitPrice, wholesalePrice } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name || !category || !unitPrice || !wholesalePrice) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        try {
            const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);

            if (!product) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }

            const updateSql = `
                UPDATE products
                SET name = ?, category = ?, unitPrice = ?, wholesalePrice = ?, image = ?
                WHERE id = ?
            `;

            const imageToUpdate = image || product.image;

            await db.run(updateSql, [
                name,
                category,
                unitPrice,
                wholesalePrice,
                imageToUpdate,
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
                    imageURL: imageToUpdate ? `/uploads/${imageToUpdate}` : null
                }
            });

        } catch (error) {
            console.error('Erreur mise à jour produit :', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
);

module.exports = router;
