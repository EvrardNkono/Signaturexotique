// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import { CartProvider } from './context/CartContext'; // Importer le CartProvider
import { SearchProvider } from './context/SearchContext'; // Importer SearchProvider
import 'bootstrap/dist/css/bootstrap.min.css';
import Checkout from './pages/Checkout';
import './App.css';
import './components/Header.css';

const App = () => {
  return (
    <CartProvider>
      <SearchProvider> {/* Englobé avec SearchProvider */}
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogue" element={<Catalogue />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </SearchProvider>
    </CartProvider>
  );
};

export default App;
