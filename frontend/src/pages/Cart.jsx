import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Recommendations from '../components/Recommendations';
import './Cart.css';
import { API_URL } from '../config';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const formatWeight = (weight) => {
  if (!weight && weight !== 0) return 'Poids non spécifié';
  return weight >= 1000
    ? `${(weight / 1000).toFixed(2)} kg`
    : `${weight} g`;
};



const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCartFromBackend,
    clientType
  } = useCart();
  
  const navigate = useNavigate();
  const [lotDiscountsShown, setLotDiscountsShown] = useState([]);

  // 🔍 Log initial du panier complet
  console.log('Panier initial:', cart);

  const checkLotDiscount = (product) => {
    // Pas de réduction par lot pour les clients grossistes
    if (clientType === 'wholesale') return false;
  
    return product.lotQuantity && product.lotPrice && product.quantity >= product.lotQuantity;
  };
  
  

  const calculateTotalProductPrice = (product) => {
    console.log('🧮 Calcul du prix total pour:', product.name);
    console.log('Prix unitaire:', product.price);
    console.log('Quantité:', product.quantity);
    console.log('Lot quantité:', product.lotQuantity, 'Lot prix:', product.lotPrice);

    if (checkLotDiscount(product)) {
      const fullLots = Math.floor(product.quantity / product.lotQuantity);
      const remaining = product.quantity % product.lotQuantity;
      const lotPriceTotal = fullLots * product.lotPrice;
      const regularPriceTotal = remaining * product.price;
      const total = lotPriceTotal + regularPriceTotal;

      console.log(`✅ Lot appliqué: ${fullLots} lot(s), ${remaining} restant(s)`);
      console.log('💰 Prix total calculé avec lot:', total);
      return total;
    }

    const total = product.price * product.quantity;
    console.log('💰 Prix total sans lot:', total);
    return total;
  };

  const calculateSavings = (product) => {
    if (checkLotDiscount(product)) {
      const fullLots = Math.floor(product.quantity / product.lotQuantity);
      const normalPriceForLots = fullLots * product.lotQuantity * product.price;
      const lotPriceTotal = fullLots * product.lotPrice;
      const savings = normalPriceForLots - lotPriceTotal;

      console.log('💸 Économies réalisées:', savings);
      return savings;
    }
    return 0;
  };

  const notifyLotDiscount = (product) => {
    if (checkLotDiscount(product) && !lotDiscountsShown.includes(product.productId)) {
      toast.success(`🎉 Lot atteint pour "${product.name}" ! Prix réduit appliqué.`);
      setLotDiscountsShown((prev) => [...prev, product.productId]);
    }
  };

  const totalPrice = cart.reduce((total, product) => {
    const productTotal = calculateTotalProductPrice(product);
    console.log(`🔢 Sous-total pour ${product.name}:`, productTotal);
    return total + productTotal;
  }, 0);

  console.log('🧾 Total général du panier:', totalPrice);

  const changeQuantity = (productId, type) => {
    const product = cart.find((item) => item.productId === productId);
    if (!product) return;

    let newQuantity = product.quantity;
    if (type === 'increase') newQuantity += 1;
    else if (type === 'decrease') {
      if (newQuantity > 1) newQuantity -= 1;
      else {
        console.log('❌ Suppression du produit:', product.name);
        removeFromCart(productId);
        return;
      }
    }

    console.log(`🔄 Mise à jour de la quantité pour ${product.name}: ${newQuantity}`);
    updateCartQuantity(product.id, newQuantity);
  };

  const handleOrder = async () => {
  try {
    // Calculer le poids total du panier
    const totalWeight = cart.reduce((total, product) => {
      const productWeight = clientType === 'wholesale' ? product.wholesaleWeight : product.retailWeight;
      return total + (productWeight * product.quantity);
    }, 0);

    // Sauvegarder le poids total dans le localStorage
    localStorage.setItem('totalWeight', totalWeight);

    // Créer une session Stripe
    const response = await fetch(`${API_URL}/payement/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart }),
    });

    const data = await response.json();
    if (!data.sessionId) {
      alert("Erreur de création de session Stripe.");
      return;
    }

    // Rediriger vers Stripe Checkout
    const stripe = await stripePromise;
    const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });

    if (result.error) alert(result.error.message);
  } catch (error) {
    alert(`Erreur paiement : ${error.message}`);
  }
};


  useEffect(() => {
    cart.forEach(product => {
      console.log('🔁 Vérification du produit au rafraîchissement:', product);
    });
  }, []);

  return (
    <Container className="mt-5 cart-container">
      <h2 className="cart-title">Votre Panier</h2>
      {cart.length === 0 ? (
        <p className="cart-empty">Il n'y a aucun produit dans votre panier.</p>
      ) : (
        <>
          {cart.map((product) => {
            const hasLotDiscountApplied = product.lotQuantity && product.lotPrice && Math.floor(product.quantity / product.lotQuantity) > 0;
            const fullLots = hasLotDiscountApplied ? Math.floor(product.quantity / product.lotQuantity) : 0;
            const remaining = hasLotDiscountApplied ? product.quantity % product.lotQuantity : product.quantity;
            const totalProductPrice = calculateTotalProductPrice(product);

            console.log('🛒 Produit affiché:', product);

            return (
              <Card key={`${product.productId}-${product.quantity}`} className="mb-3 cart-card" style={{ border: '2px solid #ff6f00' }}>
                {checkLotDiscount(product) && (
                  <div className="lot-badge">
                    🎉 Vous avez économisé {calculateSavings(product).toFixed(2)} €
                  </div>
                )}
                <Row className="w-100">
                  <Col md={3} className="d-flex justify-content-center align-items-center">
                    <Card.Img
                      src={`${API_URL}/${product.image}`}
                      alt={product.name}
                      className="cart-image"
                    />
                  </Col>
                  <Col md={7}>
                    <Card.Body>
                      <Card.Title className="cart-card-title" style={{ color: '#ff6f00' }}>
                        {product.name}
                      </Card.Title>
                      <p>
  <strong>Prix appliqué:</strong>{' '}
  {clientType === 'wholesale'
    ? `${product.wholesalePrice.toFixed(2)} € x ${product.quantity}`
    : hasLotDiscountApplied
      ? `${fullLots} lot(s) de ${product.lotQuantity} à ${product.lotPrice.toFixed(2)} € + ${remaining} x ${product.price.toFixed(2)} €`
      : `${product.price.toFixed(2)} € x ${product.quantity}`
  }
  {hasLotDiscountApplied && clientType !== 'wholesale' && (
    <span className="text-success"> (Prix de lot appliqué)</span>
  )}
</p>


                      <div className="d-flex align-items-center">
                        <Button variant="outline-secondary" onClick={() => changeQuantity(product.productId, 'decrease')} style={{ marginRight: '10px' }}>-</Button>
                        <p><strong>Quantité:</strong> {product.quantity}</p>
                        <Button variant="outline-secondary" onClick={() => changeQuantity(product.productId, 'increase')} style={{ marginLeft: '10px' }}>+</Button>
                      </div>
                      <p><strong>Total :</strong> {totalProductPrice.toFixed(2)} €</p>
                     <p><strong>Poids total :</strong> {formatWeight((clientType === 'wholesale' ? product.wholesaleWeight : product.retailWeight) * product.quantity)}</p>


                    </Card.Body>
                  </Col>
                  <Col md={2} className="d-flex align-items-center justify-content-center">
                    <Button variant="danger" onClick={() => removeFromCart(product.productId)} style={{ backgroundColor: '#ff6f00', borderColor: '#ff6f00', color: 'white' }}>
                      Supprimer
                    </Button>
                  </Col>
                </Row>
              </Card>
            );
          })}

          <div className="mt-5">
            <Recommendations excludeProductIds={cart.map(p => p.productId)} />
          </div>

          <div className="cart-summary">
  <h4 className="cart-total">Total : {totalPrice.toFixed(2)} €</h4>
  <div className="cart-actions">
    <Button
  variant="outline-danger"
  className="btn-center"
  onClick={clearCartFromBackend}
>
  Vider le panier
</Button>

    <Button
  variant="outline-success"
  className="btn-center"
  onClick={() => {
    const totalWeight = cart.reduce((total, product) => {
      const productWeight = clientType === 'wholesale' ? product.wholesaleWeight : product.retailWeight;
      return total + (productWeight * product.quantity);
    }, 0);

    localStorage.setItem("cartTotal", totalPrice);
    localStorage.setItem("totalWeight", totalWeight);

    navigate("/delivery");
  }}
>
  Commander
</Button>



  </div>
</div>

        </>
      )}
    </Container>
  );
};

export default Cart;
/*<Button
variant="outline-success"
onClick={handleOrder}
>
Passer la commande
</Button>*/