const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env; // Récupère la clé secrète du fichier .env

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Récupère le token de l'en-tête Authorization

  if (!token) {
    return res.status(403).json({ error: 'Accès interdit, token manquant' }); // Si pas de token, accès interdit
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Vérifie le token avec la clé secrète
    req.user = decoded; // Ajoute l'utilisateur décodé à la requête
    next(); // Passe au prochain middleware ou à la route
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide ou expiré' }); // Si le token est invalide ou expiré
  }
};

module.exports = verifyToken;
