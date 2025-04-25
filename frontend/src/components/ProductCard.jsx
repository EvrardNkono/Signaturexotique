import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Card } from 'react-bootstrap';
import './ProductCard.css'

const ProductCard = ({ product, clientType }) => {
  const { addToCart, updateCartQuantity, cart } = useCart();
  const [flipped, setFlipped] = useState(false);

  const fullImagePath = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : '';

  const cartItem = cart.find(item => item.productId === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const priceToDisplay =
    clientType === 'wholesale' && product.wholesalePrice
      ? product.wholesalePrice
      : product.unitPrice;

  const unitLabel = product.unit || "unité";

  const handleAddToCart = () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      addToCart({ ...product, price: priceToDisplay, userId }, clientType);
    } else {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ ...product, price: priceToDisplay });
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  };

  const handleRemoveOne = () => {
    if (quantityInCart > 0 && cartItem) {
      updateCartQuantity(cartItem.id, quantityInCart - 1);
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
            <Card.Img
              src={fullImagePath}
              alt={`Image de ${product.name}`}
              className="product-card-image"
            />
          </div>
          <Card.Body className="product-card-body">
            <Card.Title className="product-card-title">{product.name}</Card.Title>

            <div className="product-card-price-rating">
              <span className="product-card-price">
                {priceToDisplay} € / {unitLabel}
              </span>
              <span className="product-card-rating">★★★★☆</span>
            </div>

            <div className="product-quantity">
              <button
                className={`quantity-button ${clientType}`}
                onClick={handleRemoveOne}
              >
                -
              </button>
              <span>{quantityInCart}</span>
              <button
                className={`quantity-button ${clientType}`}
                onClick={handleAddToCart}
              >
                +
              </button>
            </div>

            <button
              className="product-card-button"
              onClick={handleAddToCart}
              style={{
                backgroundColor: mainColor,
                borderColor: mainColor
              }}
            >
              Ajouter au panier
            </button>
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
              Description : {product.description || "Pas de description"}
            </Card.Text>
            <Card.Text className="product-card-description">
              Référence : {product.ref || "N/A"}
            </Card.Text>
            <Card.Text className="product-card-description">
              Disponibilité : {product.stock ? `${product.stock} en stock` : "Stock inconnu"}
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
    </div>
  );
};

export default ProductCard;
