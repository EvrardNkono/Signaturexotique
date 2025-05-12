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
import AccessDenied from './pages/AccessDenied';
import BonPlans from './pages/BonPlans';
import RecipePage from './pages/RecipePage';
import AboutUs from './pages/AboutUs';
import Success from './pages/Success';
import Cancel from './pages/Cancel';
import SocialFollow from './components/SocialFollow';
import NewsletterPage from './pages/NewsletterPage';
import PopupImage from './components/PopupImage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeliveryForm from './pages/DeliveryForm'; // ✅ c’est une page, donc on le traite comme tel
import ChatPopup from "./components/ChatPopup";

// Import du composant ScrollToTop
import ScrollToTop from './components/ScrollToTop'; // à créer

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <Router>
            <ScrollToTop /> {/* Ajout du composant ScrollToTop ici */}
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
                <Route path="/newsletter" element={<NewsletterPage />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute allowedRoles={['admin', 'superadmin']}>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/delivery" element={<DeliveryForm />} />

              </Routes>
            </main>
            <ChatPopup /> {/* Chat disponible sur toutes les pages */}
            <PopupImage />
            <Footer />
            <SocialFollow />
          </Router>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
