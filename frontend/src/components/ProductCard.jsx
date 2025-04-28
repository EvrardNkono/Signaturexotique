import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Card } from 'react-bootstrap';
import './ProductCard.css';
import StarRating from './StarRating'; // Import du composant dynamique
import '../config'


const ProductCard = ({ product, clientType }) => {
  const { addToCart, updateCartQuantity, cart } = useCart();
  const [flipped, setFlipped] = useState(false);
  const [quantityInCart, setQuantityInCart] = useState(0);

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
  
    if (cartItem.quantity > 0) {
      const newQuantity = cartItem.quantity - 1;
  
      // Met à jour la quantité via l'API
      updateCartQuantity(cartItem.id, newQuantity)
        .then(response => {
          console.log('Réponse de l\'API après mise à jour :', response);  // Ajout d'un log pour voir la réponse complète
          if (response && response.message === 'Quantité mise à jour avec succès') {
            setCart(prevCart =>
              prevCart.map(item =>
                item.productId === cartItem.productId
                  ? { ...item, quantity: newQuantity }
                  : item
              )
            );
            console.log('Panier après mise à jour:', prevCart);
          } else {
            //console.error('Erreur lors de la mise à jour ou réponse invalide', response);
          }
        })
        .catch(error => {
          console.error('Erreur dans la requête API :', error);
        });
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
              <span className="product-price-display">
                {priceToDisplay} € / {unitLabel}
              </span>
            </div>

            {/* StarRating en dessous du prix */}
            <div className="product-card-rating">
              <StarRating defaultRating={product.rating || 4} />
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
