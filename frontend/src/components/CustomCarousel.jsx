import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import './CustomCarousel.css'; // Assurez-vous de créer ce fichier CSS

const CustomCarousel = () => {
  return (
    <Container className="my-5">
      <h2 className="section-title text-center mb-4 text-uppercase">NOS SÉLECTIONS COLORÉES</h2>
      <Row>
        <Col md={6}>
          <Carousel className="custom-carousel carousel-orange">
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/assets/aa (1).jpg"
                alt="Slide 1"
              />
              <Carousel.Caption>
                <h3 className="text-uppercase">FRUITS TROPICAUX</h3>
                <p>Des saveurs exotiques pour égayer vos papilles.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/assets/aa (2).jpg"
                alt="Slide 2"
              />
              <Carousel.Caption>
                <h3 className="text-uppercase">ÉPICES RARES</h3>
                <p>Ajoutez une touche unique à vos plats.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/assets/aa (9).jpg"  // Nouvelle image ajoutée pour légumes
                alt="Slide 3"
              />
              <Carousel.Caption>
                <h3 className="text-uppercase">NOS LÉGUMES FRAIS</h3>  {/* Modifié pour parler des légumes */}
                <p>Des légumes frais pour vos recettes quotidiennes.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
        <Col md={6}>
          <Carousel className="custom-carousel carousel-blue">
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/assets/aa (3).jpg"
                alt="Slide 3"
              />
              <Carousel.Caption>
                <h3 className="text-uppercase">HERBES AROMATIQUES</h3>
                <p>Fraîcheur et arômes pour vos recettes.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/assets/aa (4).jpg"
                alt="Slide 4"
              />
              <Carousel.Caption>
                <h3 className="text-uppercase">PRODUITS NATURELS</h3>
                <p>Une sélection saine et savoureuse.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="/assets/aa (10).jpg"  // Nouvelle image ajoutée pour tubercules
                alt="Slide 5"
              />
              <Carousel.Caption>
                <h3 className="text-uppercase">NOS TUBERCULES EXOTIQUES</h3>  {/* Modifié pour parler des tubercules */}
                <p>Des tubercules savoureux pour agrémenter vos plats.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomCarousel;
