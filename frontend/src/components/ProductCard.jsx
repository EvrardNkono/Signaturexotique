import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Card } from 'react-bootstrap';
import './ProductCard.css';
import StarRating from './StarRating'; // Import du composant 
import { API_URL } from '../config';

const ProductCard = ({ product, clientType }) => {
  const { addToCart, updateCartQuantity, removeFromCart, cart } = useCart();
  const [flipped, setFlipped] = useState(false);
  const [quantityInCart, setQuantityInCart] = useState(0);
  const originalPrice = clientType === 'wholesale' && product.wholesalePrice
  ? product.wholesalePrice
  : product.unitPrice;

const discountedPrice = product.reduction > 0
  ? originalPrice * (1 - product.reduction / 100)
  : originalPrice;


  const fullImagePath = product.image
    ? `${API_URL}/uploads/${product.image}`
    : '';

  // Utilisation d'un useEffect pour mettre à jour la quantité dans le panier
  useEffect(() => {
    const cartItem = cart.find(item => item.productId === product.id);
    setQuantityInCart(cartItem ? cartItem.quantity : 0);
  }, [cart, product.id]); // Se déclenche lorsque 'cart' ou 'product.id' change

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
    if (!cart || cart.length === 0) {
      console.error('Le panier est vide');
      return;
    }
  
    const cartItem = cart.find(item => item.productId === product.id);
    if (!cartItem) {
      console.error('Le produit n\'est pas dans le panier');
      return;
    }
  
    const newQuantity = cartItem.quantity - 1;  // Décrémente la quantité
  
    if (newQuantity > 0) {
      // Si la nouvelle quantité est positive, on met à jour la quantité dans le panier
      updateCartQuantity(cartItem.id, newQuantity)
        .then(response => {
          console.log('Réponse de l\'API après mise à jour :', response);
          if (response && response.message === 'Quantité mise à jour avec succès') {
            setQuantityInCart(newQuantity); // Met à jour la quantité localement
          } else {
            console.error('Erreur lors de la mise à jour de la quantité');
          }
        })
        .catch(error => {
          console.error('Erreur dans la requête API :', error);
        });
    } else {
      // Si la quantité est zéro, on supprime l'article du panier
      removeFromCart(product.id);  // Supprimer du panier
      setQuantityInCart(0); // Mettre la quantité à zéro
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

            {/* Prix au-dessus du StarRating */}
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




            {/* StarRating en dessous du prix */}
           {/*<div className="product-card-rating">
              <StarRating defaultRating={product.rating || 4} />
            </div>*/}

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
