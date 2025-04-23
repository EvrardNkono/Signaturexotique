import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Ici, on vérifie si l'utilisateur est authentifié, par exemple via un token ou une session
    const isAuthenticated = Boolean(localStorage.getItem('authToken')); // A remplacer par ton propre système

    if (!isAuthenticated) {
        // Si l'utilisateur n'est pas authentifié, on le redirige vers la page de login
        return <Navigate to="/login" replace />;
    }

    return children; // Sinon, on rend les enfants (la page protégée)
};

export default PrivateRoute;
