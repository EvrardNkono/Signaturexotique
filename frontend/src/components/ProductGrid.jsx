import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductGrid.css'; // Assurez-vous que le CSS est bien importé

const ProductGrid = ({ products, clientType }) => {
  return (
    <Container className="product-grid-container">
      {/* Ajout de gaps responsive entre les cartes */}
      <Row className="justify-content-center g-1 g-sm-2 g-md-3 g-lg-4">
        {products.map((product) => (
          <Col 
            key={product.id} 
            xs={12} sm={6} md={4} lg={3}
            className="d-flex justify-content-center"
          >
            <ProductCard product={product} clientType={clientType} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductGrid;
