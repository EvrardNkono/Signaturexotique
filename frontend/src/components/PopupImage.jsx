import React, { useEffect, useState } from 'react';
import { API_URL } from '../config'; // ou le bon chemin relatif
import './PopupImage.css';

const PopupImage = () => {
  const [popups, setPopups] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(0);

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const response = await fetch(`${API_URL}/popups`);
        const data = await response.json();
        setPopups(data);
      } catch (err) {
        console.error('Erreur lors du chargement des popups :', err);
      }
    };

    fetchPopups();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPopup((prev) => (prev + 1) % popups.length); // On boucle à travers les popups
    }, 10000); // Change de popup toutes les 10 secondes

    return () => clearInterval(interval); // Cleanup si besoin
  }, [popups]);

  if (popups.length === 0) return null;

  const popup = popups[currentPopup];

  return (
    <div className="popup-container">
      <div className="popup-content">
        <button className="popup-close" onClick={() => setPopups([])}>✕</button>
        <img src={`${API_URL}${popup.image_url}`} alt="Popup" />
        {popup.message && <p>{popup.message}</p>}
      </div>
    </div>
  );
};

export default PopupImage;
