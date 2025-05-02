import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Morgane',
    photo: '/assets/clientA.png',
    rating: 5,
    text: 'Les produits sont frais et de qualité ! Très satisfait.',
  },
  {
    name: 'Keliane',
    photo: '/assets/clientB.png',
    rating: 4,
    text: "J'adore leurs fruits tropicaux, un vrai délice !",
  },
  {
    name: 'Magalie',
    photo: '/assets/clientC.png',
    rating: 5,
    text: 'Livraison rapide, et produits toujours au top !',
  },
];

const Testimonials = () => {
  return (
    <Container className="my-5">
      <h2 className="section-title text-center mb-4">AVIS DES CLIENTS</h2>
      <Row className="justify-content-center">
        {testimonials.map((testimonial, idx) => (
          <Col key={idx} md={4} className="mb-4">
            <Card className="testimonial-card h-100">
              <Card.Body className="d-flex flex-column align-items-center text-center">
                <img
                  src={testimonial.photo}
                  alt={testimonial.name}
                  className="rounded-circle mb-3"
                  width="80"
                  height="80"
                />
                <Card.Title>{testimonial.name}</Card.Title>
                <div className="mb-2">
                  {'★'.repeat(testimonial.rating)}
                  {'☆'.repeat(5 - testimonial.rating)}
                </div>
                <Card.Text>"{testimonial.text}"</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Testimonials;
