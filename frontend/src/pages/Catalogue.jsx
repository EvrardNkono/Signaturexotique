import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Button, Alert } from 'react-bootstrap';
import { Typography } from '@mui/material';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';

const Catalogue = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { clientType, changeClientType, clearCart } = useCart();
  const [errorMessage, setErrorMessage] = useState('');

  const location = useLocation();
  const categoryFilter = new URLSearchParams(location.search).get('categorie');

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/routes/catalogue`);
      const data = await response.json();
      setAllProducts(data);
      setFilteredProducts(data);  // Par défaut on affiche tous les produits
    } catch (error) {
      console.error('Erreur chargement des produits:', error);
      setErrorMessage('Erreur lors du chargement des produits. Veuillez réessayer plus tard.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleClientTypeChange = () => {
    const confirmChange = window.confirm(
      'Vous ne pouvez pas passer une même commande en tant que grossiste et particulier une fois la sélection faite, vérifiez bien votre panier avant validation.'
    );

    if (confirmChange) {
      changeClientType(clientType === 'retail' ? 'wholesale' : 'retail');
      clearCart();
    }
  };

  return (
    <Container className="catalogue-container my-4 safe-container">
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Rye, sans-serif' }}>
        CATALOGUE DE PRODUITS
      </Typography>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <div className="mb-3 text-end">
        <Button
          variant={clientType === 'wholesale' ? 'success' : 'primary'}
          onClick={handleClientTypeChange}
        >
          Passer en mode {clientType === 'retail' ? 'GROSSISTE' : 'PARTICULIER'}
        </Button>
      </div>

      <Filters
        products={allProducts}
        onFilterChange={(filtered) => setFilteredProducts(filtered)}
        initialCategory={categoryFilter}
      />

      {filteredProducts.length === 0 ? (
        <Typography variant="h6" className="mt-4">
          AUCUN PRODUIT NE CORRESPOND À VOTRE RECHERCHE.
        </Typography>
      ) : (
        <ProductGrid initialProducts={filteredProducts} clientType={clientType} />
      )}
    </Container>
  );
};

export default Catalogue;
