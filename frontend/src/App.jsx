import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import Cart from './pages/Cart';
import Contact from './pages/Contact';

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
import DeliveryForm from './pages/DeliveryForm';
import ChatPopup from "./components/ChatPopup";
import DeliveryPage from "./pages/DeliveryPage";
import SendParcelForm from "./components/SendParcelForm";
import ScrollToTop from './components/ScrollToTop';

// ✅ Imports pour la nouvelle structure admin
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Recipes from './pages/Recipes';
import PopupImages from './pages/PopupImages';
import Orders from './pages/Orders';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <SearchProvider>
          <Router>
            <ScrollToTop />
            <Header />
            <main>
              <Routes>
                {/* 🌍 Site public */}
                <Route path="/" element={<Home />} />
                <Route path="/catalogue" element={<Catalogue />} />
                <Route path="/bonplans" element={<BonPlans />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/recettes" element={<RecipePage />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/livraison" element={<DeliveryPage />} />
                <Route path="/newsletter" element={<NewsletterPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/delivery" element={<DeliveryForm />} />
                <Route path="/envoyer-colis" element={<SendParcelForm />} />

                {/* 🔒 Zone admin sécurisée */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute allowedRoles={['admin', 'superadmin']}>
                      <AdminLayout />
                    </PrivateRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="users" element={<Users />} />
                  <Route path="recipes" element={<Recipes />} />
                  <Route path="popup-images" element={<PopupImages />} />
                  <Route path="orders" element={<Orders />} />
                </Route>

                {/* En cas d’accès refusé */}
                <Route path="/access-denied" element={<AccessDenied />} />
              </Routes>
            </main>

            <ChatPopup />
            <PopupImage />
            <Footer />
            <SocialFollow />
            <ToastContainer />
          </Router>
        </SearchProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
