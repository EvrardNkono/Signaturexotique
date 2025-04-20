import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import { useCart } from '../context/CartContext';
import SearchProduct from './SearchProduct';
import './Header.css';
import { Link } from 'react-router-dom';  // Ajouter cette ligne
import { API_URL } from '../config';


const Header = () => {
  const { cart } = useCart();
  const cartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // Pour la navigation

  useEffect(() => {
    fetch(`${API_URL}/admin/category`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      })
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
          <Link to="/" onClick={handleLinkClick}>Signature Exotique</Link>
        </div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>

        <SearchProduct onSearch={(query) => console.log('Recherche:', query)} />

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={handleLinkClick}>Accueil</Link>
          <Link to="/catalogue" onClick={handleLinkClick}>Catalogue</Link>
          <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
          <Link to="/dashboard" onClick={handleLinkClick}>Tableau de bord</Link>
          <Link to="/panier" onClick={handleLinkClick}>
            🛒
            {cartQuantity > 0 && <span className="cart-quantity">{cartQuantity}</span>}
          </Link>
        </nav>
      </div>

      <div className="category-toggle" onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* Menu des catégories */}
    
    </header>
  );
};

export default Header;
