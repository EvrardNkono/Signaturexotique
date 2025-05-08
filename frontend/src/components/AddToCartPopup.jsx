import React, { useEffect, useState } from 'react';
import './AddToCartPopup.css';

const AddToCartPopup = ({ item }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (item) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [item]);

  if (!item || !visible) return null;

  return (
    <div className="add-to-cart-popup">
      <img src={item.image} alt={item.name} />
      <div className="popup-content">
        <div className="popup-title">{item.name}</div>
        <div className="popup-description">{item.price} €</div>
        <div className="popup-description">Ajouté au panier 🛒</div>
      </div>
    </div>
  );
};

export default AddToCartPopup;
