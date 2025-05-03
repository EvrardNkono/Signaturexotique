import { useEffect, useState } from 'react';
import { API_URL } from '../config';

const useRecommendations = (cartItems) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      setRecommendations([]);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const productIds = cartItems.map(item => item.productId).join(',');
        const response = await fetch(`${API_URL}/recommendations?product_ids=${productIds}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des recommandations");
        const data = await response.json();
        setRecommendations(data);
      } catch (err) {
        console.error("Erreur dans useRecommendations:", err);
        setRecommendations([]);
      }
    };

    fetchRecommendations();
  }, [cartItems]);

  return recommendations;
};

export default useRecommendations;
