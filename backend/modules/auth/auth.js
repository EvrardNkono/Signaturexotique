// J’importe Express pour pouvoir créer un routeur
const express = require('express');

// Je crée mon routeur avec la méthode Router d’Express
const router = express.Router();

// J’importe le module sqlite3 pour interagir avec la base
const db = require('../../config/db'); // J’adapte le chemin pour atteindre la base

// Je définis une route POST pour le login
const bcrypt = require('bcrypt');

router.post('/login', (req, res) => {
  // Je récupère l’email et le mot de passe depuis le body de la requête
  const { email, mot_de_passe } = req.body;

  // Si l’un des deux est manquant, je renvoie une erreur
  if (!email || !mot_de_passe) {
    console.log('Erreur : Email ou mot de passe manquant.');
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  console.log('Route POST /auth/login atteinte !'); // Ce log va vérifier que la route est bien touchée
  console.log('Email reçu : ', email); // Vérification de l'email reçu
  console.log('Mot de passe reçu : ', mot_de_passe); // Vérification du mot de passe reçu

  // Je prépare une requête pour trouver l’utilisateur correspondant à cet email
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) {
      console.error('Erreur lors de la requête SELECT :', err.message);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }

    // Si aucun utilisateur n'est trouvé en base avec cet email
    if (!user) {
      console.log('Utilisateur non trouvé pour l\'email :', email);
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    console.log('🕵️‍♂️ Utilisateur trouvé en base :', user);

    // Comparaison du mot de passe haché
    bcrypt.compare(mot_de_passe, user.mot_de_passe, (err, result) => {
      if (err) {
        console.error('Erreur lors de la comparaison du mot de passe :', err);
        return res.status(500).json({ error: 'Erreur serveur.' });
      }

      // Si le mot de passe est incorrect
      if (!result) {
        console.log('Mot de passe incorrect pour l\'utilisateur :', email);
        return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
      }

      // Si tout est ok, je renvoie l’utilisateur (sans le mot de passe)
      const { mot_de_passe: _, ...userSansMotDePasse } = user; // On exclut le mot de passe de l'objet retourné
      res.json({ message: 'Connexion réussie !', user: userSansMotDePasse });
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
  
  
  

  

// J’exporte ce routeur pour pouvoir l’utiliser ailleurs (comme dans server.js)
module.exports = router;
