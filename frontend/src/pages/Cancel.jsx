// src/pages/Cancel.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>❌ Paiement annulé</h1>
      <p>Le processus de paiement a été interrompu. Vous pouvez réessayer à tout moment.</p>
      <Link to="/cart">Retour au panier</Link>
    </div>
  );
};

export default Cancel;
