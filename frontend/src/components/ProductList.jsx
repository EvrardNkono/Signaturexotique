import React from 'react';
import Card from 'react-bootstrap/Card';
import './ProductList.css'

const ProductList = ({ products }) => (
  <div className="product-list">
    {products.map((product) => (
      <Card key={product.id}>
        <Card.Img variant="top" src={product.image} />
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          <Card.Text>{product.price} €</Card.Text>
        </Card.Body>
      </Card>
    ))}
  </div>
);

export default ProductList;
