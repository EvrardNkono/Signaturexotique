import { Carousel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
  return (
    <Carousel fade interval={4000} className="banner-carousel">

      {/* Slide 1 - Promotions sur tomates et légumes */}
      <Carousel.Item>
        <div className="banner-slide slide1">
          <div className="banner-content slide1-content">
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', color: '#FF7F32' }}>
              La fraîcheur pure, à prix doux 🌿🍅
            </h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '30px', lineHeight: '1.6', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)', color: '#FFFFFF' }}>
              Découvrez nos tomates et légumes fraîchement cueillis, riches en goût et en vitalité. -20% sur votre première commande pour savourer l'authenticité dès aujourd'hui !
            </p>
            <Button variant="success" as={Link} to="/catalogue" style={{ fontSize: '1.2rem', padding: '12px 30px', borderRadius: '5px', textTransform: 'uppercase', fontWeight: 'bold' }}>
              Découvrir nos trésors
            </Button>
          </div>
        </div>
      </Carousel.Item>

      {/* Slide 2 - Fraîcheur de nos produits */}
      <Carousel.Item>
        <div className="banner-slide slide2">
          <div className="banner-content">
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', color: '#FF7F32' }}>
              Chaque produit, une promesse de fraîcheur 🍍🥬
            </h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '30px', lineHeight: '1.6', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)', color: '#FFFFFF' }}>
              Chez MEKA FRANCE, chaque légume, chaque fruit est sélectionné avec exigence pour vous garantir croquant, arômes et authenticité. Goûtez la différence !
            </p>
            <Button variant="warning" as={Link} to="/catalogue" style={{ fontSize: '1.2rem', padding: '12px 30px', borderRadius: '5px', textTransform: 'uppercase', fontWeight: 'bold' }}>
              Succomber à la qualité
            </Button>
          </div>
        </div>
      </Carousel.Item>

      {/* Slide 3 - Saveurs du monde */}
      <Carousel.Item>
        <div className="banner-slide slide3">
          <div className="banner-content">
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)', color: '#FFFFFF' }}>
              Un monde de saveurs authentiques vous attend 🌍✨
            </h1>
            <p style={{ fontSize: '1.5rem', marginBottom: '30px', lineHeight: '1.6', textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)', color: '#FFFFFF' }}>
              Nos épices et produits exotiques sont sélectionnés pour leur richesse, leur intensité, leur origine. Signature Exotique, c’est l’assurance de l’excellence naturelle.
            </p>
            <Button variant="dark" as={Link} to="/catalogue" style={{ fontSize: '1.2rem', padding: '12px 30px', borderRadius: '5px', textTransform: 'uppercase', fontWeight: 'bold' }}>
              Goûter l'exception
            </Button>
          </div>
        </div>
      </Carousel.Item>

    </Carousel>
  );
};

export default Banner;
