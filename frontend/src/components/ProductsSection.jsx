import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './ProductsSection.css';

const ProductsSection = () => (
  <Container className="products-section my-5 py-5 px-4 rounded">
    <Row className="align-items-center">
      <Col md={6}>
        <h2 className="section-title mb-4">🌿 Nos Produits Exotiques</h2>
        <p className="section-description">
          Découvrez notre sélection de produits exotiques, directement importés de nos fermes partenaires à travers le monde. Fraîcheur et qualité garanties !
        </p>
      </Col>
      <Col md={6}>
        <img
          src="/assets/aa (1).png"
          alt="Produits exotiques"
          className="img-fluid rounded shadow"
        />
      </Col>
    </Row>
  </Container>
);

export default ProductsSection;
