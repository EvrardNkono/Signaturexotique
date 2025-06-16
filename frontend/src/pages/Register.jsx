import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaHome, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Register.css';

const Register = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    adresse: '',
    acceptOffers: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const { email, password, confirmPassword, name, phone, adresse, acceptOffers } = form;

  if (!email || !password || !confirmPassword || !name || !phone || !adresse) {
    setMessage('Tous les champs sont requis.');
    return;
  }

  if (password.length < 6) {
    setMessage('Le mot de passe doit contenir au moins 6 caractères.');
    return;
  }

  if (password !== confirmPassword) {
    setMessage('Les mots de passe ne correspondent pas.');
    return;
  }

  setLoading(true);
  setMessage('');

  try {
    // 1. Création du compte utilisateur
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        mot_de_passe: password,
        nom: name,
        num_tel: phone,
        adresse,
        acceptOffers,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Inscription réussie ! Un email de vérification vous a été envoyé.');

      // 2. Envoi du mail de vérification email
      await fetch(`${API_URL}/verify-email/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      // 3. Tu peux choisir d'attendre la validation avant login,
      //    ou connecter directement comme tu fais
      await login(email, password);

      navigate('/'); // ou page "Merci, vérifiez votre mail !"
    } else {
      setMessage(data.message || data.error || "Erreur lors de l'inscription.");

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
            <input type="text" name="name" placeholder="Nom" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <div className="icon-wrapper"><FaEnvelope /></div>
            <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group password-group">
            <div className="icon-wrapper"><FaLock /></div>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Mot de passe"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} className="toggle-password">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="input-group">
            <div className="icon-wrapper"><FaLock /></div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <div className="icon-wrapper"><FaPhone /></div>
            <input type="tel" name="phone" placeholder="Numéro de téléphone" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <div className="icon-wrapper"><FaHome /></div>
            <input type="text" name="adresse" placeholder="Adresse" value={form.adresse} onChange={handleChange} required />
          </div>

          <div className="checkbox-group">
            <input type="checkbox" id="offers" name="acceptOffers" checked={form.acceptOffers} onChange={handleChange} />
            <label htmlFor="offers">
              Je souhaite recevoir les bons plans, réductions et offres exclusives adaptées à mes achats.
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Chargement...' : "S'inscrire"}
          </button>
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
