import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, clearCartFromBackend } = useCart(); // Modifier l'importation ici

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    deliveryMethod: 'standard',
    paymentMethod: 'cod',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const total = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  
    const orderData = {
      customer: form,
      items: cart,
      total,
    };
  
    // ✅ Étape 1 : Envoi de la commande au backend
    try {
      const response = await fetch('http://localhost:5000/modules/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        // ✅ Étape 2 : Génération du message WhatsApp
        const adminPhone = '+33644758027'; // <-- remplace par ton numéro admin, format sans +
        const message = `
  📦 Nouvelle commande !
  
  👤 ${form.firstName} ${form.lastName}
  📞 ${form.phone}
  🏠 ${form.address}, ${form.city} ${form.postalCode}, ${form.country}
  🚚 Livraison : ${form.deliveryMethod}
  💳 Paiement : ${form.paymentMethod}
  
  🛒 Produits :
  ${cart.map(item => `• ${item.name} (x${item.quantity}) - ${item.unitPrice} €`).join('\n')}
  
  💰 Total : ${total.toFixed(2)} €
        `.trim();
  
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${adminPhone}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
  
        alert('Commande envoyée avec succès !');
        clearCartFromBackend(); // Utilise clearCartFromBackend ici
      } else {
        alert("Erreur lors de l'envoi de la commande.");
      }
    } catch (error) {
      console.error('Erreur lors de la commande :', error);
      alert("Erreur de connexion au serveur.");
    }
  };
  
  const total = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  return (
    <Container className="checkout-container">
      <h2 className="checkout-title">Finaliser la commande</h2>
      <Row>
        <Col md={7}>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Prénom</Form.Label>
                  <Form.Control name="firstName" onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Nom</Form.Label>
                  <Form.Control name="lastName" onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group>
              <Form.Label>Adresse</Form.Label>
              <Form.Control name="address" onChange={handleChange} required />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Ville</Form.Label>
                  <Form.Control name="city" onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Code postal</Form.Label>
                  <Form.Control name="postalCode" onChange={handleChange} required />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Pays</Form.Label>
                  <Form.Control name="country" onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group>
              <Form.Label>Téléphone</Form.Label>
              <Form.Control name="phone" onChange={handleChange} required />
            </Form.Group>

            <Form.Group>
              <Form.Label>Méthode de livraison</Form.Label>
              <Form.Control as="select" name="deliveryMethod" onChange={handleChange}>
                <option value="standard">Standard - Gratuit</option>
                <option value="express">Express - 9.99 €</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Mode de paiement</Form.Label>
              <Form.Control as="select" name="paymentMethod" onChange={handleChange}>
                <option value="cod">Paiement à la livraison</option>
                <option value="card">Carte de crédit (bientôt disponible)</option>
              </Form.Control>
            </Form.Group>

            <Button type="submit" variant="success" className="w-100 mt-3">Passer la commande</Button>
          </Form>
        </Col>

        <Col md={5}>
          <Card className="checkout-summary">
            <Card.Body>
              <Card.Title>Résumé de la commande</Card.Title>
              {cart.map((item) => (
                <div key={item.productId} className="d-flex justify-content-between mb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>{(item.unitPrice * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
              <hr />
              <h5>Total : {total.toFixed(2)} €</h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Checkout;
