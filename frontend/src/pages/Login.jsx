import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';
import './Login.css';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      // Synchroniser le panier après la connexion
      syncCart();
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const syncCart = async () => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    if (cart) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Token manquant. Impossible de synchroniser le panier.');
          return;
        }
        
        const userId = JSON.parse(atob(token.split('.')[1])).id; // Extraire l'ID de l'utilisateur depuis le JWT
        if (!userId) {
          setError('Impossible de récupérer l\'ID utilisateur.');
          return;
        }

        // Envoi du panier au backend pour l'associer à l'utilisateur
        const response = await fetch(`${API_URL}/admin/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Utilisation du token dans les headers
          },
          body: JSON.stringify({ userId, cart }),
        });

        if (response.ok) {
          // Supprimer le panier du localStorage après l'envoi
          localStorage.removeItem('cart');
          console.log('Panier synchronisé avec succès !');
        } else {
          setError('Erreur lors de la synchronisation du panier.');
        }
      } catch (error) {
        setError('Erreur de connexion au backend pour la synchronisation du panier.');
        console.error('Erreur lors de la synchronisation du panier :', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, mot_de_passe: motDePasse }),
      });
      const data = await response.json();

      if (response.ok) {
        // Stockage du token dans le localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user.id);  // Stocke l'ID de l'utilisateur pour synchroniser le panier

        console.log(data.token);
        login(data.token);
        setMessage(data.message);
        window.location.reload();
        navigate(from, { replace: true });
      } else {
        setError(data.error || 'Une erreur inconnue est survenue.');
      }
    } catch (error) {
      setError('Erreur de connexion, veuillez réessayer.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="/assets/exotique.png" alt="Image de connexion" className="login-background-image" />
      </div>

      <div className="login-form">
      <h2 className="text-center mb-4 text-uppercase" style={{ fontFamily: 'Rye, sans-serif' }}>
 CONNEXION
</h2>

        {message && <p>{message}</p>}
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="icon-wrapper"><FaEnvelope /></div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              required
            />
          </div>
          <div className="input-group">
            <div className="icon-wrapper"><FaLock /></div>
            <input
              type="password"
              id="motDePasse"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>
          <button type="submit">Se connecter</button>
        </form>
        <p className="inscription-link">
  Vous n'avez pas de compte ?{' '}
  <Link to="/register" onClick={() => console.log("Redirection vers la page d'inscription")}>
    S'inscrire
  </Link>
</p>
      </div>
      

    </div>
  );
};

export default Login;
