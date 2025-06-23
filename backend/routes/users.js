// routes/users.js
const express = require('express');
const router = express.Router();
const db = require('../config/db'); // adapter selon ta config
const bcrypt = require('bcryptjs');

// GET all users
router.get('/', (req, res) => {
  db.all('SELECT id, nom, email, num_tel, acceptOffers, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('Erreur récupération utilisateurs', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    res.json(rows);
  });
});

// DELETE user by id
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      console.error('Erreur suppression utilisateur', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès' });
  });
});

// PUT update user by id
router.put('/:id', async (req, res) => {
  console.log('Données reçues pour mise à jour :', req.body);
  const id = req.params.id;
  const { nom, email, num_tel, acceptOffers, password } = req.body;

  if (!nom || !email) {
    return res.status(400).json({ message: 'Nom et email sont requis' });
  }

  let hashedPassword = null;
  try {
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
  } catch (err) {
    console.error('Erreur hash password', err);
    return res.status(500).json({ message: 'Erreur serveur' });
  }

  // Construire la requête et les paramètres en fonction de si password est modifié ou pas
  const query = hashedPassword
    ? `UPDATE users SET nom = ?, email = ?, num_tel = ?, acceptOffers = ?, password = ? WHERE id = ?`
    : `UPDATE users SET nom = ?, email = ?, num_tel = ?, acceptOffers = ? WHERE id = ?`;

  const params = hashedPassword
    ? [nom, email, num_tel, acceptOffers ? 1 : 0, hashedPassword, id]
    : [nom, email, num_tel, acceptOffers ? 1 : 0, id];

  db.run(query, params, function(err) {
    if (err) {
      console.error('Erreur mise à jour utilisateur', err);
      return res.status(500).json({ message: 'Erreur serveur' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    // Récupérer l'utilisateur mis à jour pour la réponse
    db.get('SELECT id, nom, email, num_tel, acceptOffers, created_at FROM users WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Erreur récupération utilisateur après mise à jour', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.json(row);
    });
  });
});

module.exports = router;
