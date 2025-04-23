import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import { CartProvider } from './context/CartContext';
import { SearchProvider } from './context/SearchContext';
import { AuthProvider } from './context/AuthContext'; // Importer le AuthProvider
import 'bootstrap/dist/css/bootstrap.min.css';
import Checkout from './pages/Checkout';
import './App.css';
import './components/Header.css';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute'; // Importer le composant PrivateRoute
import Profile from './pages/Profile'; // Ajouter l'import du Profile


const App = () => {
  return (
    <AuthProvider> {/* Ajout du AuthProvider */}
      <CartProvider>
        <SearchProvider>
          <Router>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Route protégée pour le dashboard */}
                <Route 
                  path="/dashboard" 
                  element={<PrivateRoute element={<Dashboard />} />} 
                />
                
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />

              </Routes>
            </main>
            <Footer />
          </Router>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
