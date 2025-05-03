import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Initialisation du panier avec un tableau vide
  const [clientType, setClientType] = useState('retail'); // Type de client, par défaut 'retail'

  useEffect(() => {
    // Charger le panier à partir du backend
    const loadCart = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token récupéré :', token); // 👀 Vérification immédiate
    
        if (!token) {
          console.error('Aucun token trouvé, veuillez vous reconnecter.');
          return; // ⚠️ Stopper ici si pas de token
        }
    
        if (isTokenExpired(token)) {
          console.error('Token invalide ou expiré. Redirection vers la page de connexion...');
          return;
        }
    
        const res = await fetch(`${API_URL}/modules/cart/cart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // ✅ Envoi du token
          },
        });
    
        const data = await res.json();
        console.log('Données du backend:', data); // 🔥 Voir ce que renvoie ton backend
    
        if (Array.isArray(data)) {
          console.log('Panier chargé:', data);
          setCart(data);
        } else {
          console.error('Le panier reçu n\'est pas un tableau:', data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du panier:', err);
      }
    };
    
    const isTokenExpired = (token) => {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));  // Décode le payload du JWT
        const exp = decoded.exp;  // Date d'expiration du token
        const currentTime = Date.now() / 1000;  // Temps actuel en secondes
        return exp < currentTime;
      } catch (e) {
        console.error('Erreur lors de la vérification du token:', e);
        return true;  // Si le décodage échoue, on suppose que le token est invalide
      }
    };
    
    loadCart();
  }, []);

  const clearCart = () => {
    setCart([]); // Vide l'état du panier
  };

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
      const priceToUse = clientType === 'wholesale' ? product.wholesalePrice : product.price;
  
      console.log('Prix à utiliser :', priceToUse);
  
      const res = await fetch(`${API_URL}/modules/cart/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assurez-vous que le token est bien ajouté ici
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          price: priceToUse,  
          clientType,         
          unitPrice: product.unitPrice,
          wholesalePrice: product.wholesalePrice
        }),
      });
  
      const data = await res.json();
      console.log('Réponse du backend:', data);
  
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’ajout au panier');
      }
  
      const updatedCartResponse = await fetch(`${API_URL}/modules/cart/cart`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const updatedCart = await updatedCartResponse.json();
      console.log('Réponse du panier mis à jour:', updatedCart);  // Ajoute ceci pour debugger

      if (Array.isArray(updatedCart)) {
        console.log('Panier mis à jour:', updatedCart);
        setCart(updatedCart);
      } else {
        console.error('Erreur: Le panier mis à jour n\'est pas un tableau.', updatedCart);
      }
    } catch (err) {
      console.error('Erreur:', err);
    }
  };
  
  const removeFromCart = async (productId) => {
    console.log("=== REQUÊTE DE SUPPRESSION VERS BACKEND ===");
    console.log("Produit à retirer ID :", productId);
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token manquant, impossible de continuer.');
      }
  
      const res = await fetch(`${API_URL}/modules/cart/cart/${productId}?force=true`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression du produit du panier');
      }
  
      // Mise à jour de l'état local sans refaire une requête GET
      setCart(prevCart => {
        const updatedCart = prevCart.filter(item => item.productId !== productId);
        console.log('Panier mis à jour localement après suppression complète :', updatedCart);
        return updatedCart;
      });
      
      
      console.log(`Produit avec ID ${productId} retiré du panier.`);
  
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  const updateCartQuantity = async (cartId, newQuantity) => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('Token manquant');
      return;
    }
  
    try {
      const res = await fetch(`${API_URL}/modules/cart/cart/${cartId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
  
      const data = await res.json();
  
      // Vérifie la validité de la réponse du serveur avant d'aller plus loin
      if (!res.ok || !data.id || !data.quantity) {
        throw new Error(data.error || 'Erreur lors de la mise à jour de la quantité');
      }
  
      console.log('Réponse du serveur:', data);
  
      // Met à jour le panier dans l'état global
      setCart(prevCart => {
        const updatedCart = prevCart.map(item =>
          item.id === data.id ? { ...item, quantity: data.quantity } : item
        );
        console.log('Panier après mise à jour dans CartContext:', updatedCart);
        return updatedCart;
      });
  
      console.log('Quantité mise à jour avec succès');
    } catch (err) {
      console.error('Erreur de mise à jour du panier :', err.message);
    }
  };
  
  
  
  

  const clearCartFromBackend = async () => {
    try {
      const token = localStorage.getItem('authToken');
  
      const res = await fetch(`${API_URL}/modules/cart/cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (!res.ok) throw new Error('Erreur lors du vidage du panier');
  
      const updatedCart = await fetch(`${API_URL}/modules/cart/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }).then(res => res.json());
  
      console.log('Données du backend après vidage:', updatedCart);
  
      if (Array.isArray(updatedCart)) {
        setCart(updatedCart);
      } else {
        console.error('Erreur: Le panier mis à jour n\'est pas un tableau.', updatedCart);
      }
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
      changeClientType, 
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
