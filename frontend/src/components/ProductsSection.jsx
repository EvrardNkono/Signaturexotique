import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import './ProductsSection.css';

const ProductsSection = () => (
  <Container className="products-section my-5 py-5 px-4 rounded">
    <Row className="align-items-center">
      <Col md={6}>
        <h2 className="section-title mb-4">🌿 NOS PRODUITS EXOTIQUES</h2>
        <p className="section-description">
          Découvrez notre sélection de produits exotiques, directement importés de nos fermes partenaires à travers le monde. Fraîcheur et qualité garanties !
        </p>
      </Col>
      <Col md={6}>
        <Carousel fade controls={false} indicators={false} interval={3000}>
          <Carousel.Item>
            <img
              className="d-block w-100 rounded shadow"
              src="/assets/aa (11).jpg"
              alt="Produit exotique 1"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 rounded shadow"
              src="/assets/aa (22).jpg"
              alt="Produit exotique 2"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 rounded shadow"
              src="/assets/aa (3).jpg"
              alt="Produit exotique 3"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 rounded shadow"
              src="/assets/aa (44).jpg"
              alt="Produit exotique 4"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 rounded shadow"
              src="/assets/aa (51).jpg"
              alt="Produit exotique 5"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 rounded shadow"
              src="/assets/aa (61).jpg"
              alt="Produit exotique 6"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 rounded shadow"
              src="/assets/aa (71).jpg"
              alt="Produit exotique 7"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 rounded shadow"
              src="/assets/aa (81).jpg"
              alt="Produit exotique 8"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 rounded shadow"
              src="/assets/aa (91).jpg"
              alt="Produit exotique 9"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 rounded shadow"
              src="/assets/aa (100).jpg"
              alt="Produit exotique 10"
            />
          </Carousel.Item>
        </Carousel>
      </Col>
    </Row>
  </Container>
);

export default ProductsSection;
