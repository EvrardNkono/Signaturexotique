import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useSearch } from '../context/SearchContext';
import ProductGrid from '../components/ProductGrid';
import Banner from '../components/Banner';
import ProductsSection from '../components/ProductsSection';
import CustomCarousel from '../components/CustomCarousel';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import { API_URL } from '../config';

const Home = ({ clientType }) => {
  const { searchQuery } = useSearch();
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fonction pour récupérer les produits filtrés par recherche (nom)
  const fetchFilteredProducts = async () => {
    const url = `${API_URL}/admin/search?nom=${searchQuery}`;
    console.log('📡 Appel API recherche :', url);
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('🔍 Produits filtrés par recherche :', data);
      setFilteredProducts(data);  // Mettre à jour les produits filtrés
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des produits filtrés :', error);
    }
  };

  // Appel des fonctions de récupération des produits
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      console.log('📢 Recherche active détectée');
      fetchFilteredProducts();
    } else {
      console.log('📢 Aucun filtre actif');
      setFilteredProducts([]);  // Remettre à zéro les produits filtrés si aucun filtre n'est actif
    }
  }, [searchQuery]);

  return (
    <div className="home-container">
      <Banner />

      {searchQuery.trim() !== '' && (
        <Container className="mt-4">
          <h2 className="text-center mb-4">Résultats pour « {searchQuery} »</h2>
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} clientType={clientType} />
          ) : (
            <p className="text-center">Aucun produit trouvé.</p>
          )}
        </Container>
      )}

      <Container className="mt-4">
        <ProductsSection />
        <CustomCarousel />
        <Services />
        <Testimonials />
      </Container>
    </div>
  );
};

export default Home;
