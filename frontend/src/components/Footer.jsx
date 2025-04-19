import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row>
          <Col md={4}>
            <h6>Pages principales</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/catalogue">Catalogue</Link></li>
              <li><Link to="/panier">Panier</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6>Commandes</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/checkout">Passer la commande</Link></li>
              <li><Link to="/admin/orders">Voir les commandes</Link></li>
              <li><Link to="/dashboard">Admin Dashboard</Link></li>
            </ul>
          </Col>
          <Col md={4}>
            <h6>Administration</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/admin/products">Gérer les produits</Link></li>
              <li><Link to="/admin/categories">Gérer les catégories</Link></li>
              <li><a href="mailto:contact@signatureexotique.com">Contact</a></li>
            </ul>
          </Col>
        </Row>
        <hr style={{ backgroundColor: 'white' }} />
        <p className="text-center mb-0">&copy; 2025 Signature Exotique. Tous droits réservés.</p>
      </Container>
    </footer>
  );
};

export default Footer;
