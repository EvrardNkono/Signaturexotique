import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';
import './Login.css'; 
import { FaEnvelope, FaLock } from 'react-icons/fa';

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
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

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
        login(data.token);
        setMessage(data.message);
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
        <h2>Connexion</h2>
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
      </div>
    </div>
  );
};

export default Login;
