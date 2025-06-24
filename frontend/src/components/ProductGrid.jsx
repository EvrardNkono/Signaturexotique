import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ initialProducts, clientType }) => {
  const [products, setProducts] = useState(initialProducts || []);

  useEffect(() => {
    setProducts(initialProducts || []);
  }, [initialProducts]);

  const handleProductUpdate = (updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  return (
    <div className="custom-grid-container">
      <div className="custom-grid">
        {products.map((product) => (
          <div className="product-card-wrapper" key={product.id}>
            <ProductCard
              product={product}
              clientType={clientType}
              onUpdate={handleProductUpdate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
