import './Footer.css';
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-section">
      <Container>
        <div className="footer-cta pt-5 pb-5">
          <Row>
            <Col xl={4} md={4} className="mb-30">
              <div className="single-cta">
                <i className="fas fa-map-marker-alt"></i>
                <div className="cta-text">
                  <h4>TROUVEZ NOUS</h4>
                  <span>Adresse : 12 rue de Draveil, 91260 Juvisy-sur-Orge</span>
                </div>
              </div>
            </Col>
            <Col xl={4} md={4} className="mb-30">
              <div className="single-cta">
                <i className="fas fa-phone"></i>
                <div className="cta-text">
                  <h4>APPELLEZ NOUS</h4>
                  <span>+33 6 44 95 11 84</span><br />
<span>+33 9 84 59 44 53</span>

                </div>
              </div>
            </Col>
            <Col xl={4} md={4} className="mb-30">
              <div className="single-cta">
                <i className="far fa-envelope-open"></i>
                <div className="cta-text">
                  <h4>LAISSEZ NOUS UN MAIL</h4>
                  <span>mekafrance@outlook.fr</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div className="footer-content pt-5 pb-5">
          <Row>
            <Col xl={4} lg={4} className="mb-50">
              <div className="footer-widget">
                <div className="footer-logo text-center">
  <Link to="/">
    <img
  src="assets/logo.png"
  alt="logo Meka France"
  style={{
    maxWidth: '300px',
    height: 'auto',
    display: 'block',
    margin: '0 auto',
    transition: 'transform 0.3s ease',
  }}
  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
/>

  </Link>
</div>

                <div className="footer-text">
                  <p>Meka France, spécialiste des produits exotiques et agroalimentaires d’Afrique, d’Asie et des Caraïbes.</p>
                </div>
                <div className="footer-social-icon">
                  <span>Suivez-nous</span>
                  <a href="#"><i className="fab fa-facebook-f facebook-bg"></i></a>
                  <a href="#"><i className="fab fa-tiktok tiktok-bg"></i></a>
                  <a href="#"><i className="fab fa-instagram instagram-bg"></i></a>
                  <a href="#"><i className="fab fa-snapchat-ghost snapchat-bg"></i></a>
                </div>
                <div className="signature-logo mt-3 text-center">
  <img
    src="assets/signature.png"
    alt="Logo Signature Exotique"
    style={{ maxWidth: '300px', height: 'auto' }}
  />
  <p
    style={{
      color: 'white',
      marginTop: '12px',
      fontSize: '1.rem',
      fontWeight: '500',
      fontFamily: 'cursive',
    }}
  >
    Notre marque Signature Exotique
  </p>
</div>

              </div>
            </Col>

            <Col xl={4} lg={4} md={6} className="mb-30">
              <div className="footer-widget">
                <div className="footer-widget-heading">
                  <h3>Liens utiles</h3>
                </div>
                <ul>
                  <li><Link to="/">Accueil</Link></li>
                  <li><Link to="/catalogue">Catalogue</Link></li>
                  <li><Link to="/bonplans">Bons Plans</Link></li>
                  <li><Link to="/recettes">Recettes</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                  <li><Link to="/aboutus">À propos de nous</Link></li>
                  <li><Link to="/livraison">Expedition</Link></li>
                </ul>
              </div>
            </Col>

            <Col xl={4} lg={4} md={6} className="mb-50">
              <div className="footer-widget">
                <div className="footer-widget-heading">
                  <h3>S’inscrire</h3>
                </div>
                <div className="footer-text mb-25">
                  <p>Recevez nos actus et bons plans, inscrivez-vous ci-dessous.</p>
                </div>
                <div className="subscribe-form" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
  <form action="#">
    <input type="email" placeholder="Email" required style={{ padding: '10px', fontSize: '16px', width: '100%', maxWidth: '300px', borderRadius: '5px' }} />
    <button type="submit" style={{ backgroundColor: 'orange', color: 'white', padding: '10px 20px', fontSize: '16px', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px', width: '100%', maxWidth: '300px' }}>
      S'inscrire
    </button>
  </form>
</div>

              </div>
            </Col>
          </Row>
        </div>
      </Container>

      <div className="copyright-area">
        <Container>
          <Row>
            <Col xl={6} lg={6} className="text-center text-lg-left">
              <div className="copyright-text">
                <p>&copy; {new Date().getFullYear()} Meka France. Tous droits réservés.</p>
              </div>
            </Col>
            <Col xl={6} lg={6} className="d-none d-lg-block text-right">
              <div className="footer-menu">
                <ul>
                  <li><Link to="/">Accueil</Link></li>
                  <li><Link to="/terms">Conditions</Link></li>
                  <li><Link to="/privacy">Confidentialité</Link></li>
                  <li><Link to="/contact">Contact</Link></li>
                </ul>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
