import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Recommendations from '../components/Recommendations'; // Importation de Recommendations
import './Cart.css';
import { API_URL } from '../config';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity, // Ajout de la fonction updateCartQuantity
    clearCartFromBackend,
    clientType
  } = useCart();

  const navigate = useNavigate();

  // Calcul du prix total basé sur le type de client
  const totalPrice = cart.reduce((total, product) => {
    const price = product.price;
    return total + price * product.quantity;
  }, 0);

  // Récupérer les IDs des produits déjà dans le panier
  const productIdsInCart = cart.map(product => product.productId);

  // Fonction de mise à jour de la quantité (augmenter ou diminuer)
  const changeQuantity = (productId, type) => {
    const product = cart.find(item => item.productId === productId);
    if (!product) return;
  
    let newQuantity = product.quantity;
  
    if (type === 'increase') {
      newQuantity += 1;
    } else if (type === 'decrease') {
      if (newQuantity > 1) {
        newQuantity -= 1;
      } else if (newQuantity === 1) {
        // Si la quantité atteint 1, on appelle removeFromCart pour le retirer du panier
        removeFromCart(productId); 
        return; // Arrêter l'exécution ici pour éviter de réduire la quantité à 0
      }
    }
  
    // Appel à updateCartQuantity uniquement si la quantité est supérieure à 0
    if (newQuantity > 0) {
      updateCartQuantity(product.id, newQuantity);
    }
  };
  

  // Redirige vers la page de paiement
  const handleOrder = async () => {
    try {
      console.log("Contenu détaillé du panier :");
      cart.forEach((item, index) => {
        console.log(`Produit ${index + 1}:`, item);
      });
      
      const response = await fetch(`${API_URL}/payement/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      });
  
      const data = await response.json();
      console.log('Réponse Stripe backend:', data);
  
      // Vérifie si la sessionId est bien reçue
      if (!data.sessionId) {
        console.error("Aucun sessionId reçu du backend.");
        alert("Une erreur est survenue lors de la création de la session Stripe.");
        return;
      }
  
      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripe n’a pas été initialisé correctement.');
        alert('Erreur de configuration Stripe.');
        return;
      }
  
      console.log('Session ID reçu :', data.sessionId);
  
      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });
  
      if (result.error) {
        // Afficher l'erreur dans la console
        console.error('Erreur lors de la redirection vers Stripe :', result.error);
        alert(result.error.message);
      }
  
    } catch (error) {
      console.error('Erreur lors de la redirection vers Stripe :', error);
      
      // Affichage plus précis
      if (error instanceof Error) {
        alert(`Erreur lors de la tentative de paiement : ${error.message}`);
      } else {
        alert("Une erreur inconnue est survenue : " + JSON.stringify(error));
      }
    }
  };

  useEffect(() => {
    console.log('Panier mis à jour:', cart);
  }, [cart]);

  return (
    <Container className="mt-5 cart-container">
      <h2 className="cart-title">Votre Panier</h2>
      {cart.length === 0 ? (
        <p className="cart-empty">Il n'y a aucun produit dans votre panier.</p>
      ) : (
        <div>
          {cart.map((product) => {
            const price = product.price;

            return (
              <div key={`${product.productId}-${product.quantity}`}>
                <Card className="mb-3 cart-card" style={{ border: '2px solid #ff6f00' }}>
                  <Row className="w-100">
                    <Col md={3} className="d-flex justify-content-center align-items-center">
                      <Card.Img
                        src={`${API_URL}/uploads/${product.image}`} 
                        alt={product.name}
                        className="cart-image"
                      />
                    </Col>
                    <Col md={7}>
                      <Card.Body>
                        <Card.Title className="cart-card-title" style={{ color: '#ff6f00' }}>
                          {product.name}
                        </Card.Title>
                        <p><strong>Prix Unitaire:</strong> {price} €</p>
                        <div className="d-flex align-items-center">
                          <Button
                            variant="outline-secondary"
                            onClick={() => changeQuantity(product.productId, 'decrease')}
                            style={{ marginRight: '10px' }}
                          >
                            -
                          </Button>
                          <p><strong>Quantité:</strong> {product.quantity}</p>
                          <Button
                            variant="outline-secondary"
                            onClick={() => changeQuantity(product.productId, 'increase')}
                            style={{ marginLeft: '10px' }}
                          >
                            +
                          </Button>
                        </div>
                        <p><strong>Total :</strong> {price * product.quantity} €</p>
                      </Card.Body>
                    </Col>
                    <Col md={2} className="d-flex align-items-center justify-content-center">
                    <Button
  variant="danger"
  onClick={() => {
    removeFromCart(product.productId); // Appelle ta fonction de suppression
  }}
  style={{
    backgroundColor: '#ff6f00',
    borderColor: '#ff6f00',
    color: 'white'
  }}
>
  Supprimer
</Button>

                    </Col>
                  </Row>
                </Card>
              </div>
            );
          })}

          <div className="mt-5">
            <Recommendations excludeProductIds={productIdsInCart} />
          </div>

          <div className="text-right mt-3 cart-summary" style={{ color: '#ff6f00' }}>
            <h4>Total : {totalPrice.toFixed(2)} €</h4>
            <Button
              variant="outline-danger"
              onClick={clearCartFromBackend}
              style={{ marginRight: '15px', borderColor: '#ff6f00', color: '#ff6f00' }}
            >
              Vider le panier
            </Button>
            <Button
              variant="outline-success"
              className="ml-3"
              onClick={handleOrder}
              style={{
                borderColor: '#28a745',
                color: '#28a745'
              }}
            >
              Passer la commande
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Cart;
