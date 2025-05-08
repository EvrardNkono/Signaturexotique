import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import RecommendationsGrid from './RecommendationsGrid';

const Recommendations = () => {
  const { cart, clientType } = useCart(); // Récupérer le panier et le type de client
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // Fonction pour récupérer les produits recommandés
  const fetchRecommendations = async () => {
    try {
      const recommendedProductsResponse = await fetch(`/routes/recommendations?productIds=${cart.map(item => item.productId).join(',')}`);
      const data = await recommendedProductsResponse.json();
  
      const filteredRecommendations = data.filter(
        (product) => !cart.some((item) => item.productId === product.id)
      );
  
      // ✅ Récupérer les détails complets de chaque produit recommandé
      const enrichedRecommendations = await Promise.all(
        filteredRecommendations.map(async (product) => {
          const res = await fetch(`/api/products/${product.id}`);
          const fullProduct = await res.json();
          return fullProduct;
        })
      );
  
      const updatedRecommendations = enrichedRecommendations.map((product) => {
        const priceToUse =
          clientType === 'wholesale' && product.wholesalePrice
            ? product.wholesalePrice
            : product.unitPrice || product.price;
  
        if (!priceToUse) {
          console.error(`Le prix du produit ${product.name} est manquant !`);
        }
  
        return {
          ...product,
          price: priceToUse,
        };
      });
  
      setRecommendedProducts(updatedRecommendations);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits recommandés:', error);
    }
  };
  

  // Récupérer les recommandations lorsque le panier change
  useEffect(() => {
    if (cart.length > 0) {
      fetchRecommendations();
    }
  }, [cart]); // Recharger lorsque le panier change

  return (
    <div className="recommendations-wrapper mt-5">
      <h4 style={{ color: '#121212', fontSize: '28px' }}>
  PRODUITS RECOMMANDÉS POUR VOUS
</h4>

      <RecommendationsGrid products={recommendedProducts} />
    </div>
  );
};

export default Recommendations;
