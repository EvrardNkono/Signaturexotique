import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css'; // On conserve le CSS mais on vire Bootstrap ici

const ProductGrid = ({ products, clientType }) => {
  return (
    <div className="custom-grid-container">
      <div className="custom-grid">
        {products.map((product) => (
          <div className="product-card-wrapper" key={product.id}>
            <ProductCard product={product} clientType={clientType} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
