// frontend/src/pages/AccessDenied.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './AccessDenied.css'; // si tu veux la styliser

const AccessDenied = () => {
  return (
    <div className="access-denied">
      <h1>🚫 Accès refusé</h1>
      <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
};

export default AccessDenied;
