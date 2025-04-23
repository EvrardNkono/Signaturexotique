// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Créer un contexte pour l'authentification
const AuthContext = createContext();

// Créer un provider pour gérer l'état de la connexion
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Vérification de la présence du token dans localStorage au démarrage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
    }
  }, []);

  const login = (newToken) => {
    setIsAuthenticated(true);
    setToken(newToken);
    localStorage.setItem('token', newToken); // Stockage du token dans localStorage
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('token'); // Suppression du token de localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour accéder au contexte facilement
export const useAuth = () => useContext(AuthContext);
