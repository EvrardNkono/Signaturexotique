// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env; // On récupère la clé secrète du fichier .env

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ error: 'Accès interdit, token manquant' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Vérifie le token
    req.user = decoded; // Ajoute l'information de l'utilisateur décodé à la requête
    next(); // Passe à la prochaine étape (le gestionnaire de route)
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide ou expiré' });
  }
};

module.exports = verifyToken;
