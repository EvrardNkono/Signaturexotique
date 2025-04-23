// J’importe Express pour pouvoir créer un routeur
const express = require('express');

const verifyJWT = require('../../middleware/verifyJWT');


// Je crée mon routeur avec la méthode Router d’Express
const router = express.Router();

// J’importe le module sqlite3 pour interagir avec la base
const db = require('../../config/db'); // J’adapte le chemin pour atteindre la base

// Je définis une route POST pour le login
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

// Route POST /login
router.post('/login', (req, res) => {
  const { email, mot_de_passe } = req.body;

  if (!email || !mot_de_passe) {
    console.log('Erreur : Email ou mot de passe manquant.');
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  console.log('Route POST /auth/login atteinte !');
  console.log('Email reçu : ', email);

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) {
      console.error('Erreur lors de la requête SELECT :', err.message);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }

    if (!user) {
      console.log('Utilisateur non trouvé pour l\'email :', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    console.log('Utilisateur trouvé en base :', user);

    bcrypt.compare(mot_de_passe, user.mot_de_passe, (err, result) => {
      if (err) {
        console.error('Erreur lors de la comparaison du mot de passe :', err);
        return res.status(500).json({ error: 'Erreur serveur.' });
      }

      if (!result) {
        console.log('Mot de passe incorrect pour l\'utilisateur :', email);
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      // Création du token JWT
      const token = jwt.sign(
        { email: user.email, id: user.id, role: user.role },  // Payload (information de l'utilisateur)
        process.env.JWT_SECRET, // Clé secrète (mettre ça dans .env)
        { expiresIn: '1h' } // Durée de validité du token (ici 1 heure)
      );

      // On exclut le mot de passe avant de répondre
      const { mot_de_passe: _, ...userSansMotDePasse } = user;

      // Réponse avec le token et les informations de l'utilisateur
      res.json({
        message: 'Connexion réussie !',
        user: userSansMotDePasse,
        token: token // Retourne le token au frontend
      });
    });
  });
});


router.post('/register', (req, res) => {
    const { nom, email, mot_de_passe, num_tel, adresse } = req.body;
  
    // Vérification des champs obligatoires
    if (!nom || !email || !mot_de_passe || !num_tel || !adresse) {
      return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }
  
    // Vérifier si l'email existe déjà dans la base de données
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Erreur serveur.' });
      }
  
      if (user) {
        return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
      }
  
      // Hachage du mot de passe
      bcrypt.hash(mot_de_passe, 10, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: 'Erreur lors du hachage du mot de passe.' });
        }
  
        // Insertion de l'utilisateur dans la base de données
        const query = `INSERT INTO users (nom, email, mot_de_passe, num_tel, adresse, role, is_active) 
                       VALUES (?, ?, ?, ?, ?, 'client', 1)`;
  
        db.run(query, [nom, email, hashedPassword, num_tel, adresse], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'utilisateur.' });
          }
  
          res.status(201).json({ message: 'Utilisateur enregistré avec succès.' });
        });
      });
    });
  });
  // Dans ton fichier server.js ou app.js, ou le fichier où tu définis les routes
router.post('/logout', (req, res) => {
    res.json({ message: 'Déconnexion réussie ! Vous devez maintenant supprimer le token côté client.' });
  });
  // Route pour l'inscription d'un utilisateur
router.post('/auth/register', (req, res) => {
    const { email, password, name, phone } = req.body;
  
    // Vérifier si l'utilisateur existe déjà
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (user) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }
  
      // Hachage du mot de passe avant de le stocker
      const hashedPassword = bcrypt.hashSync(password, 10);
  
      // Ajouter l'utilisateur dans la base de données
      db.run('INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)', 
        [email, hashedPassword, name, phone], (err) => {
          if (err) {
            return res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
          }
          res.status(201).json({ message: 'Utilisateur créé avec succès.' });
      });
    });
  });
  
  //-------------------------------------------------------------
                            //Profil
  //-------------------------------------------------------------


// Mise à jour des informations de profil
router.put('/updateProfile', verifyJWT, async (req, res) => {
    const { name, email, phone, address } = req.body;
    const userId = req.user.id; // Récupère l'id de l'utilisateur depuis le JWT
  
    try {
      // Vérifier si l'email est déjà pris
      const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
      }
  
      // Mise à jour des informations dans la base de données
      await db.run('UPDATE users SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?',
        [name, email, phone, address, userId]);
  
      res.status(200).json({ message: 'Profil mis à jour avec succès' });
    } catch (err) {
      console.error('Erreur mise à jour profil:', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  // Mise à jour du mot de passe
  router.put('/updatePassword', verifyJWT, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
  
    try {
      const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }
  
      // Vérifier le mot de passe actuel
      const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: 'Mot de passe actuel incorrect.' });
      }
  
      // Hacher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Mise à jour du mot de passe dans la base de données
      await db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
  
      res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
    } catch (err) {
      console.error('Erreur mise à jour mot de passe:', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // Récupérer les infos du profil utilisateur
router.get('/profile', verifyJWT, async (req, res) => {
    const userId = req.user.id;
  
    try {
      const user = await db.get('SELECT name, email, phone, address FROM users WHERE id = ?', [userId]);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error('Erreur récupération profil:', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  

  

// J’exporte ce routeur pour pouvoir l’utiliser ailleurs (comme dans server.js)
module.exports = router;
