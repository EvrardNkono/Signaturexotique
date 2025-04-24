import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    // Ici, on vérifie si l'utilisateur est authentifié via un token dans le localStorage
    const isAuthenticated = Boolean(localStorage.getItem('authToken'));
    const userRole = localStorage.getItem('userRole'); // On récupère le rôle de l'utilisateur (ajoute-le lors de la connexion)

    if (!isAuthenticated) {
        // Si l'utilisateur n'est pas authentifié, on le redirige vers la page de login
        return <Navigate to="/login" replace />;
    }

    // Vérification du rôle
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        // Si le rôle de l'utilisateur n'est pas dans les rôles autorisés, redirection vers une page d'accès interdit ou autre
        return <Navigate to="/access-denied" replace />;
    }

    return children; // Sinon, on rend les enfants (la page protégée)
};

export default PrivateRoute;
