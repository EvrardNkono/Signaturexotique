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
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import debounce from 'lodash/debounce';
import { API_URL } from '../config';

const Filters = ({ onFilterChange }) => {
  const [nom, setNom] = useState('');
  const [categorie, setCategorie] = useState('');
  const [prixValue, setPrixValue] = useState(100);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await fetch(`${API_URL}/admin/category`);
      const data = await response.json();
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

  const fetchFilteredProducts = async () => {
    setLoadingProducts(true);
    const queryParams = new URLSearchParams({
      nom,
      categorie,
      prixMax: prixValue,
    }).toString();

    try {
      console.log(`${API_URL}/routes/catalogue/filter?${queryParams}`);

      const response = await fetch(`${API_URL}/routes/catalogue/filter?${queryParams}`); // ✅ route mise à jour
      const data = await response.json();
      onFilterChange(data);
    } catch (error) {
      console.error('Erreur lors du fetch des produits:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      fetchFilteredProducts();
    }, 500);

    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [nom, categorie, prixValue]);

  const handleNomChange = (e) => setNom(e.target.value);
  const handleCategorieChange = (e) => setCategorie(e.target.value);
  const handlePrixChange = (_, newValue) => setPrixValue(newValue);

  const resetFilters = () => {
    setNom('');
    setCategorie('');
    setPrixValue(100);
  };

  return (
    <Box className="p-3 mb-4 border rounded shadow-sm bg-light">
      <Row className="align-items-center">
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

      {loadingProducts && (
        <Row className="justify-content-center mt-4">
          <CircularProgress />
        </Row>
      )}
    </Box>
  );
};

export default Filters;
