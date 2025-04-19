const db = require('../config/db');

// Fonction pour récupérer toutes les catégories
const getAllCategories = (callback) => {
    db.all("SELECT * FROM categories", [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
};

// Fonction pour récupérer une catégorie par son ID
const getCategoryById = (id, callback) => {
    db.get("SELECT * FROM categories WHERE id = ?", [id], (err, row) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
};

// Fonction pour créer une catégorie
const createCategory = (name, callback) => {
    db.run("INSERT INTO categories (name) VALUES (?)", [name], function(err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { id: this.lastID, name: name });
        }
    });
};

// Fonction pour supprimer une catégorie
const deleteCategory = (id, callback) => {
    db.run("DELETE FROM categories WHERE id = ?", [id], function(err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { id: id });
        }
    });
};

// Fonction pour mettre à jour une catégorie
const updateCategory = (id, name, callback) => {
    db.run("UPDATE categories SET name = ? WHERE id = ?", [name, id], function(err) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { id: id, name: name });
        }
    });
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    deleteCategory,
    updateCategory
};
