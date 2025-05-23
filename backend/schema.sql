CREATE TABLE categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);
CREATE TABLE sqlite_sequence(name,seq);
CREATE TABLE cart (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        productId INTEGER NOT NULL,
                        quantity INTEGER NOT NULL DEFAULT 1, price REAL, clientType TEXT, user_id INTEGER, totalWeight INTEGER DEFAULT 0,
                        FOREIGN KEY(productId) REFERENCES products(id)
                    );
CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    address TEXT,
    city TEXT,
    postalCode TEXT,
    country TEXT,
    phone TEXT,
    deliveryMethod TEXT,
    paymentMethod TEXT,
    items TEXT,
    total REAL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );
CREATE TABLE users (
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
CREATE TABLE popup_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT,
  message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
, title TEXT);
CREATE TABLE recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  steps TEXT,
  image TEXT
);
CREATE TABLE IF NOT EXISTS "products" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  category TEXT,
  unitPrice REAL,
  wholesalePrice REAL,
  image TEXT,
  unit TEXT,
  wholesaleUnit TEXT,
  reduction REAL,
  lotQuantity INTEGER,
  lotPrice REAL,
  inStock INTEGER,
  retailWeight REAL,       -- Ô£à Nouveau nom ici
  wholesaleWeight REAL
, details TEXT);
