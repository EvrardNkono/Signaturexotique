const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err.message);
        return;
    }
    console.log('Connexion à la base de données SQLite réussie.');
});

db.serialize(() => {
    // Vérifier si la table 'products' existe déjà
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='products';", (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'existence de la table products :', err.message);
            return;
        }

        if (!row) {
            // Si la table 'products' n'existe pas, alors créer la nouvelle structure
            console.log('Table "products" non trouvée. Création de la nouvelle structure...');
            
            // Création de la table products_new si elle n'existe pas
            db.run(`
                CREATE TABLE IF NOT EXISTS products_new (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    category TEXT NOT NULL,
                    unitPrice REAL NOT NULL,
                    wholesalePrice REAL NOT NULL,
                    image TEXT
                );
            `, (err) => {
                if (err) {
                    console.error('Erreur lors de la création de la table products_new :', err.message);
                } else {
                    console.log('Table "products_new" créée avec succès.');

                    // Copier les données dans la nouvelle table
                    db.run(`
                        INSERT INTO products_new (id, name, category, unitPrice, wholesalePrice, image)
                        SELECT id, name, category, unitPrice, wholesalePrice, image FROM products;
                    `, (err) => {
                        if (err) {
                            console.error('Erreur lors de la copie des données :', err.message);
                        } else {
                            console.log('Données copiées avec succès dans "products_new".');

                            // Supprimer l'ancienne table
                            db.run('DROP TABLE IF EXISTS products;', (err) => {
                                if (err) {
                                    console.error('Erreur lors de la suppression de la table products :', err.message);
                                } else {
                                    console.log('Table "products" supprimée avec succès.');

                                    // Renommer la table "products_new" en "products"
                                    db.run('ALTER TABLE products_new RENAME TO products;', (err) => {
                                        if (err) {
                                            console.error('Erreur lors du renommage de la table :', err.message);
                                        } else {
                                            console.log('Table "products_new" renommée en "products" avec succès.');
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            console.log('La table "products" existe déjà, pas besoin de recréer la structure.');
        }
    });

        // Vérifier si la table 'cart' existe déjà
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='cart';", (err, row) => {
            if (err) {
                console.error('Erreur lors de la vérification de la table cart :', err.message);
                return;
            }
    
            if (!row) {
                console.log('Table "cart" non trouvée. Création de la table cart...');
    
                db.run(`
                    CREATE TABLE cart (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        productId INTEGER NOT NULL,
                        quantity INTEGER NOT NULL DEFAULT 1,
                        FOREIGN KEY(productId) REFERENCES products(id)
                    );
                `, (err) => {
                    if (err) {
                        console.error('Erreur lors de la création de la table cart :', err.message);
                    } else {
                        console.log('Table "cart" créée avec succès.');
                    }
                });
            } else {
                console.log('La table "cart" existe déjà.');
            }
        });
    
});

module.exports = db;
