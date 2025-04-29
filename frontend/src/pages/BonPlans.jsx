// src/pages/BonPlans.jsx
import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import ProductCard from '../components/ProductCard'; // Réutilisation de ta carte produit.
import './BonPlans'

const BonPlans = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/products/deals`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Erreur chargement des bons plans:', error));
  }, []);

  return (
    <div className="bonplans-container">
      <h1 className="title">Nos Bons Plans 🔥</h1>
      <div className="products-grid">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>Aucun bon plan pour le moment... mais ça arrive vite ! 😉</p>
        )}
      </div>
    </div>
  );
};

export default BonPlans;
