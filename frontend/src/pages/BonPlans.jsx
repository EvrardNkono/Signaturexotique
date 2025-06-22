import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import ProductCarousel from '../components/ProductCarousel';
import ClientRating2 from '../components/ClientRating2';

const BonPlans = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/product`);
        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const discountedProducts = data.filter((product) => product.reduction > 0);
          setProducts(discountedProducts);
        } else {
          throw new Error('Les données retournées ne sont pas au format attendu.');
        }
      } catch (error) {
        setError(error.message);
        console.error('Erreur chargement des bons plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>CHARGEMENT DES BONS PLANS...</div>;
  }

  if (error) {
    return <div style={{ padding: "2rem", color: "red", textAlign: "center" }}>ERREUR : {error}</div>;
  }

  return (
    <div className="bonplans-container" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '2rem' }}>NOS BONS PLANS 🔥</h1>
      
      {products.length > 0 ? (
        <>
          <ProductCarousel products={products} title="PRODUITS EN PROMOTION" />
          <div style={{ marginTop: '3rem' }}>
            <ClientRating2 />
          </div>
        </>
      ) : (
        <p>AUCUN BON PLAN POUR LE MOMENT... MAIS RESTEZ CONNECTÉS !</p>
      )}
    </div>
  );
};

export default BonPlans;
