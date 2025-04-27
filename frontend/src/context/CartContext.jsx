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
        // 1. Récupération du token
        const token = localStorage.getItem('token');
        console.log('Token récupéré :', token); // 👀 Vérification immédiate
    
        // 2. Vérification de l'existence du token
        if (!token) {
          console.error('Aucun token trouvé, veuillez vous reconnecter.');
          return; // ⚠️ Stopper ici si pas de token
        }
    
        // 3. Vérification si le token est expiré
        if (isTokenExpired(token)) {
          console.error('Token invalide ou expiré. Redirection vers la page de connexion...');
          // window.location.href = '/login'; // Optionnel selon ton flow
          return;
        }
    
        // 4. Si tout va bien, appel backend
        const res = await fetch(`${API_URL}/modules/cart/cart`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // ✅ Envoi du token
          },
        });
    
        const data = await res.json();
        console.log('Données du backend:', data); // 🔥 Voir ce que renvoie ton backend
    
        // 5. Vérification de la structure des données
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
    
    
    // Fonction pour vérifier si le token est expiré
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
  
      // Vérifie la réponse avant de la traiter
      const data = await res.json();
      console.log('Réponse du backend:', data);
  
      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de l’ajout au panier');
      }
  
      // Si tout se passe bien, mettre à jour le panier
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
  
      // Appel DELETE au backend pour retirer une unité de produit
      const res = await fetch(`${API_URL}/modules/cart/cart/${productId}`, {
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
        const updatedCart = prevCart.map(item => {
          if (item.productId === productId) {
            // Si la quantité est plus grande que 1, on décrémente la quantité
            if (item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
            } else {
              // Si la quantité est 1, on supprime le produit
              return null;
            }
          }
          return item;
        }).filter(item => item !== null); // Filtre pour retirer les éléments null
  
        console.log('Panier mis à jour localement:', updatedCart);
        return updatedCart;
      });
      
      console.log(`Produit avec ID ${productId} retiré du panier.`);
  
    } catch (err) {
      console.error('Erreur:', err);
    }
  };
  
  
  
  
  
  
  

  const updateCartQuantity = async (cartId, newQuantity) => {
    const token = localStorage.getItem('token');
    
    // Vérifier si le token est présent
    if (!token) {
      console.error('Token manquant');
      return; // Sortir de la fonction si le token est manquant
    }
  
    try {
      // Envoi de la requête PUT pour mettre à jour la quantité
      const res = await fetch(`${API_URL}/modules/cart/cart/${cartId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
  
      // Vérification si la requête a échoué
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour de la quantité');
      }
  
      // On suppose que la réponse contient l'élément mis à jour
      const updatedItem = await res.json();
      console.log('Produit mis à jour :', updatedItem);
  
      // Mettre à jour l'état du panier avec la nouvelle quantité
      setCart(prevCart => {
        return prevCart.map(item =>
          item.id === updatedItem.id ? { ...item, quantity: updatedItem.quantity } : item
        );
      });
  
      // Afficher une confirmation dans la console
      console.log('Quantité mise à jour avec succès');
  
    } catch (err) {
      // Gestion des erreurs
      console.error('Erreur de mise à jour du panier :', err.message);
    }
  };
  

  const clearCartFromBackend = async () => {
    try {
      const res = await fetch(`${API_URL}/modules/cart/cart`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Erreur lors du vidage du panier');

      const updatedCart = await fetch(`${API_URL}/modules/cart/cart`).then(res => res.json());
      console.log('Données du backend:', updatedCart);
      
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
