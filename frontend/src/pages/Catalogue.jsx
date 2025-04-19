import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Importation pour récupérer les paramètres de l'URL
import { Container, Button, Alert } from 'react-bootstrap';
import { Typography } from '@mui/material';
import ProductGrid from '../components/ProductGrid';
import Filters from '../components/Filters';
import { useCart } from '../context/CartContext'; // Utilisation du contexte

const Catalogue = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { clientType, changeClientType, clearCart } = useCart();
  const [errorMessage, setErrorMessage] = useState('');

  const location = useLocation();
  const categoryFilter = new URLSearchParams(location.search).get('categorie'); // Récupération de la catégorie de l'URL

  // Fonction pour charger les produits
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/admin/product');
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Erreur chargement des produits:', error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Charger les produits au démarrage
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      const filtered = allProducts.filter((product) => {
        // Vérification que la catégorie existe et est une chaîne valide
        return product?.categorie?.toLowerCase() === categoryFilter.toLowerCase();
      });
      setFilteredProducts(filtered); // Mettre à jour les produits filtrés
    } else {
      setFilteredProducts(allProducts); // Afficher tous les produits si aucune catégorie
    }
  }, [categoryFilter, allProducts]); // Refaire ce calcul si la catégorie ou les produits changent

  const handleClientTypeChange = () => {
    const confirmChange = window.confirm(
      'Vous ne pouvez pas passer une même commande en tant que grossiste et particulier une fois la sélection faite, vérifiez bien votre panier avant validation.'
    );

    if (confirmChange) {
      changeClientType(clientType === 'retail' ? 'wholesale' : 'retail');
      clearCart(); // Vider le panier après avoir changé de type
    }
  };

  const productsToDisplay = filteredProducts.length > 0 ? filteredProducts : allProducts;

  return (
    <Container className="my-5">
      <Typography variant="h4" gutterBottom>
        Catalogue de Produits
      </Typography>

      {/* Message d'erreur */}
      {errorMessage && (
        <Alert variant="danger">
          {errorMessage}
        </Alert>
      )}

      {/* 🔁 Bouton de bascule */}
      <div className="mb-3 text-end">
        <Button
          variant={clientType === 'retail' ? 'outline-success' : 'outline-warning'}
          onClick={handleClientTypeChange}
        >
          Passer en mode {clientType === 'retail' ? 'Grossiste' : 'Particulier'}
        </Button>
      </div>

      {/* Filtres */}
      <Filters onFilterChange={(filtered) => setFilteredProducts(filtered)} />

      {/* Affichage des produits */}
      {filteredProducts.length === 0 ? (
        <Typography variant="h6" className="mt-4">
          Aucun produit ne correspond à votre recherche.
        </Typography>
      ) : (
        <ProductGrid products={productsToDisplay} clientType={clientType} />
      )}
    </Container>
  );
};

export default Catalogue;
