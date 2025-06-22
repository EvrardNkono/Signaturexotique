import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import SearchProduct from './SearchProduct';
import './Header.css';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import AddToCartPopup from './AddToCartPopup';
import { RiShoppingCart2Line } from 'react-icons/ri';

const Header = () => {
  const { cart } = useCart();
  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/admin/category`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Erreur chargement catégories:', err));

    const handleItemAdded = (e) => {
      setLastAddedItem(e.detail);
      const timer = setTimeout(() => setLastAddedItem(null), 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('itemAdded', handleItemAdded);

    let lastScrollTop = 0;
    const handleScroll = () => {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (window.innerWidth <= 768) {
        setIsHeaderHidden(currentScroll > lastScrollTop);
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

  const isActive = (path) => location.pathname === path ? 'active' : '';

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
          <Link to="/" onClick={handleLinkClick} className={isActive('/')}>Accueil</Link>
          <Link to="/catalogue" onClick={handleLinkClick} className={isActive('/catalogue')}>Catalogue</Link>
          <Link to="/bonplans" onClick={handleLinkClick} className={`bonplans-link ${isActive('/bonplans')}`}>🔥 Bons Plans</Link>
          <Link to="/recettes" onClick={handleLinkClick} className={`recettes-link ${isActive('/recettes')}`}>🍽️ Nos Recettes</Link>
          <Link to="/contact" onClick={handleLinkClick} className={isActive('/contact')}>Contact</Link>
          <Link to="/newsletter" onClick={handleLinkClick} className={isActive('/newsletter')}>📰 Newsletter</Link>
          <Link to="/livraison" onClick={handleLinkClick} className={isActive('/livraison')}>📦  Envoie de colis</Link>
          <Link to="/aboutus" onClick={handleLinkClick} className={isActive('/aboutus')}>À propos de nous</Link>

          {user?.role === 'superadmin' && (
            <Link to="/dashboard" onClick={handleLinkClick} className={isActive('/dashboard')}>Tableau de bord</Link>
          )}

          <Link to="/panier" onClick={handleLinkClick} className={`cart-link ${isActive('/panier')}`}>
            <RiShoppingCart2Line className="cart-icon" />
            {cartQuantity > 0 && (
              <span className="cart-quantity">{cartQuantity}</span>
            )}
          </Link>

          {lastAddedItem && <AddToCartPopup item={lastAddedItem} />}

          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={handleLinkClick} className={isActive('/login')}>Connexion</Link>
              <Link to="/register" onClick={handleLinkClick} className={isActive('/register')}>S'inscrire</Link>
            </>
          ) : (
            <>
              <Link to="/profile" onClick={handleLinkClick} className={`profile-link ${isActive('/profile')}`}>👤</Link>
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
