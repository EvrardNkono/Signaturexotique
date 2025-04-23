// src/context/AuthContext.js
import React, { createContext, useState, useContext } from 'react';

// Créer un contexte pour l'authentification
const AuthContext = createContext();

// Créer un provider pour gérer l'état de la connexion
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pour accéder au contexte facilement
export const useAuth = () => useContext(AuthContext);
