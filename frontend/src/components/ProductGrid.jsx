import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProductCard from './ProductCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProductGrid.css'; // 💡 Ajout du fichier CSS personnalisé

const ProductGrid = ({ products, clientType }) => {
  return (
    <Container className="product-grid-container">
      <Row className="justify-content-center g-2"> {/* Modifié pour réduire l'espacement entre les colonnes */}
        {products.map((product) => (
          <Col
            key={product.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            className="d-flex justify-content-center" // ✅ recentre les cartes
          >
            <ProductCard product={product} clientType={clientType} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductGrid;
