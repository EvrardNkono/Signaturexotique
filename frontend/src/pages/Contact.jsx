import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.name || !formData.email || !formData.message) {
      setResponseMessage('Tous les champs sont requis.');
      return;
    }
  
    try {
      const response = await fetch(`${API_URL}/modules/contact/emailRoutes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setResponseMessage('Message envoyé avec succès!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setResponseMessage('Erreur lors de l\'envoi du message.');
      }
    } catch (error) {
      setResponseMessage('Une erreur est survenue lors de l\'envoi du message.');
    }
  };

  return (
    <div className="contact-section">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <img
              src="assets/3.png"
              alt="Illustration de contact"
              className="img-fluid rounded shadow"
            />
          </Col>
          <Col md={6}>
            <div className="contact-form p-4 rounded shadow">
              <h2 className="text-center mb-4 text-uppercase">CONTACTEZ-NOUS</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Votre nom"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="contact-input"
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Votre email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="contact-input"
                  />
                </Form.Group>

                <Form.Group controlId="formMessage" className="mb-4">
                  <Form.Label>Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Votre message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="contact-input"
                  />
                </Form.Group>

                <div className="text-center">
                  <Button variant="primary" type="submit" className="contact-btn px-4 py-2">
                    Envoyer
                  </Button>
                </div>
              </Form>

              {responseMessage && <p className="response-message">{responseMessage}</p>}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
