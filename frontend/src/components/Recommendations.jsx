// components/Recommendations.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import RecommendationsGrid from './RecommendationsGrid';

const Recommendations = () => {
  const { cart } = useCart();

  // Évite les doublons de recommandations pour le même produit
  const uniqueProductIds = [...new Set(cart.map((item) => item.productId))];

  return (
    <div className="recommendations-wrapper mt-5">
      <h4 style={{ color: '#ff6f00' }}>PRODUITS RECOMMANDÉS POUR VOUS</h4>
      {uniqueProductIds.map((productId) => (
        <div key={productId} className="mb-4">
          <RecommendationsGrid productId={productId} />
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
