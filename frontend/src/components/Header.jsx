import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SearchProduct from './SearchProduct';
import './Header.css';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { cart } = useCart();
  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/admin/category`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Erreur chargement catégories:', err));
  }, []);

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/home?categorie=${encodeURIComponent(categoryName)}`);
    setCategoryMenuOpen(false);
  };

  return (
    <header className="custom-header">
      <div className="navbar">
        <div className="logo">
          <Link to="/" onClick={handleLinkClick}>
            <img src="/assets/logo.png" alt="Signature Exotique" style={{ height: '200px' }} />
          </Link>
        </div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <div className="search-bar-container">
          <SearchProduct onSearch={(query) => console.log('Recherche:', query)} />
        </div>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={handleLinkClick}>Accueil</Link>
          <Link to="/catalogue" onClick={handleLinkClick}>Catalogue</Link>
          <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
          <Link to="/dashboard" onClick={handleLinkClick}>Tableau de bord</Link>
          <Link to="/panier" onClick={handleLinkClick}>
            🛒
            {cartQuantity > 0 && <span className="cart-quantity">{cartQuantity}</span>}
          </Link>

          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={handleLinkClick}>Connexion</Link>
              <Link to="/register" onClick={handleLinkClick}>S'inscrire</Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={handleLinkClick} className="profile-link">👤 Mon Profil</Link>
              <span
                onClick={() => {
                  // Supprimer le token JWT du localStorage ou sessionStorage
                  localStorage.removeItem('authToken'); // Ou sessionStorage.removeItem('authToken')
                  
                  // Appeler la fonction logout
                  logout();
                  
                  // Redirection vers la page d'accueil
                  navigate('/');
                  
                  // Fermer le menu de navigation
                  handleLinkClick();
                }}
                className="nav-link-style"
              >
                Déconnexion
              </span>
            </>
          )}
        </nav>
      </div>

      <div className="category-toggle" onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Menu déroulant des catégories */}
      {categoryMenuOpen && (
        <div className="category-dropdown">
          {categories.map((category) => (
            <div key={category.id} className="category-item" onClick={() => handleCategoryClick(category.name)}>
              {category.name}
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
