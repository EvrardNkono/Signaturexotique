import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductGrid = ({ products, clientType }) => { // Ajout de clientType ici
  return (
    <Container>
      <Row className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6 flex flex-wrap justify-start gap-4">
        {products.map((product) => (
          <Col key={product.id} className="w-full sm:w-1/2 md:w-1/6">
            <ProductCard product={product} clientType={clientType} /> {/* Passage de clientType */}
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductGrid;
