// Exemple de contrôleur : productController.js
const db = require('../config/db'); // Adapte selon ton modèle de base de données

// Fonction pour récupérer les éléments du panier
async function getCartItems(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT cart.productId, cart.quantity, cart.price, products.category
         FROM cart
         JOIN products ON cart.productId = products.id
         WHERE cart.user_id = ?`,
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
  

// Fonction pour récupérer des produits par catégorie
// Fonction pour récupérer des produits par catégorie
async function getProductsByCategory(category, limit = 2) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM products WHERE category = ? LIMIT ?`,
        [category, limit],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
  

module.exports = {
  getCartItems,
  getProductsByCategory
};
