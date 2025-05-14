PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);
INSERT INTO categories VALUES(1,'papm');
INSERT INTO categories VALUES(2,'Ivana');
INSERT INTO categories VALUES(3,'Ivana Ivana');
INSERT INTO categories VALUES(4,'Evrard');
INSERT INTO categories VALUES(5,'aaa');
INSERT INTO categories VALUES(6,'Fruits tropicaux');
INSERT INTO categories VALUES(7,'vintadge');
INSERT INTO categories VALUES(8,'tito');
CREATE TABLE cart (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        productId INTEGER NOT NULL,
                        quantity INTEGER NOT NULL DEFAULT 1, price REAL, clientType TEXT, user_id INTEGER, totalWeight INTEGER DEFAULT 0,
                        FOREIGN KEY(productId) REFERENCES products(id)
                    );
INSERT INTO cart VALUES(129,1,1,17.0,'retail',5,0);
INSERT INTO cart VALUES(130,4,3,122.0,'retail',5,0);
INSERT INTO cart VALUES(212,18,2,4.0,'retail',5,0);
INSERT INTO cart VALUES(272,1,2,2.0,'retail',1,300);
INSERT INTO cart VALUES(273,2,7,1.0,'retail',1,700);
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
INSERT INTO orders VALUES(1,'SIGFRIED EVRARD','MOUZONG NKONO','3232','FSF','123123','Cameroun','698011521','standard','cod','[{"id":55,"productId":4,"quantity":6,"name":"Cadji bierre","unitPrice":122,"image":"image-1744958229475-256989757.png"},{"id":56,"productId":5,"quantity":6,"name":"Bissap","unitPrice":12,"image":"image-1744958099584-6488733.png"},{"id":57,"productId":6,"quantity":4,"name":"Bananes","unitPrice":21,"image":"image-1744957798735-81480575.png"},{"id":58,"productId":7,"quantity":6,"name":"Avocats","unitPrice":10,"image":"image-1744956586167-479291767.png"}]',948.0,'2025-04-18 08:50:30');
INSERT INTO orders VALUES(2,'Ivana','Ivana','ivana-ne-me-deteste-pas','FSF','123123','Cameroun','0698011521','standard','cod','[{"id":59,"productId":1,"quantity":1,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"},{"id":60,"productId":4,"quantity":1,"name":"Cadji bierre","unitPrice":122,"image":"image-1744958229475-256989757.png"}]',139.0,'2025-04-18 09:11:30');
INSERT INTO orders VALUES(3,'Ronny','Bidias','ivana-ne-me-deteste-pas','FSF','123123','Cameroun','0698011521','standard','cod','[{"id":79,"productId":1,"quantity":3,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"},{"id":80,"productId":4,"quantity":2,"name":"Cadji bierre","unitPrice":122,"image":"image-1744958229475-256989757.png"}]',295.0,'2025-04-18 12:59:20');
INSERT INTO orders VALUES(4,'Ronny','Bidias','ivana-ne-me-deteste-pas','FSF','123123','Cameroun','0698011521','standard','cod','[{"id":82,"productId":1,"quantity":1,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"}]',17.0,'2025-04-18 13:06:05');
INSERT INTO orders VALUES(5,'SIGFRIED EVRARD','MOUZONG NKONO','3232','FSF','123123','Cameroun','698011521','standard','cod','[{"id":92,"productId":1,"quantity":5,"price":17,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"},{"id":93,"productId":5,"quantity":3,"price":12,"name":"Bissap","unitPrice":12,"image":"image-1744958099584-6488733.png"},{"id":94,"productId":4,"quantity":3,"price":122,"name":"Cadji bierre","unitPrice":122,"image":"image-1744958229475-256989757.png"}]',487.0,'2025-04-18 15:53:12');
INSERT INTO orders VALUES(6,'SIGFRIED EVRARD','MOUZONG NKONO','3232','FSF','123123','Cameroun','698011521','standard','cod','[{"id":92,"productId":1,"quantity":5,"price":17,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"},{"id":93,"productId":5,"quantity":3,"price":12,"name":"Bissap","unitPrice":12,"image":"image-1744958099584-6488733.png"},{"id":94,"productId":4,"quantity":3,"price":122,"name":"Cadji bierre","unitPrice":122,"image":"image-1744958229475-256989757.png"}]',487.0,'2025-04-18 15:56:55');
INSERT INTO orders VALUES(7,'SIGFRIED EVRARD','MOUZONG NKONO','3232','FSF','123123','Cameroun','698011521','standard','cod','[{"id":92,"productId":1,"quantity":5,"price":17,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"},{"id":93,"productId":5,"quantity":3,"price":12,"name":"Bissap","unitPrice":12,"image":"image-1744958099584-6488733.png"},{"id":94,"productId":4,"quantity":3,"price":122,"name":"Cadji bierre","unitPrice":122,"image":"image-1744958229475-256989757.png"}]',487.0,'2025-04-18 16:20:54');
INSERT INTO orders VALUES(8,'SIGFRIED EVRARD','MOUZONG NKONO','3232','FSF','123123','Cameroun','698011521','standard','cod','[{"id":92,"productId":1,"quantity":5,"price":17,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"},{"id":93,"productId":5,"quantity":3,"price":12,"name":"Bissap","unitPrice":12,"image":"image-1744958099584-6488733.png"},{"id":94,"productId":4,"quantity":3,"price":122,"name":"Cadji bierre","unitPrice":122,"image":"image-1744958229475-256989757.png"}]',487.0,'2025-04-18 16:34:04');
INSERT INTO orders VALUES(9,'SIGFRIED EVRARD','MOUZONG NKONO','3232','FSF','123123','Cameroun','698011521','standard','cod','[{"id":92,"productId":1,"quantity":5,"price":17,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"},{"id":93,"productId":5,"quantity":3,"price":12,"name":"Bissap","unitPrice":12,"image":"image-1744958099584-6488733.png"},{"id":94,"productId":4,"quantity":3,"price":122,"name":"Cadji bierre","unitPrice":122,"image":"image-1744958229475-256989757.png"}]',487.0,'2025-04-18 16:35:22');
INSERT INTO orders VALUES(10,'SIGFRIED EVRARD','MOUZONG NKONO','3232','FSF','123123','Cameroun','698011521','standard','cod','[{"id":92,"productId":1,"quantity":5,"price":17,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"},{"id":93,"productId":5,"quantity":3,"price":12,"name":"Bissap","unitPrice":12,"image":"image-1744958099584-6488733.png"},{"id":94,"productId":4,"quantity":3,"price":122,"name":"Cadji bierre","unitPrice":122,"image":"image-1744958229475-256989757.png"}]',487.0,'2025-04-18 16:36:16');
INSERT INTO orders VALUES(11,'SIGFRIED EVRARD','MOUZONG NKONO','3232','FSF','123123','Cameroun','698011521','standard','cod','[{"id":92,"productId":1,"quantity":5,"price":17,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"},{"id":93,"productId":5,"quantity":3,"price":12,"name":"Bissap","unitPrice":12,"image":"image-1744958099584-6488733.png"},{"id":94,"productId":4,"quantity":3,"price":122,"name":"Cadji bierre","unitPrice":122,"image":"image-1744958229475-256989757.png"}]',487.0,'2025-04-18 16:47:57');
INSERT INTO orders VALUES(12,'SIGFRIED EVRARD','MOUZONG NKONO','3232','FSF','123123','Cameroun','698011521','standard','cod','[{"id":95,"productId":1,"quantity":2,"price":17,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"},{"id":96,"productId":4,"quantity":2,"price":122,"name":"Cadji bierre","unitPrice":122,"image":"image-1744958229475-256989757.png"},{"id":97,"productId":5,"quantity":2,"price":12,"name":"Bissap","unitPrice":12,"image":"image-1744958099584-6488733.png"},{"id":98,"productId":7,"quantity":1,"price":10,"name":"Avocats","unitPrice":10,"image":"image-1744956586167-479291767.png"},{"id":99,"productId":6,"quantity":1,"price":21,"name":"Bananes","unitPrice":21,"image":"image-1744957798735-81480575.png"},{"id":100,"productId":10,"quantity":1,"price":34,"name":"Poivre blanc","unitPrice":34,"image":"image-1744970836524-605304246.jpeg"},{"id":101,"productId":11,"quantity":3,"price":45,"name":"Poivre noir","unitPrice":45,"image":null}]',502.0,'2025-04-18 16:49:20');
INSERT INTO orders VALUES(13,'SIGFRIED EVRARD','MOUZONG NKONO','3232','FSF','123123','Cameroun','698011521','standard','cod','[]',0.0,'2025-04-18 16:49:53');
INSERT INTO orders VALUES(14,'SIGFRIED EVRARD','MOUZONG NKONO','3232','FSF','123123','Cameroun','698011521','standard','cod','[{"id":102,"productId":5,"quantity":7,"price":12,"name":"Bissap","unitPrice":12,"image":"image-1744958099584-6488733.png"},{"id":103,"productId":4,"quantity":4,"price":122,"name":"Cadji bierre","unitPrice":122,"image":"image-1744958229475-256989757.png"},{"id":104,"productId":1,"quantity":3,"price":17,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"}]',623.0,'2025-04-18 20:22:37');
INSERT INTO orders VALUES(15,'SIGFRIED EVRARD','MOUZONG NKONO','3232','FSF','123123','Cameroun','698011521','standard','cod','[{"id":123,"productId":1,"quantity":2,"price":17,"name":"Pasteque","unitPrice":17,"image":"image-1744958753452-395780409.png"}]',34.0,'2025-04-26 07:22:11');
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
INSERT INTO users VALUES(1,'Super Admin','superadmin@gmail.com','$2b$10$bPuirPHZec2a0cmCalIo1.yP9EhgB4hFreeTcXk/q1kCuxeCvnq4a','superadmin','0123456789','123 rue de l''admin','2025-04-23 11:07:54','2025-04-23 11:07:54',1);
INSERT INTO users VALUES(2,'John Doe','johndoe@gmail.com','$2b$10$HII43lOOTAmFbf9RXL3lJOjnFGS40kRF8.h5bXuCZuVLjLQmmOBze','client','0123456789','456 rue de l''exemple','2025-04-23 12:39:05','2025-04-23 12:39:05',1);
INSERT INTO users VALUES(3,'Nom Utilisateur','exemple@domaine.com','$2b$10$QII37sTiohjZCBkFHZUrf.4YX6dXVbO9llTLVQz/GyOzyoIwlvfdS','client','0123456789','123 rue de l''utilisateur','2025-04-23 14:21:31','2025-04-23 14:21:31',1);
INSERT INTO users VALUES(4,'ass','superadmi@gmail.com','$2b$10$03eXqy8UutAgbdmYIonv.O2jLl2qhIq2jJXHEbd6xpYD1kFtMIZqy','superadmin','0698011521','asdsa','2025-04-23 14:31:47','2025-04-23 14:31:47',1);
INSERT INTO users VALUES(5,'SIGFRIED EVRARD MOUZONG NKONO','evrardnkono870@gmail.com','$2b$10$ymtAYeKmhdNY5xihdbnlKuTjOio0jl2qftOdVZ3n/mcoOu4Hi2mj.','client','698011521','3232','2025-04-24 07:54:06','2025-04-24 07:54:06',1);
CREATE TABLE popup_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_url TEXT,
  message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
