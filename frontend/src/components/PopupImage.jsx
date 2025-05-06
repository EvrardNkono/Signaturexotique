import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import './PopupImage.css';

const PopupImage = () => {
  const [popups, setPopups] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(0);
  const [showPopup, setShowPopup] = useState(true);

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
    if (popups.length === 0) return;

    const interval = setInterval(() => {
      setCurrentPopup((prev) => (prev + 1) % popups.length);
    }, 10000); // Changement toutes les 10 sec

    return () => clearInterval(interval);
  }, [popups]);

  const handleClose = () => {
    setShowPopup(false);
    setTimeout(() => {
      setShowPopup(true);
    }, 100000); // Réaffiche après un moment
  };

  if (popups.length === 0 || !showPopup) return null;

  const popup = popups[currentPopup];

  return (
    <div className="popup-container">
      <div className="popup-content">
        <button className="popup-close" onClick={handleClose}>✕</button>
        <img src={`${API_URL}${popup.image_url}`} alt="Popup" />

        {popup.title && <h3 className="popup-title">{popup.title}</h3>}
        {popup.message && <p className="popup-message">{popup.message}</p>}
      </div>
    </div>
  );
};

export default PopupImage;
