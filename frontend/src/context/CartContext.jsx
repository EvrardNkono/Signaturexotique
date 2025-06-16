import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_URL } from '../config';

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    console.error("Erreur lors de la vérification du token :", error);
    return true; // On considère qu'il est expiré en cas de problème
  }
}

const CartContext = createContext();
const token = localStorage.getItem('token');
const isLoggedIn = token && !isTokenExpired(token); // Nouvelle variable

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]); // Initialisation du panier avec un tableau vide
  const [clientType, setClientType] = useState('retail'); // Type de client, par défaut 'retail'

  useEffect(() => {
    // Charger le panier à partir du backend
    const loadCart = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Token récupéré :', token); // 👀 Vérification immédiate
    
        if (!token || isTokenExpired(token)) {
  console.log('Utilisateur non connecté, chargement du panier local.');
  const localCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
  setCart(localCart);
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
  const [lastAddedItem, setLastAddedItem] = useState(null);

  const addToCart = async (product, quantity) => {
    console.log("=== REQUÊTE VERS BACKEND ===");
    console.log("Produit envoyé :", product);
    console.log("Client Type :", clientType);
    console.log("Prix dans body :", product.price);
    console.log('Type de client:', clientType);
    console.log('Prix de gros du produit:', product.wholesalePrice);
  
    try {
      if (!isLoggedIn) {
  const guestCart = [...cart];
  const existingProduct = guestCart.find(item => item.productId === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    guestCart.push({
      productId: product.id,
      quantity: 1,
      price: clientType === 'wholesale' ? product.wholesalePrice : product.price,
      name: product.name,
      image: product.image,
    });
  }

  setCart(guestCart);
  localStorage.setItem('guest_cart', JSON.stringify(guestCart));
  setLastAddedItem({ ...product, quantity: 1 });
  return;
}

      // Vérification si le prix est disponible
      const priceToUse = clientType === 'wholesale' && product.wholesalePrice ? product.wholesalePrice : product.price;
  
      if (!priceToUse) {
        console.error('Le prix du produit est manquant !');
        alert('Ce produit n\'a pas de prix disponible.');
        return; // Arrête la fonction si le prix est manquant
      }
  
      console.log('Prix à utiliser :', priceToUse);
  
      // Vérifier si le produit est déjà dans le panier
      const existingProduct = cart.find(item => item.productId === product.id);
  
      if (existingProduct) {
        // Si le produit existe, mettre à jour la quantité
        const updatedCart = cart.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setCart(updatedCart); // Met à jour le panier dans l'état local
  
        // Mettre à jour le panier côté backend
        await updateCartQuantity(existingProduct.id, existingProduct.quantity + 1);
      } else {
        // Si le produit n'est pas dans le panier, on l'ajoute
        const res = await fetch(`${API_URL}/modules/cart/cart`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
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
  
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Erreur lors de l’ajout au panier');
        }
  
        const data = await res.json();
        console.log('Réponse du backend:', data);
  
        // Récupérer le panier mis à jour après ajout
        const updatedCartResponse = await fetch(`${API_URL}/modules/cart/cart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!updatedCartResponse.ok) {
          throw new Error('Erreur lors de la récupération du panier mis à jour');
        }
  
        const updatedCart = await updatedCartResponse.json();
        console.log('Réponse du panier mis à jour:', updatedCart);
  
        if (Array.isArray(updatedCart)) {
          console.log('Panier mis à jour:', updatedCart);
          setCart(updatedCart);
        } else {
          console.error('Erreur: Le panier mis à jour n\'est pas un tableau.', updatedCart);
        }
      }
    } catch (err) {
      console.error('Erreur:', err);
      alert('Une erreur est survenue lors de l\'ajout au panier.');
    }
    setLastAddedItem({ ...product, quantity });
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
      lastAddedItem, 
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
