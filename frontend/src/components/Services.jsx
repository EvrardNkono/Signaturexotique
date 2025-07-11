// src/components/Services.jsx
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './Services.css';

const services = [
  {
    title: "Livraison partout en France",
    description: "Livraison gratuite sous condition dans un rayon de 20 km en partant du magasin.🚚",

    image: "assets/livraison-france.jpg", // Assurez-vous que l'image est dans le dossier public/images
  },
  {
    title: "Expédition en Europe",
    description: "Nous expédions également nos produits dans toute l'Europe avec un service fiable, rapide, soigné et toujours à l'écoute de vos besoins alors n'attendez pas commendez chez nous. 🌍",
    image: "assets/expedition-europe.jpg", // Assurez-vous que l'image est dans le dossier public/images
  },
];

const Services = () => {
  return (
    <div className="services-section">
      <h2 className="section-title">NOS SERVICES</h2>
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
