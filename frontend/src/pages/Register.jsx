import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaHome } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !name || !phone || !adresse) {
      setMessage('Tous les champs sont requis.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          mot_de_passe: password,
          nom: name,
          num_tel: phone,
          adresse
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Inscription réussie !');
        login(email, password);
        navigate('/');
      } else {
        setMessage(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error(error);
      setMessage('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-container">
      <h2 className="text-center mb-4 text-uppercase" style={{ fontFamily: 'Rye, sans-serif' }}>
  S'INSCRIRE
</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="icon-wrapper"><FaUser /></div>
            <input
              type="text"
              placeholder="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <div className="icon-wrapper"><FaEnvelope /></div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <div className="icon-wrapper"><FaLock /></div>
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <div className="icon-wrapper"><FaPhone /></div>
            <input
              type="tel"
              placeholder="Numéro de téléphone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <div className="icon-wrapper"><FaHome /></div>
            <input
              type="text"
              placeholder="Adresse"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>S'inscrire</button>
        </form>
        {message && (
          <p className={message.includes('Erreur') ? 'error' : 'success'}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
