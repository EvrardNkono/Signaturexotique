import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Card, Button, Badge } from 'react-bootstrap';
import './ProductCard.css';
import { API_URL } from '../config';
import { Pencil, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Chemin à ajuster si nécessaire




const ProductCard = ({ product, clientType, onUpdate }) => {
  const { addToCart, updateCartQuantity, removeFromCart, cart } = useCart();
  const [flipped, setFlipped] = useState(false);
  const [quantityInCart, setQuantityInCart] = useState(0);
  const [reductionLevel, setReductionLevel] = useState(0); // Niveau de réduction par lot
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(product.name);
  const { user } = useAuth();


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
  updateCartQuantity(cartItem.id, newQuantity, cartItem.productId)
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
}
 else {
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

const backgroundImagePath =
  clientType === 'wholesale'
    ? 'assets/back1.jpg'
    : 'assets/back.jpg';


    {/*Edition de nom de produits */}

    const handleNameUpdate = async () => {
  try {
    const token = localStorage.getItem('token'); // Récupère le token d'authentification

    // On envoie tous les champs obligatoires + optionnels pour satisfaire la route PUT
    const bodyData = {
      name: editedName,
      category: product.category,
      unitPrice: product.unitPrice,
      wholesalePrice: product.wholesalePrice,
      reduction: product.reduction,
      lotQuantity: product.lotQuantity,
      lotPrice: product.lotPrice,
      inStock: product.inStock,
      retailWeight: product.retailWeight,
      wholesaleWeight: product.wholesaleWeight,
      details: product.details,
    };

    const response = await fetch(`${API_URL}/admin/product/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Important pour authentification
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur lors de la mise à jour : ${errorText}`);
    }

    const updatedProduct = await response.json();

    // Appelle la callback pour mettre à jour dans le parent
    onUpdate(updatedProduct.product);

    setIsEditingName(false);
  } catch (error) {
    console.error('Erreur de mise à jour:', error);
  }
};

useEffect(() => {
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (file) {
          handleImageUpdate(file);
        }
      }
    }
  };

  window.addEventListener('paste', handlePaste);
  return () => {
    window.removeEventListener('paste', handlePaste);
  };
}, []);



