import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Recommendations from '../components/Recommendations'; // Importation de Recommendations
import './Cart.css';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    clientType // Utilisation de clientType ici
  } = useCart();

  const navigate = useNavigate();

  // Calcul du prix total basé sur le type de client
  const totalPrice = cart.reduce((total, product) => {
    const price = product.price;

    console.log("=== Calcul du prix ===");
    console.log("Client Type dans le panier:", clientType);
    console.log("Produit:", product);
    console.log("Prix à utiliser:", price);
    
    return total + price * product.quantity;
  }, 0);

  // Récupérer les IDs des produits déjà dans le panier
  const productIdsInCart = cart.map(product => product.productId);

  // Redirige vers la page de paiement
  const handleOrder = () => {
    navigate('/checkout');
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

            console.log("=== Détails du produit dans le panier ===");
            console.log("Nom du produit:", product.name);
            console.log("Prix utilisé dans le panier:", price);
            console.log("Quantité:", product.quantity);

            return (
              <div key={`${product.productId}-${product.quantity}`}>
                <Card className="mb-3 cart-card" style={{ border: '2px solid #ff6f00' }}>
                  <Row className="w-100">
                    <Col md={3} className="d-flex justify-content-center align-items-center">
                      <Card.Img
                        src={`http://localhost:5000/uploads/${product.image}`}
                        alt={product.name}
                        className="cart-image"
                      />
                    </Col>
                    <Col md={7}>
                      <Card.Body>
                        <Card.Title className="cart-card-title" style={{ color: '#ff6f00' }}>{product.name}</Card.Title>
                        <p><strong>Prix Unitaire:</strong> {price} €</p>
                        <p><strong>Quantité:</strong> {product.quantity}</p>
                        <p><strong>Total :</strong> {price * product.quantity} €</p>
                      </Card.Body>
                    </Col>
                    <Col md={2} className="d-flex align-items-center justify-content-center">
                      <Button
                        variant="danger"
                        onClick={() => removeFromCart(product.productId)}
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
          
          {/* 🔥 Section recommandations après tous les produits */}
          <div className="mt-5">
            {/*<h3 style={{ color: '#ff6f00' }}>Produits recommandés pour vous :</h3>*/}
            {/* Passer l'array des produits du panier pour exclure les produits déjà présents */}
            <Recommendations excludeProductIds={productIdsInCart} />
          </div>

          <div className="text-right mt-3 cart-summary" style={{ color: '#ff6f00' }}>
            <h4>Total : {totalPrice.toFixed(2)} €</h4>
            <Button
              variant="outline-danger"
              onClick={() => console.log("Vider le panier")}
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
