// components/RecommendationsGrid.jsx
import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { useCart } from '../context/CartContext'; // Importation du contexte du panier
import './RecommendationsGrid.css';

const RecommendationsGrid = ({ productId }) => {
  const [recommendations, setRecommendations] = useState([]);
  const { addToCart, cart } = useCart(); // Récupération de la fonction addToCart et du panier

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch(`${API_URL}/routes/recommendations?productId=${productId}`);
        const data = await res.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des recommandations', error);
      }
    };

    fetchRecommendations();
  }, [productId]);

  // Si aucune recommandation, ne rien afficher
  if (recommendations.length === 0) return null;

  // Filtrer les recommandations pour exclure celles déjà dans le panier
  const filteredRecommendations = recommendations.filter(
    (product) => !cart.some((item) => item.productId === product.productId)
  );

  // Limiter à un maximum de 9 produits (3 lignes de 3 produits)
  const MAX_RECOMMENDATIONS = 9;
  const limitedRecommendations = filteredRecommendations.slice(0, MAX_RECOMMENDATIONS);

  // Si aucune recommandation filtrée, ne rien afficher
  if (limitedRecommendations.length === 0) return null;
<h6>Vous aimerez peut-être aussi :</h6>
  return (
    <div className="recommendation-section mt-3">
      
      <Row>
        {limitedRecommendations.map((product) => (
          <Col key={product.productId} xs={12} md={4} className="mb-3">
            <Card className="recommendation-card">
              <Card.Img
                variant="top"
                src={`${API_URL}/uploads/${product.image}`}
                alt={product.name}
              />
              <Card.Body>
                <Card.Title style={{ fontSize: '1rem' }}>{product.name}</Card.Title>
                <p className="text-muted">{product.unitPrice} €</p>
                {/* Bouton d'ajout au panier */}
                <Button
                  variant="outline-primary"
                  onClick={() => addToCart(product)} // Ajout du produit au panier
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
        ))}
      </Row>
    </div>
  );
};

export default RecommendationsGrid;
