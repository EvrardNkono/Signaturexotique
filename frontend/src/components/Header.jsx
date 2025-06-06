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
  useEffect(() => {
    // 1. Charger les catégories
    fetch(`${API_URL}/admin/category`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Erreur chargement catégories:', err));
  
    // 2. Écouter les ajouts au panier
    const handleItemAdded = (e) => {
      setLastAddedItem(e.detail);
  
      // Auto-hide le popup après 3 secondes
      const timer = setTimeout(() => {
        setLastAddedItem(null);
      }, 3000);
  
      // Nettoyage au cas où on reçoit un autre ajout rapidement
      return () => clearTimeout(timer);
    };
  
    window.addEventListener('itemAdded', handleItemAdded);
  
    // 3. Nettoyage à la désactivation du composant
    return () => {
      window.removeEventListener('itemAdded', handleItemAdded);
    };
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
  <Link to="/recettes" onClick={handleLinkClick} className="recettes-link">🍽️ Nos Recettes</Link> {/* Nouveau lien */}
  <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
<Link to="/newsletter" onClick={handleLinkClick}>📰 Newsletter</Link>
<Link to="/livraison" onClick={handleLinkClick}>📦 Livraison</Link>
  <Link to="/aboutus" onClick={handleLinkClick}>À propos de nous</Link>
  <Link to="/dashboard" onClick={handleLinkClick}>Tableau de bord</Link>
  <Link to="/panier" onClick={handleLinkClick}>
    🛒
    {cartQuantity > 0 && <span className="cart-quantity">{cartQuantity}</span>}
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
          // Supprimer le token JWT du localStorage ou sessionStorage
          localStorage.removeItem('authToken'); // Ou sessionStorage.removeItem('authToken')
          
          // Appeler la fonction logout
          logout();
          
          // Redirection vers la page d'accueil
          navigate('/');
          window.location.reload(); // 🔄 Rechargement complet de la page
          
          // Fermer le menu de navigation
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
    </header >
    
  );
};

export default Header;
