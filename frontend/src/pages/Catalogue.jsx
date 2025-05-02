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
      const response = await fetch(`${API_URL}/admin/product`);
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Erreur chargement des produits:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      const filtered = allProducts.filter((product) => {
        return product?.categorie?.toLowerCase() === categoryFilter.toLowerCase();
      });
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts);
    }
  }, [categoryFilter, allProducts]);

  const handleClientTypeChange = () => {
    const confirmChange = window.confirm(
      'Vous ne pouvez pas passer une même commande en tant que grossiste et particulier une fois la sélection faite, vérifiez bien votre panier avant validation.'
    );

    if (confirmChange) {
      changeClientType(clientType === 'retail' ? 'wholesale' : 'retail');
      clearCart();
    }
  };

  const productsToDisplay = filteredProducts.length > 0 ? filteredProducts : allProducts;

  return (
    <Container className="my-5">
      <Typography variant="h4" gutterBottom>
        CATALOGUE DE PRODUITS
      </Typography>

      {errorMessage && (
        <Alert variant="danger">
          {errorMessage}
        </Alert>
      )}

      <div className="mb-3 text-end">
        <Button
          variant={clientType === 'retail' ? 'outline-success' : 'outline-warning'}
          onClick={handleClientTypeChange}
        >
          Passer en mode {clientType === 'retail' ? 'GROSSISTE' : 'PARTICULIER'}
        </Button>
      </div>

      <Filters onFilterChange={(filtered) => setFilteredProducts(filtered)} />

      {filteredProducts.length === 0 ? (
        <Typography variant="h6" className="mt-4">
          AUCUN PRODUIT NE CORRESPOND À VOTRE RECHERCHE.
        </Typography>
      ) : (
        <ProductGrid products={productsToDisplay} clientType={clientType} />
      )}
    </Container>
  );
};

export default Catalogue;
