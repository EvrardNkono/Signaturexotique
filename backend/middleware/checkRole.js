function checkRole(roles) {
    return (req, res, next) => {
      console.log('🔍 Rôle de l’utilisateur détecté :', req.user?.role);
      console.log('🎯 Rôles autorisés pour cette route :', roles);
  
      if (!req.user || !roles.includes(req.user.role)) {
        console.warn('🚫 Accès refusé pour le rôle :', req.user?.role);
        return res.status(403).json({ message: 'Accès refusé : rôle insuffisant' });
      }
  
      next();
    };
  }
  
  module.exports = checkRole;
  