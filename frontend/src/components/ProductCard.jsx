import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Card, Button, Badge } from 'react-bootstrap';
import './ProductCard.css';
import StarRating from './StarRating'; // Import du composant
import { API_URL } from '../config';

const ProductCard = ({ product, clientType }) => {
  const { addToCart, updateCartQuantity, removeFromCart, cart } = useCart();
  const [flipped, setFlipped] = useState(false);
  const [quantityInCart, setQuantityInCart] = useState(0);
  const [reductionLevel, setReductionLevel] = useState(0); // Niveau de réduction par lot
  const [fireworkTimeout, setFireworkTimeout] = useState(null); // Pour gérer la durée de l'animation

  const originalPrice = clientType === 'wholesale' && product.wholesalePrice
    ? product.wholesalePrice
    : product.unitPrice;

  const discountedPrice = product.reduction > 0
    ? originalPrice * (1 - product.reduction / 100)
    : originalPrice;

  const fullImagePath = product.image
    ? `${API_URL}/uploads/${product.image}`
    : '';

    useEffect(() => {
      const cartItem = cart.find(item => item.productId === product.id);
      const qty = cartItem ? cartItem.quantity : 0;
      setQuantityInCart(qty);
    
      if (product.lotQuantity && qty >= product.lotQuantity) {
        // Peu importe si c’est un multiple ou pas, tant que c’est supérieur ou égal
        setReductionLevel(Math.floor(qty / product.lotQuantity)); // Optionnel si tu veux un "niveau"
      } else {
        setReductionLevel(0);
      }
    }, [cart, product.id, product.lotQuantity]);
    
    

  const priceToDisplay =
    clientType === 'wholesale' && product.wholesalePrice
      ? product.wholesalePrice
      : product.unitPrice;

  const unitLabel = product.unit || 'unité';

  // Gère l'ajout au panier et le message de réduction
  const handleAddToCart = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      addToCart({ ...product, price: priceToDisplay, userId }, clientType);
    } else {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ ...product, price: priceToDisplay });
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Vérifie si la quantité ajoutée est un multiple du lot
    if (product.lotQuantity && quantityInCart > 0 && (quantityInCart + 1) % product.lotQuantity === 0) {
      setReductionLevel(prev => prev + 1); // Augmente le niveau de réduction
    }
  };

  const handleRemoveOne = () => {
    if (!cart || cart.length === 0) {
      console.error('Le panier est vide');
      return;
    }

    const cartItem = cart.find(item => item.productId === product.id);
    if (!cartItem) {
      console.error('Le produit n\'est pas dans le panier');
      return;
    }

    const newQuantity = cartItem.quantity - 1;

    if (newQuantity > 0) {
      updateCartQuantity(cartItem.id, newQuantity)
        .then(response => {
          if (response?.message === 'Quantité mise à jour avec succès') {
            setQuantityInCart(newQuantity);
          } else {
            console.error('Erreur lors de la mise à jour de la quantité');
          }
        })
        .catch(error => {
          console.error('Erreur dans la requête API :', error);
        });
    } else {
      removeFromCart(product.id);
      setQuantityInCart(0);
    }
  };

  const toggleFlip = () => {
    setFlipped(prev => !prev);
  };

  const cardBackgroundClass =
    clientType === 'wholesale' ? 'wholesale-background' : 'retail-background';

  const mainColor = clientType === 'wholesale' ? '#28a745' : '#ff6f00';

  return (
    <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
      <div className="flip-card-inner">

        {/* Face avant */}
        <div className={`flip-card-front product-card ${cardBackgroundClass}`}>
          <div className="product-card-image-container">
            <div className="product-image-background"></div>
            <Card.Img
              src={fullImagePath}
              alt={`Image de ${product.name}`}
              className="product-card-image"
            />
          </div>

          <Card.Body className="product-card-body">
            <Card.Title className="product-card-title">{product.name}</Card.Title>

            {/* Affichage du prix */}
            <div className="product-card-price">
              {product.reduction > 0 ? (
                <div className="price-discounted">
                  <div className="old-price">
                    {originalPrice.toFixed(2)} € / {unitLabel}
                  </div>
                  <div className="new-price">
                    {discountedPrice.toFixed(2)} € / {unitLabel}
                  </div>
                  <div className="reduction-badge">
                    -{product.reduction}% 🔥
                  </div>
                </div>
              ) : (
                <div className="product-price-display">
                  {originalPrice.toFixed(2)} € / {unitLabel}
                </div>
              )}
            </div>

            {/* Badge de rupture de stock */}
            {!product.inStock && (
  <div className="out-of-stock-banner">
    🚫 Rupture de stock<br />
  </div>
)}

            {/* Quantité et boutons */}
            <div className="product-quantity">
              <button
                className={`quantity-button ${clientType}`}
                onClick={handleRemoveOne}
                disabled={!product.inStock} // Désactive le bouton si en rupture de stock
              >
                -
              </button>
              <span>{quantityInCart}</span>
              <button
                className={`quantity-button ${clientType}`}
                onClick={handleAddToCart}
                disabled={!product.inStock} // Désactive le bouton si en rupture de stock
              >
                +
              </button>
            </div>

            {/* Bouton ajouter au panier */}
            <Button
  style={{
    backgroundColor: clientType === 'wholesale' ? '#28a745' : '#ff6f00', // Vert pour le grossiste, orange pour le détail
    borderColor: clientType === 'wholesale' ? '#28a745' : '#ff6f00'
  }}
  disabled={!product.inStock}
  onClick={handleAddToCart}
>
  {product.inStock ? 'Ajouter au panier' : 'Indisponible'}
</Button>


            <button
              className="product-card-button"
              style={{
                marginTop: '8px',
                backgroundColor: '#343a40',
                borderColor: '#343a40'
              }}
              onClick={toggleFlip}
            >
              Détail
            </button>
          </Card.Body>
        </div>

        {/* Face arrière */}
        <div className={`flip-card-back product-card ${cardBackgroundClass}`}>
          <Card.Body className="product-card-body">
            <Card.Title className="product-card-title">{product.name}</Card.Title>

            <Card.Text className="product-card-description">
              Description : {product.description || 'Pas de description'}
            </Card.Text>
            <Card.Text className="product-card-description">
              Référence : {product.ref || 'N/A'}
            </Card.Text>
            <Card.Text className="product-card-description">
              Disponibilité : {product.stock ? `${product.stock} en stock` : 'Stock inconnu'}
            </Card.Text>
            <Card.Text className="product-card-description">
              Unité : {unitLabel}
            </Card.Text>

            <button
              className="product-card-button"
              style={{
                backgroundColor: '#343a40',
                borderColor: '#343a40',
                marginTop: 'auto'
              }}
              onClick={toggleFlip}
            >
              Retour
            </button>
          </Card.Body>
        </div>
      </div>

      {/* Badge de réduction par lot */}
      {reductionLevel > 0 && (
        <div className="lot-discount-badge">
          Réduction par lot {reductionLevel} 🎉
        </div>
      )}
    </div>
  );
};

export default ProductCard;