, title TEXT);
INSERT INTO popup_settings VALUES(28,'/uploads/popup_1746537888394','rare image de personnes admirant la beaute de Evrard','2025-05-06 13:24:48','Evrard Est Beau');
INSERT INTO popup_settings VALUES(29,'/uploads/popup_1746345365344.png','toto','2025-05-06 13:24:48','');
INSERT INTO popup_settings VALUES(30,'/uploads/popup_1746346024694','asd','2025-05-06 13:24:48','');
CREATE TABLE recipes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  steps TEXT,
  image TEXT
);
INSERT INTO recipes VALUES(16,'Eru','Plat traditionnel camerounais très populaire, particulièrement chez les populations de la région du Sud-Ouest. Il est préparé à base de feuilles d''eru (ou okok), de waterleaf et de viande ou poisson fumé. Riche, savoureux, et très nutritif.','["[","\"500g de feuilles d''eru (ou okok), lavées et hachées\",","\"1kg de waterleaf ou d''épinards frais\",","\"300g de viande (boeuf, peau de boeuf, tripes…)\",","\"200g de poisson fumé ou séché\",","\"100g de crevettes séchées (optionnel)\",","\"Huile de palme (environ 200ml)\",","\"2 cubes d’assaisonnement\",","\"Sel au goût\",","\"Piment selon préférence\"","]"]','["[","\"Faire bouillir la viande et les tripes avec un peu de sel et les cubes jusqu''à ce qu''elles soient tendres.\",","\"Ajouter le poisson fumé (et les crevettes si utilisées) et laisser mijoter 10 minutes.\",","\"Ajouter les feuilles de waterleaf (ou épinards) finement coupées. Laisser cuire jusqu''à ce que l''eau soit presque évaporée.\",","\"Ajouter ensuite les feuilles d’eru progressivement, bien remuer à chaque ajout.\",","\"Verser l’huile de palme chaude sur le mélange. Bien remuer et laisser mijoter à feu doux pendant environ 15 minutes.\",","\"Rectifier l’assaisonnement et ajouter le piment.\",","\"Servir chaud avec du gari, du water-fufu ou du manioc.\"","]"]','/uploads/recette_1746688985310.jpg');
INSERT INTO recipes VALUES(17,'qw','qwe','["qwe"]','["qwe"]','/uploads/recette_1746517274886.png');
INSERT INTO recipes VALUES(18,'mama','mamamama','["[\"qwewqewqe\",\"sadsadsad\",\"sdasdsadasd\"]"]','["[\"asdsadsafasdsadsadsad\",\"dfdfadsadsadjtgybhjfas\",\"dsajdgyugjhajsdhsakd\",\"asdjhsgadjsdbsahdkjsahdkd\"]"]','/uploads/recette_1746517784404.png');
INSERT INTO recipes VALUES(19,'1poiiuio','hgfh','["hdfhtjgfy"]','["ytfvj"]','/uploads/recette_1746518096097.png');
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
  retailWeight REAL,       -- ✅ Nouveau nom ici
  wholesaleWeight REAL
, details TEXT);
INSERT INTO sqlite_sequence VALUES('categories',8);
INSERT INTO sqlite_sequence VALUES('cart',273);
INSERT INTO sqlite_sequence VALUES('orders',15);
INSERT INTO sqlite_sequence VALUES('users',5);
INSERT INTO sqlite_sequence VALUES('popup_settings',30);
INSERT INTO sqlite_sequence VALUES('recipes',19);
INSERT INTO sqlite_sequence VALUES('products',2);
COMMIT;
