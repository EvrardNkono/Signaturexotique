// src/components/Banner.jsx
import { Button } from 'react-bootstrap';
import './Banner.css';
import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <div className="banner">
      <div className="banner-content">
        <h1>Bienvenue sur Signature Exotique</h1>
        <p>Découvrez des produits exotiques uniques et de qualité</p>
        <Button variant="success" as={Link} to="/catalogue">Voir le Catalogue</Button>
      </div>
    </div>
  );
};

export default Banner;

