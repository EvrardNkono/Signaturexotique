import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [clientType, setClientType] = useState('retail'); // Type de client, par défaut 'retail'

  useEffect(() => {
    // Charger le panier à partir du backend
    fetch(`${API_URL}/modules/cart/cart`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Panier chargé:', data); // Vérifie les données reçues du backend
        setCart(data);
      })
      .catch((err) => console.error('Erreur lors du chargement du panier:', err));
  }, []);

  // Fonction pour vider le panier
  const clearCart = () => {
    setCart([]); // Vide l'état du panier
  };

  // Fonction pour changer le type de client (retail / wholesale)
  const changeClientType = (newClientType) => {
    if (newClientType !== clientType) {
      clearCart(); // Vider le panier si le type de client change
    }
    setClientType(newClientType); // Mettre à jour le type de client
  };

  const addToCart = async (product) => {
    console.log("=== REQUÊTE VERS BACKEND ===");
    console.log("Produit envoyé :", product);
    console.log("Client Type :", clientType);
    console.log("Prix dans body :", product.price);
    console.log('Type de client:', clientType);
    console.log('Prix de gros du produit:', product.wholesalePrice);
    
    try {
      // On vérifie si le client est un grossiste pour utiliser le prix de gros
      const priceToUse = clientType === 'wholesale' ? product.wholesalePrice : product.price;
  
      console.log('Prix à utiliser :', priceToUse);
  
      // Requête POST pour ajouter le produit au panier
      const res = await fetch(`${API_URL}/modules/cart/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          price: priceToUse,  // Le prix calculé selon le type de client
          clientType,         // Le type de client
          unitPrice: product.unitPrice,
          wholesalePrice: product.wholesalePrice
        }),
      });
  
      if (!res.ok) throw new Error('Erreur lors de l’ajout au panier');
  
      // Mettre à jour le panier après l'ajout
      const updatedCart = await fetch(`${API_URL}/modules/cart/cart`).then(res => res.json());
      console.log('Panier mis à jour:', updatedCart);
      setCart(updatedCart);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/modules/cart/cart/${productId}`, {
        method: 'DELETE',
      });
  
      if (!res.ok) throw new Error('Erreur lors de la suppression du produit du panier');
  
      const updatedCart = await fetch(`${API_URL}/modules/cart/cart`).then(res => res.json());
      setCart(updatedCart);
    } catch (err) {
      console.error(err);
    }
  };
  
  const updateCartQuantity = async (cartId, newQuantity) => {
    try {
      const res = await fetch(`${API_URL}/modules/cart/cart/${cartId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });
  
      if (!res.ok) throw new Error('Erreur lors de la mise à jour de la quantité');
  
      const updatedCart = await fetch(`${API_URL}/modules/cart/cart`).then(res => res.json());
      setCart(updatedCart);
    } catch (err) {
      console.error('Erreur de mise à jour :', err);
    }
  };
  
  const clearCartFromBackend = async () => {
    try {
      const res = await fetch(`${API_URL}/modules/cart/cart`, {
        method: 'DELETE',
      });
  
      if (!res.ok) throw new Error('Erreur lors du vidage du panier');
  
      const updatedCart = await fetch(`${API_URL}/modules/cart/cart`).then(res => res.json());
      setCart(updatedCart);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      clientType,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCartFromBackend,
      changeClientType, // Exposer la fonction pour changer le type de client
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart doit être utilisé dans un CartProvider');
  return context;
};
