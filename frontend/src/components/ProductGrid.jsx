import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductGrid = ({ products, clientType }) => {
  return (
    <Container className="d-flex justify-content-center">
      <Row className="justify-content-center g-4">
        {products.map((product) => (
          <Col 
            key={product.id} 
            xs={12} sm={6} md={4} lg={3} // Configuration responsive
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