const handleImageUpdate = async (file) => {
  if (!file) return;

  const formData = new FormData();
  formData.append('image', file);

  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${API_URL}/admin/product/${product.id}/image`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Erreur lors de la mise à jour');

    const data = await response.json();

    // Actualise l’image du produit côté UI
    onUpdate({ ...product, imageURL: data.product.imageURL });
  } catch (err) {
    console.error('Erreur de mise à jour de l’image :', err);
  }
};


 return (
  <div className="scoped-reset-card">
    <div className="product-card-wrapper"> {/* 👈 WRAPPER AJOUTÉ ICI */}

      <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
        <div className="flip-card-inner">

          {/* ----- FACE AVANT DE LA CARTE ----- */}
          <div className={`flip-card-front product-card ${cardBackgroundClass}`}>

            {/* Crazy Frame SVG */}
            <svg className="crazy-frame" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <clipPath id="crazyClip">
                  <path d="M60,100 Q80,130 60,160 Q40,190 70,210 Q100,230 80,260 Q60,290 110,300 Q160,310 150,270 Q140,230 190,240 Q240,250 230,200 Q220,150 260,140 Q300,130 260,100 Q220,70 240,40 Q260,10 200,20 Q140,30 150,60 Q160,90 120,80 Q80,70 60,100 Z" />
                </clipPath>
              </defs>
              <image
                href={backgroundImagePath}
                width="300"
                height="400"
                clipPath="url(#crazyClip)"
                preserveAspectRatio="xMidYMid slice"
              />
            </svg>

            {/* Contenu de la face avant */}
            <div className={`decorative-container ${clientType}`}>
              <div className="wave-mask"></div>
            </div>

            <div className="red-extension"></div>

            <div className="product-image-circle">
  <Card.Img
    src={fullImagePath}
    alt={`Image de ${product.name}`}
    className="product-card-image"
  />

  {(user?.role === 'admin' || user?.role === 'superadmin') && (
    <>
      <label htmlFor={`edit-image-${product.id}`} className="edit-image-btn">
        🖊️
      </label>
      <input
        id={`edit-image-${product.id}`}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => handleImageUpdate(e.target.files[0])}
      />
    </>
  )}
</div>


            <div className="title-wrapper">
              <div className="title-shadow"></div>
              <div className="product-title2">
  {isEditingName ? (
    <div className="product-title edit-mode">
      <input
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
        className="edit-input"
      />
      <Check size={18} onClick={handleNameUpdate} className="icon validate" />
      <X
        size={18}
        onClick={() => {
          setEditedName(product.name);
          setIsEditingName(false);
        }}
        className="icon cancel"
      />
    </div>
  ) : (
    <div className="product-title">
      {product.name}
      {user?.role === 'superadmin' && (
  <Pencil
    size={16}
    className="icon edit"
    onClick={() => setIsEditingName(true)}
  />
)}

    </div>
  )}
</div>


              <div className="product-price2">
                {product.reduction > 0 ? (
                  <div className="product-price">
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
                  </div>
                ) : (
                  <div className="product-price">
                    {priceToDisplay.toFixed(2)} € / {formatWeight(clientType === 'wholesale' ? product.wholesaleWeight : product.retailWeight)}
                  </div>
                )}
              </div>
            </div>

            {!product.inStock && (
              <div className="out-of-stock-banner">
                🚫 Rupture de stock<br />
              </div>
            )}

            <div className="product-quantity">
              <button
                className={`quantity-button ${clientType}`}
                onClick={handleRemoveOne}
                disabled={!product.inStock}
              >
                -
              </button>
              <span className="badge">{quantityInCart}</span>
              <button
                className={`quantity-button ${clientType}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                +
              </button>
            </div>

            <div className="product-buttons-wrapper">
              <div className="product-button2">
                <button
                  className="product-button"
                  style={{
                    backgroundColor: clientType === 'wholesale' ? '#28a745' : '#ff6f00',
                    borderColor: clientType === 'wholesale' ? '#28a745' : '#ff6f00',
                    opacity: !product.inStock || loading ? 0.6 : 1,
                    cursor: !product.inStock || loading ? 'not-allowed' : 'pointer',
                  }}
                  disabled={!product.inStock || loading}
                  onClick={handleAddToCart}
                >
                  <span className="cart-circle">🛒</span>
                  <span className="add-to-cart-text">
                    {!product.inStock
                      ? 'Indisponible'
                      : loading
                      ? 'Ajout en cours...'
                      : 'Ajouter au panier'}
                  </span>
                </button>
              </div>

              <div className="detail-button">
                <button className="detail-btn" onClick={toggleFlip}>Détails</button>
              </div>
            </div>
          </div>

          {/* ----- FACE ARRIÈRE ----- */}
          <div className="flip-card-back">
            <div className="product-card-title">{product.name}</div>
            <div className="product-card-description">
              Disponibilité : {product.stock ? `${product.stock} en stock` : 'Stock inconnu'}
            </div>
            <div className="product-card-description">
              Poids ({clientType === 'wholesale' ? 'grossiste' : 'particulier'}) :
              {clientType === 'wholesale' ? formatWeight(product.wholesaleWeight) : formatWeight(product.retailWeight)}
            </div>
            <div className="product-card-description">
              Détails : {product.details || 'Aucun détail supplémentaire'}
            </div>
            <button
              className="product-card-button"
              style={{ backgroundColor: '#343a40', borderColor: '#343a40', marginTop: 'auto' }}
              onClick={toggleFlip}
            >
              Retour
            </button>
          </div>

        </div>

        {reductionLevel > 0 && (
          <div className="lot-discount-badge">
            Réduction par lot {reductionLevel} 🎉
          </div>
        )}
      </div>

    </div> {/* 👈 FIN DU WRAPPER */}
  </div>
);

};

export default ProductCard;
