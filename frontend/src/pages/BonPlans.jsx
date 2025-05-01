import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import ProductCarousel from '../components/ProductCarousel';
import ClientRating2 from '../components/ClientRating2';

const BonPlans = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Ajout d'un état de chargement
  const [error, setError] = useState(null); // Ajout d'un état d'erreur

  useEffect(() => {
    // Fonction pour récupérer les produits avec gestion des erreurs
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/product`);
        
        // Vérifier si la réponse est correcte
        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`);
        }

        const data = await response.json();
        
        // Vérification de la structure des données avant d'appliquer le filtre
        if (Array.isArray(data)) {
          const discountedProducts = data.filter((product) => product.reduction > 0);
          setProducts(discountedProducts);
        } else {
          throw new Error('Les données retournées ne sont pas au format attendu.');
        }
      } catch (error) {
        setError(error.message); // Affichage du message d'erreur
        console.error('Erreur chargement des bons plans:', error);
      } finally {
        setLoading(false); // On arrête le chargement dès qu'on a la réponse
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Chargement des bons plans...</div>; // Message de chargement
  }

  if (error) {
    return <div>Erreur : {error}</div>; // Affichage de l'erreur
  }

  return (
    <div className="bonplans-container">
      <h1>Nos Bons Plans 🔥</h1>
      {products.length > 0 ? (
        <>
          <ProductCarousel products={products} title="Produits en Promotion" />
          <ClientRating2 />
        </>
      ) : (
        <p>Aucun bon plan pour le moment... mais restez connectés !</p>
      )}
    </div>
  );
};

export default BonPlans;
