import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import {
  Box,
  TextField,
  MenuItem,
  Slider,
  Typography,
  InputAdornment,
  Button,
  CircularProgress // Ajouté ici pour le spinner
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import debounce from 'lodash/debounce';

const Filters = ({ onFilterChange }) => {
  const [nom, setNom] = useState('');
  const [categorie, setCategorie] = useState('');
  const [prixValue, setPrixValue] = useState(100);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false); // Ajouté un état pour le chargement des produits

  // Récupération des catégories
  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch('http://localhost:5000/admin/category');
      const data = await response.json();
      console.log('Categories:', data); // Debug
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("La réponse de l'API n'est pas un tableau de catégories");
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Envoi des filtres
  const fetchFilteredProducts = async () => {
    setLoadingProducts(true); // Affiche le spinner
    const queryParams = new URLSearchParams({
      nom,
      categorie,
      prixMax: prixValue,
    }).toString();
    console.log('QueryParams:', queryParams); // Log des paramètres

    try {
      const response = await fetch(`http://localhost:5000/admin/product/filter?${queryParams}`);
      const data = await response.json();
      console.log('Filtered Products:', data); // Log des résultats
      onFilterChange(data);
    } catch (error) {
      console.error('Erreur lors du fetch des produits:', error);
    } finally {
      setLoadingProducts(false); // Masque le spinner une fois le fetch terminé
    }
  };

  // Appel initial
  useEffect(() => {
    fetchCategories();
  }, []);

  // Déclenchement filtré avec debounce
  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchFilteredProducts();
    }, 500);

    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [nom, categorie, prixValue]);

  const handleNomChange = (e) => {
    setNom(e.target.value);
  };

  const handleCategorieChange = (e) => {
    setCategorie(e.target.value);
  };

  const handlePrixChange = (e, newValue) => {
    setPrixValue(newValue);
  };

  const resetFilters = () => {
    setNom('');
    setCategorie('');
    setPrixValue(100);
  };

  return (
    <Box className="p-3 mb-4 border rounded shadow-sm bg-light">
      <Row className="align-items-center">
        {/* Filtre par nom */}
        <Col md={4} className="mb-3">
          <TextField
            fullWidth
            label="Rechercher un produit"
            variant="outlined"
            value={nom}
            onChange={handleNomChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Col>

        {/* Filtre par catégorie */}
        <Col md={4} className="mb-3">
          <TextField
            select
            fullWidth
            label="Catégorie"
            variant="outlined"
            value={categorie}
            onChange={handleCategorieChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CategoryIcon />
                </InputAdornment>
              ),
            }}
          >
            <MenuItem value="">Toutes les catégories</MenuItem>
            {loadingCategories ? (
              <MenuItem disabled>Chargement...</MenuItem>
            ) : (
              categories.map((cat, index) => (
                <MenuItem key={index} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))
            )}
          </TextField>
        </Col>

        {/* Slider pour le prix max */}
        <Col md={4} className="mb-3">
          <Typography gutterBottom>
            Prix maximum : {prixValue} €
          </Typography>
          <Slider
            value={prixValue}
            onChange={handlePrixChange}
            aria-labelledby="slider-prix"
            valueLabelDisplay="auto"
            step={5}
            min={0}
            max={200}
            color="primary"
          />
        </Col>
      </Row>

      <Row>
        <Col className="text-end">
          <Button variant="outlined" color="secondary" onClick={resetFilters}>
            Réinitialiser les filtres
          </Button>
        </Col>
      </Row>

      {/* Afficher le spinner de chargement des produits */}
      {loadingProducts && (
        <Row className="justify-content-center mt-4">
          <CircularProgress />
        </Row>
      )}
    </Box>
  );
};

export default Filters;
