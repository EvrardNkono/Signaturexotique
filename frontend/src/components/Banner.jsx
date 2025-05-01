import { Carousel, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
  return (
    <Carousel fade interval={4000} className="banner-carousel">
      
      {/* Slide 1 - Poivre du Cameroun */}
      <Carousel.Item>
        <div className="banner-slide slide1">
          <div className="banner-content slide1-content">
            <h1>
              Jusqu’à -40% sur notre poivre rare 🌶️
            </h1>
            <p>
              Originaire de Pendja, Cameroun 🇨🇲, notre poivre blanc et noir est un trésor culinaire. Saisissez l’occasion de relever vos plats avec finesse !
            </p>
            <Button variant="success" as={Link} to="/catalogue">
              Je découvre le poivre d’exception
            </Button>
          </div>
        </div>
      </Carousel.Item>

      {/* Slide 2 - Panier gourmand */}
      <Carousel.Item>
        <div className="banner-slide slide2">
          <div className="banner-content">
            <h1>
              Faites-vous plaisir ! 🛒
            </h1>
            <p>
              Explorez nos produits et composez votre panier gourmand en quelques clics. C’est bon, rapide et malin !
            </p>
            <Button variant="warning" as={Link} to="/catalogue">
              Créer mon panier
            </Button>
          </div>
        </div>
      </Carousel.Item>

      {/* Slide 3 - Bons Plans */}
      <Carousel.Item>
        <div className="banner-slide slide3">
          <div className="banner-content">
            <h1>
              Nos Bons Plans n’attendent pas ! 💥
            </h1>
            <p>
              Produits d’exception, prix mini. Mais attention : nos surprises sont limitées dans le temps… soyez futé !
            </p>
            <Button variant="dark" as={Link} to="/bons-plans">
              Voir les bons plans
            </Button>
          </div>
        </div>
      </Carousel.Item>

      {/* Slide 4 - Recettes inspirantes */}
      <Carousel.Item>
        <div className="banner-slide slide4">
          <div className="banner-content">
            <h1>
              Voyagez avec nos recettes 🍲🌍
            </h1>
            <p>
              Laissez-vous inspirer par nos idées gourmandes et donnez du peps à vos repas !
            </p>
            <Button variant="info" as={Link} to="/recettes">
              Explorer les recettes
            </Button>
          </div>
        </div>
      </Carousel.Item>

      {/* Slide 5 - Livraison */}
      <Carousel.Item>
        <div className="banner-slide slide5">
          <div className="banner-content">
            <h1>
              Livraison offerte près de chez vous 🚚
            </h1>
            <p>
              Gratuit dans un rayon de 40 km. Expédition partout en Europe selon nos conditions. Pratique, non ?
            </p>
            <Button variant="primary" as={Link} to="/livraison">
              En savoir plus
            </Button>
          </div>
        </div>
      </Carousel.Item>

    </Carousel>
  );
};

export default Banner;
