// src/middleware/verifyJWT.js
const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
  // Récupérer le token depuis l'en-tête Authorization
  const token = req.headers['authorization']?.split(' ')[1]; // On attend le format "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ message: 'Token manquant ou invalide.' });
  }

  // Vérifier le token avec la clé JWT_SECRET venant de process.env
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide ou expiré.' });
    }

    // Ajouter l'utilisateur décodé à la requête (contenant son ID et rôle)
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;
