import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import './RecommendationsGrid.css';

const RecommendationsGrid = () => {
  const [recommendations, setRecommendations] = useState([]);
  const { addToCart, cart, clientType } = useCart(); // On récupère aussi clientType

  const normalizeName = (name) => name.trim().toLowerCase();

  const removeDuplicatesByKey = (products) => {
    const seen = new Set();
    return products.filter((product) => {
      const key = `${normalizeName(product.name)}-${product.unitPrice}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        let allRecommendations = [];

        for (const item of cart) {
          const res = await fetch(`${API_URL}/routes/recommendations?productId=${item.productId}`);
          const data = await res.json();
          allRecommendations = allRecommendations.concat(data);
        }

        const uniqueRecommendations = removeDuplicatesByKey(allRecommendations);
        const productNamesInCart = new Set(cart.map(item => normalizeName(item.name)));
        const filtered = uniqueRecommendations.filter(
          (product) => !productNamesInCart.has(normalizeName(product.name))
        );

        setRecommendations(filtered.slice(0, 9));
      } catch (error) {
        console.error('Erreur lors de la récupération des recommandations:', error);
      }
    };

    if (cart.length > 0) {
      fetchRecommendations();
    }
  }, [cart]);

  if (recommendations.length === 0) return null;

  const getAdjustedPrice = (product) => {
    return clientType === 'wholesale' && product.wholesalePrice
      ? product.wholesalePrice
      : product.unitPrice || product.price;
  };

  return (
    <div className="recommendation-section mt-3">
      <h6>Vous aimerez peut-être aussi :</h6>
      <Row>
        {recommendations.map((product) => {
          const adjustedPrice = getAdjustedPrice(product);

          return (
            <Col key={product.id} xs={12} md={4} className="mb-3">
              <Card className="recommendation-card">
                <Card.Img
                  variant="top"
                  src={`${API_URL}/uploads/${product.image}`}
                  alt={product.name}
                  className="card-img-top"
                />
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <p className="text-muted">{adjustedPrice} €</p>
                  <Button
                    variant="outline-primary"
                    onClick={() => {
                      addToCart({
                        ...product,
                        price: adjustedPrice,
                        unitPrice: product.unitPrice,
                        wholesalePrice: product.wholesalePrice,
                      });
                    }}
                    style={{
                      backgroundColor: '#ff6f00',
                      borderColor: '#ff6f00',
                      color: 'white',
                    }}
                  >
                    Ajouter au panier
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default RecommendationsGrid;
