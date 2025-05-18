import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Card, Button, Badge } from 'react-bootstrap';
import './ProductCard.css';
import { API_URL } from '../config';

const ProductCard = ({ product, clientType }) => {
  const { addToCart, updateCartQuantity, removeFromCart, cart } = useCart();
  const [flipped, setFlipped] = useState(false);
  const [quantityInCart, setQuantityInCart] = useState(0);
  const [reductionLevel, setReductionLevel] = useState(0); // Niveau de réduction par lot

  // Calcul du prix en fonction du poids
  const pricePerWeight =
    clientType === 'wholesale' && product.wholesaleWeight
      ? product.wholesalePrice / product.wholesaleWeight // Prix par poids pour le grossiste
      : product.unitPrice / product.retailWeight; // Prix par poids pour le particulier

  const priceToDisplay =
    clientType === 'wholesale' && product.wholesalePrice
      ? product.wholesalePrice
      : product.unitPrice;

  const discountedPrice = product.reduction > 0
    ? priceToDisplay * (1 - product.reduction / 100)
    : priceToDisplay;
  console.log("Nom de l'image depuis product.image :", product.image); // <-- ici !
  const fullImagePath = product.image
    ? `${API_URL}/${product.image}`
    : '';

  useEffect(() => {
    const cartItem = cart.find(item => item.productId === product.id);
    const qty = cartItem ? cartItem.quantity : 0;
    setQuantityInCart(qty);

    if (product.lotQuantity && qty >= product.lotQuantity) {
      setReductionLevel(Math.floor(qty / product.lotQuantity));
    } else {
      setReductionLevel(0);
    }
  }, [cart, product.id, product.lotQuantity]);

  const [loading, setLoading] = useState(false);

const handleAddToCart = async () => {
  if (loading) return; // Empêche les clics multiples rapides

  setLoading(true); // Active le verrou

  const userId = localStorage.getItem('userId');

  if (userId) {
    try {
      await addToCart({ ...product, price: priceToDisplay, userId }, clientType);
    } catch (error) {
      console.error('Erreur lors de l’ajout au panier :', error);
    }
  } else {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ ...product, price: priceToDisplay });
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Réduction si seuil atteint
  if (product.lotQuantity && quantityInCart > 0 && (quantityInCart + 1) % product.lotQuantity === 0) {
    setReductionLevel(prev => prev + 1);
  }

  // Dispatch l’event pour les autres composants (ex: popup, animation…)
  window.dispatchEvent(
    new CustomEvent('itemAdded', {
      detail: {
        ...product,
        price: priceToDisplay,
        image: fullImagePath,
        quantity: 3
      }
    })
  );

  setLoading(false); // Déverrouille l’action
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

    const formatWeight = (weight) => {
  const numericWeight = parseFloat(weight);
  if (isNaN(numericWeight)) return weight; // Si c'est pas un nombre, on l'affiche tel quel
  return numericWeight >= 1000
    ? `${(numericWeight / 1000).toFixed(2)} kg`
    : `${numericWeight} g`;
};

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
        {priceToDisplay.toFixed(2)} € / {formatWeight(clientType === 'wholesale' ? product.wholesaleWeight : product.retailWeight)}
      </div>
      <div className="new-price">
        {discountedPrice.toFixed(2)} € / {formatWeight(clientType === 'wholesale' ? product.wholesaleWeight : product.retailWeight)}
      </div>
      <div className="reduction-badge">
        -{product.reduction}% 🔥
      </div>
    </div>
  ) : (
    <div className="product-price-display">
      {priceToDisplay.toFixed(2)} € / {formatWeight(clientType === 'wholesale' ? product.wholesaleWeight : product.retailWeight)}
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
    backgroundColor: clientType === 'wholesale' ? '#28a745' : '#ff6f00',
    borderColor: clientType === 'wholesale' ? '#28a745' : '#ff6f00',
    opacity: !product.inStock || loading ? 0.6 : 1, // petit effet visuel de désactivation
    cursor: !product.inStock || loading ? 'not-allowed' : 'pointer',
  }}
  disabled={!product.inStock || loading}
  onClick={handleAddToCart}
>
  {!product.inStock
    ? 'Indisponible'
    : loading
    ? 'Ajout en cours...'
    : 'Ajouter au panier'}
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
      Disponibilité : {product.stock ? `${product.stock} en stock` : 'Stock inconnu'}
    </Card.Text>

    {/* Affichage du poids */}
   <Card.Text className="product-card-description">
  Poids ({clientType === 'wholesale' ? 'grossiste' : 'particulier'}) :{' '}
  {clientType === 'wholesale'
    ? formatWeight(product.wholesaleWeight)
    : formatWeight(product.retailWeight)}
</Card.Text>

    {/* Affichage des détails supplémentaires du produit */}
    <Card.Text className="product-card-description">
      Détails : {product.details || 'Aucun détail supplémentaire'}
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
