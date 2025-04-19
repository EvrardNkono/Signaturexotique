// src/components/Services.jsx
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './Services.css';

const services = [
  {
    title: "Livraison partout en France",
    description: "Nous assurons une livraison rapide et sécurisée partout en France, du nord au sud, de l'est à l'ouest.",
    image: "assets/livraison-france.png", // Assurez-vous que l'image est dans le dossier public/images
  },
  {
    title: "Expédition en Europe",
    description: "Nous expédions également nos produits dans toute l'Europe avec un service fiable et rapide.",
    image: "assets/expedition-europe.png", // Assurez-vous que l'image est dans le dossier public/images
  },
];

const Services = () => {
  return (
    <div className="services-section">
      <h2 className="section-title">Nos Services</h2>
      <Row>
        {services.map((service, index) => (
          <Col md={6} key={index}>
            <Card className="service-card">
              <Card.Img variant="top" src={service.image} alt={service.title} />
              <Card.Body>
                <Card.Title>{service.title}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Services;
