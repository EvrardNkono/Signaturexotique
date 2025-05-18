CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

-- `sqlite_sequence` n'est pas utile en PostgreSQL, à ignorer/supprimer

CREATE TABLE cart (
  id SERIAL PRIMARY KEY,
  productId INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC,
  clientType VARCHAR(50),
  user_id INTEGER,
  totalWeight INTEGER DEFAULT 0,
  FOREIGN KEY(productId) REFERENCES products(id)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  postalCode VARCHAR(20),
  country VARCHAR(100),
  phone VARCHAR(20),
  deliveryMethod VARCHAR(100),
  paymentMethod VARCHAR(100),
  items TEXT,
  total NUMERIC,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mot_de_passe TEXT NOT NULL,
  role VARCHAR(50) DEFAULT 'client',
  num_tel VARCHAR(20),
  adresse TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE popup_settings (
  id SERIAL PRIMARY KEY,
  image_url TEXT,
  message TEXT,
  title TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  ingredients TEXT,
  steps TEXT,
  image TEXT
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  category VARCHAR(255),
  unitPrice NUMERIC,
  wholesalePrice NUMERIC,
  image TEXT,
  unit VARCHAR(50),
  wholesaleUnit VARCHAR(50),
  reduction NUMERIC,
  lotQuantity INTEGER,
  lotPrice NUMERIC,
  inStock INTEGER,
  retailWeight NUMERIC,
  wholesaleWeight NUMERIC,
  details TEXT
);
