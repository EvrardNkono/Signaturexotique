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
              JUSQU’À -40% SUR NOTRE POIVRE RARE 🌶️
            </h1>
            <p>
              Originaire de Pendja, Cameroun, notre poivre blanc et noir est un trésor culinaire. Saisissez l’occasion de relever vos plats avec finesse !
            </p>
            <Button variant="success" as={Link} to="/bonplans">
              Je découvre la promo
            </Button>
          </div>
        </div>
      </Carousel.Item>

      {/* Slide 2 - Panier gourmand */}
      <Carousel.Item>
        <div className="banner-slide slide2">
          <div className="banner-content">
            <h1>
              FAITES-VOUS PLAISIR ! 🛒
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
              NOS BONS PLANS N’ATTENDENT PAS ! 💥
            </h1>
            <p>
              Produits d’exception, prix mini. Mais attention : nos surprises sont limitées dans le temps… soyez futé !
            </p>
            <Button variant="dark" as={Link} to="/bonplans">
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
              VOYAGEZ AVEC NOS RECETTES 🍲🌍
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
              LIVRAISON OFFERTE PRÈS DE CHEZ VOUS 🚚
            </h1>
            <p>
              Gratuit dans un rayon de 20 km. Expédition partout en France et En Europe selon nos conditions. Pratique, non ?
            </p>
            <Button variant="primary" as="a" href="#services">
  En savoir plus
</Button>


          </div>
        </div>
      </Carousel.Item>

    </Carousel>
  );
};

export default Banner;
