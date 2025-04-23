const sqlite3 = require('sqlite3').verbose(); // J’importe sqlite3 avec son mode verbeux pour avoir des messages plus parlants

// Je crée une nouvelle instance de base de données, stockée dans le fichier 'database.db'
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err.message); // Si ça foire, je log l’erreur
        return;
    }
    console.log('Connexion à la base de données SQLite réussie.'); // Sinon, tout roule !
});

db.serialize(() => {
    // === Vérification et création de la table 'products' ===
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='products';", (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification de l\'existence de la table products :', err.message);
            return;
        }

        if (!row) {
            console.log('Table "products" non trouvée. Création de la nouvelle structure...');
            
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

                    db.run(`
                        INSERT INTO products_new (id, name, category, unitPrice, wholesalePrice, image)
                        SELECT id, name, category, unitPrice, wholesalePrice, image FROM products;
                    `, (err) => {
                        if (err) {
                            console.error('Erreur lors de la copie des données :', err.message);
                        } else {
                            console.log('Données copiées avec succès dans "products_new".');

                            db.run('DROP TABLE IF EXISTS products;', (err) => {
                                if (err) {
                                    console.error('Erreur lors de la suppression de la table products :', err.message);
                                } else {
                                    console.log('Table "products" supprimée avec succès.');

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

    // === Vérification et création de la table 'cart' ===
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

    // === Vérification et création de la table 'users' ===
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users';", (err, row) => {
        if (err) {
            console.error('Erreur lors de la vérification de la table users :', err.message);
            return;
        }

        if (!row) {
            console.log('Table "users" non trouvée. Création de la table users...');

            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nom TEXT NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    mot_de_passe TEXT NOT NULL,
                    role TEXT DEFAULT 'client',
                    num_tel TEXT,
                    adresse TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT 1
                );
            `, (err) => {
                if (err) {
                    console.error('Erreur lors de la création de la table users :', err.message);
                } else {
                    console.log('Table "users" créée avec succès.');

                    // Ajout automatique d’un superadmin si la table est vide
                    db.get("SELECT COUNT(*) AS count FROM users;", (err, row) => {
                        if (err) {
                            console.error('Erreur lors de la vérification du nombre d\'utilisateurs :', err.message);
                        } else if (row.count === 0) {
                            console.log('Ajout du superadmin par défaut...');
                            const stmt = db.prepare(`
                                INSERT INTO users (nom, email, mot_de_passe, role, num_tel, adresse)
                                VALUES (?, ?, ?, ?, ?, ?)
                            `);
                            stmt.run(
                                'Super Admin',
                                'superadmin@gmail.com',
                                'superadmin1', // À remplacer par un mot de passe *réellement* hashé
                                'superadmin',
                                '0123456789',
                                '123 rue de l\'admin'
                            );
                            stmt.finalize();
                        }
                    });
                }
            });
        } else {
            console.log('La table "users" existe déjà.');
        }
    });

});
db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      console.error('Erreur de requête :', err);
      return;
    }
    console.log('Utilisateurs dans la base :', rows);
  });
  

module.exports = db; // J’exporte la base pour qu’elle soit accessible dans les autres fichiers du projet

