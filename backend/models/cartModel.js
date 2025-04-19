const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Assure-toi que sequelize est configuré

const Cart = sequelize.define('Cart', {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  // Tu peux ajouter d'autres champs si nécessaire, comme userId pour lier à un utilisateur
});

module.exports = Cart;
