import React, { useEffect, useState } from 'react';
import { API_URL } from '../config'; // ou le bon chemin relatif
import './PopupImage.css';

const PopupImage = () => {
  const [popupData, setPopupData] = useState(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const response = await fetch(`${API_URL}/popup`);
        const data = await response.json();
        setPopupData(data);
      } catch (err) {
        console.error('Erreur lors du chargement du popup :', err);
      }
    };

    fetchPopup();

    const timerLoop = setInterval(() => {
      setVisible(true);
    }, 60000); // réapparaît toutes les 60s

    return () => clearInterval(timerLoop);
  }, []);

  useEffect(() => {
    if (visible) {
      const hide = setTimeout(() => {
        setVisible(false);
      }, 30000); // reste affiché 30s
      return () => clearTimeout(hide);
    }
  }, [visible]);

  if (!popupData || !popupData.image_url || !visible) return null;

  
  console.log("popupData :", popupData);

  return (
    <div className="popup-container">
      <div className="popup-content">
        <button className="popup-close" onClick={() => setVisible(false)}>✕</button>
        <img src={`${API_URL}${popupData.image_url}`} alt="Popup" />
        {popupData.message && <p>{popupData.message}</p>}
      </div>
    </div>
  );
};

export default PopupImage;
