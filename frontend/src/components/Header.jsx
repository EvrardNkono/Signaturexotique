import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SearchProduct from './SearchProduct';
import './Header.css';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import AddToCartPopup from './AddToCartPopup';

const Header = () => {
  const { cart } = useCart();
  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  useEffect(() => {
    // 1. Charger les catégories
    fetch(`${API_URL}/admin/category`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Erreur chargement catégories:', err));

    // 2. Écouter les ajouts au panier
    const handleItemAdded = (e) => {
      setLastAddedItem(e.detail);
      const timer = setTimeout(() => setLastAddedItem(null), 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('itemAdded', handleItemAdded);

    // 3. Gestion scroll pour cacher/afficher le header sur mobile
    let lastScrollTop = 0;
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

      if (window.innerWidth <= 768) {
        if (currentScroll > lastScrollTop) {
          setIsHeaderHidden(true); // scroll vers le bas
        } else {
          setIsHeaderHidden(false); // scroll vers le haut
        }
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('itemAdded', handleItemAdded);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLinkClick = () => setMenuOpen(false);

  const handleCategoryClick = (categoryName) => {
    navigate(`/home?categorie=${encodeURIComponent(categoryName)}`);
    setCategoryMenuOpen(false);
  };

  return (
    <header className={`custom-header ${isHeaderHidden ? 'header-hidden' : ''}`}>
      <div className="navbar">
        <div className="logo">
          <Link to="/" onClick={handleLinkClick}>
            <img src="/assets/logo1.png" alt="Signature Exotique" style={{ height: '150px' }} />
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
          <Link to="/bonplans" onClick={handleLinkClick} className="bonplans-link">🔥 Bons Plans</Link>
          <Link to="/recettes" onClick={handleLinkClick} className="recettes-link">🍽️ Nos Recettes</Link>
          <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
          <Link to="/newsletter" onClick={handleLinkClick}>📰 Newsletter</Link>
          <Link to="/livraison" onClick={handleLinkClick}>📦  Envoie de colis</Link>
          <Link to="/aboutus" onClick={handleLinkClick}>À propos de nous</Link>
          <Link to="/dashboard" onClick={handleLinkClick}>Tableau de bord</Link>
          <Link to="/panier" onClick={handleLinkClick}>
            🛒{cartQuantity > 0 && <span className="cart-quantity">{cartQuantity}</span>}
          </Link>

          {lastAddedItem && <AddToCartPopup item={lastAddedItem} />}

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
                  localStorage.removeItem('authToken');
                  logout();
                  navigate('/');
                  window.location.reload();
                  handleLinkClick();
                }}
                className="nav-link-style logout-link"
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
