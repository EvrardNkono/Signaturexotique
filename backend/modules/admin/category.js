const express = require('express');
const router = express.Router();
const Category = require('../../models/categoryModel');
const db = require('../../config/db'); // Adapte si nécessaire

// Route pour obtenir toutes les catégories
router.get('/', (req, res) => {
  db.all('SELECT * FROM categories', (err, rows) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: err.message });
      } else {
          res.json(rows);
      }
  });
});

// Route pour obtenir une catégorie par son ID
router.get('/', async (req, res) => {
  try {
    const categories = await dbAll('SELECT * FROM categories');
    res.json(categories);  // Retourne les catégories en JSON
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
  }
});

// Route pour créer une nouvelle catégorie
router.post('/', (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Le nom de la catégorie est requis' });
    }

    Category.createCategory(name, (err, newCategory) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la création de la catégorie', error: err });
        }
        res.status(201).json(newCategory);
    });
});

// Route pour supprimer une catégorie
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    Category.deleteCategory(id, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur lors de la suppression de la catégorie', error: err });
        }
        if (!result) {
            return res.status(404).json({ message: 'Catégorie non trouvée' });
        }
        res.status(200).json({ message: 'Catégorie supprimée', result });
    });
});

// Route pour mettre à jour une catégorie
// Mise à jour d'une catégorie
router.put('/:id', async (req, res) => {
  console.log(req.params);  // Vérifie si l'id est bien dans req.params
  const { id } = req.params;
  const { name } = req.body;

  try {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }

      if (!row) {
        return res.status(404).json({ message: 'Catégorie non trouvée' });
      }

      const updateSql = 'UPDATE categories SET name = ? WHERE id = ?';
      db.run(updateSql, [name, id], function (updateErr) {
        if (updateErr) {
          console.error(updateErr);
          return res.status(500).json({ message: 'Erreur lors de la mise à jour' });
        }

        res.json({ id, name });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



// Récupérer toutes les catégories
router.get('/admin/category', async (req, res) => {
    try {
      const categories = await Category.find(); // Remplace par la méthode appropriée pour récupérer les catégories depuis ta base de données
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: 'Erreur lors de la récupération des catégories' });
    }
  });

module.exports = router;
