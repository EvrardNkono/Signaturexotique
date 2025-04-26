import { Carousel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
  return (
    <Carousel fade interval={3000} className="banner-carousel">
      {/* Slide 1 */}
      <Carousel.Item>
        <div className="banner-slide slide1">
          <div className="banner-content">
            <h1>Bienvenue sur Signature Exotique</h1>
            <p>Découvrez des produits exotiques uniques et de qualité</p>
            <Button variant="success" as={Link} to="/catalogue">
              Voir le Catalogue
            </Button>
          </div>
        </div>
      </Carousel.Item>

      {/* Slide 2 */}
      <Carousel.Item>
        <div className="banner-slide slide2">
          <div className="banner-content">
            <h1>Des Saveurs Inédites</h1>
            <p>Explorez nos sélections exclusives du bout du monde</p>
            <Button variant="warning" as={Link} to="/catalogue">
              Explorer
            </Button>
          </div>
        </div>
      </Carousel.Item>

      {/* Slide 3 */}
      <Carousel.Item>
        <div className="banner-slide slide3">
          <div className="banner-content">
            <h1>L'Exotisme à votre Porte</h1>
            <p>Commandez facilement et profitez d'une expérience unique</p>
            <Button variant="dark" as={Link} to="/catalogue">
              Commander
            </Button>
          </div>
        </div>
      </Carousel.Item>
    </Carousel>
  );
};

export default Banner;
