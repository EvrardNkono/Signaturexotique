import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import './Profile.css'

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(prev => ({
            ...prev,
            name: data.name,
            email: data.email,
            phone: data.phone,
            address: data.address,
          }));
        } else {
          setMessage('Erreur de récupération des données.');
        }
      } catch (error) {
        console.error('Erreur de chargement du profil :', error);
        setMessage('Erreur de connexion au serveur.');
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      name, email, phone, address,
      currentPassword, newPassword, confirmPassword
    } = userData;

    if (!name || !email || !phone || !address) {
      return setMessage('Tous les champs sont requis.');
    }

    if (newPassword && newPassword !== confirmPassword) {
      return setMessage('Les nouveaux mots de passe ne correspondent pas.');
    }

    try {
      // Mise à jour des infos de profil
      const response = await fetch(`${API_URL}/auth/updateProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ name, email, phone, address }),
      });

      if (response.ok) {
        setMessage('Profil mis à jour avec succès');
      } else {
        setMessage('Erreur lors de la mise à jour du profil');
      }

      // Si on souhaite changer le mot de passe
      if (currentPassword && newPassword) {
        const passwordResponse = await fetch(`${API_URL}/auth/updatePassword`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ currentPassword, newPassword }),
        });

        if (passwordResponse.ok) {
          setMessage(prev => `${prev} / Mot de passe mis à jour avec succès`);
        } else {
          setMessage('Erreur lors de la mise à jour du mot de passe');
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      setMessage('Erreur de connexion au serveur.');
    }
  };

  return (
    <div className="profile-container">
      <h2>Mon Profil</h2>
      {message && <div className="message">{message}</div>}

      <form onSubmit={handleSubmit}>
        <label>
          Nom:
          <input type="text" name="name" value={userData.name} onChange={handleInputChange} />
        </label>

        <label>
          Email:
          <input type="email" name="email" value={userData.email} onChange={handleInputChange} disabled />
        </label>

        <label>
          Téléphone:
          <input type="text" name="phone" value={userData.phone} onChange={handleInputChange} />
        </label>

        <label>
          Adresse:
          <input type="text" name="address" value={userData.address} onChange={handleInputChange} />
        </label>

        <h3>Modifier le mot de passe</h3>

        <label>
          Mot de passe actuel:
          <input type="password" name="currentPassword" value={userData.currentPassword} onChange={handleInputChange} />
        </label>

        <label>
          Nouveau mot de passe:
          <input type="password" name="newPassword" value={userData.newPassword} onChange={handleInputChange} />
        </label>

        <label>
          Confirmer le nouveau mot de passe:
          <input type="password" name="confirmPassword" value={userData.confirmPassword} onChange={handleInputChange} />
        </label>

        <button type="submit">Sauvegarder</button>
      </form>
    </div>
  );
};

export default Profile;
