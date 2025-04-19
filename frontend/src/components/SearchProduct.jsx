import React from 'react';
import { useSearch } from '../context/SearchContext';
import './SearchProduct.css';

const SearchProduct = () => {
  const { searchQuery, updateSearchQuery } = useSearch();

  const handleChange = (e) => {
    const value = e.target.value;
    updateSearchQuery(value.trim());
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // 🛑 Empêche le rechargement de la page
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder="Rechercher un produit..."
        className="search-input"
      />
      <button type="submit" className="search-button" aria-label="Rechercher">
        <i className="bi bi-search"></i>
      </button>
    </form>
  );
};

export default SearchProduct;
