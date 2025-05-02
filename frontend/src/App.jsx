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
import { AuthProvider } from './context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Checkout from './pages/Checkout';
import './App.css';
import './components/Header.css';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import Profile from './pages/Profile';
import AccessDenied from './pages/AccessDenied'; // <-- ✨ nouveau import
import BonPlans from './pages/BonPlans'; // 🔥 Import de ta page de Bons Plans
import RecipePage from './pages/RecipePage';
import AboutUs from './pages/AboutUs';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import '@fortawesome/fontawesome-free/css/all.min.css';




const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <Router>
            <Header />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/bonplans" element={<BonPlans />} /> 
                <Route path="/panier" element={<Cart />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/recettes" element={<RecipePage />} />
                <Route path="/aboutus" element={<AboutUs />} />

                {/* ✅ Route protégée pour le dashboard */}
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute allowedRoles={['admin', 'superadmin']}>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />

                {/* ✅ Page en cas d'accès refusé */}
                <Route path="/access-denied" element={<AccessDenied />} />

                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/success" element={<Success />} />
<Route path="/cancel" element={<Cancel />} />
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
