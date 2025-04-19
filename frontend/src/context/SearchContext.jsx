// src/context/SearchContext.js
import React, { createContext, useState, useContext } from 'react';

// Créer le contexte
const SearchContext = createContext();

// Créer le fournisseur (Provider)
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fonction pour mettre à jour la requête de recherche
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, updateSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useSearch = () => {
  return useContext(SearchContext);
};
