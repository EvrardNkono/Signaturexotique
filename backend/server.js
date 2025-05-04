const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();

// Crée le dossier des uploads si nécessaire
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Dossier uploads créé automatiquement.');
}

// Middleware
app.use(cors());

app.use(express.json()); // Suffit, plus besoin de body-parser
app.use('/uploads', express.static(uploadDir)); // Sert les images

// Importation des routes admin
const categoryRoutes = require('./modules/admin/category');
const productRoutes = require('./modules/admin/product');
const filterRoutes = require('./modules/admin/filter'); // ✅ Corrigé ici
const orderRoutes = require('./modules/checkout');
const searchRoutes = require('./modules/admin/search');
const emailRoutes = require('./modules/contact/emailRoutes'); // Importer les routes d'email
// J’importe les routes d’authentification
const authRoutes = require('./modules/auth/auth');
const categoryHomeRouter = require('./modules/admin/categoryhome');
const recommendationRoutes = require('./routes/recommendations');
const stripeRoutes = require('./modules/payement/stripe'); // adapte selon ton arborescence
const popupRoutes = require('./modules/admin/popup');

// Utilisation des routes
app.use('/admin/category', categoryRoutes);
app.use('/admin/product', productRoutes);
app.use('/admin', filterRoutes); // Contient le GET /admin/product?...
// J’active les routes d’authentification sur /auth
app.use('/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

 // Met à jour avec le nouveau nom du fichier

// Autres middlewares ou configurations ici


// Route test
app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.send('Test successful');
});

// Route panier (cart)
const cartRoutes = require('./modules/cart/cart');
app.use('/modules/cart/cart', cartRoutes); // POST /api/cart, GET /api/cart, etc.
app.use('/modules/checkout', orderRoutes);
// Route de recherche spécifique
app.use('/admin/search', searchRoutes);  // Utiliser la route de recherche ici
app.use('/admin/categoryhome', categoryHomeRouter); // Utiliser les routes de catégorie
app.use('/modules/contact/emailRoutes', emailRoutes);
app.use('/routes/recommendations', recommendationRoutes);
app.use('/admin', popupRoutes); // pour POST
app.use('/', popupRoutes); // pour GET /popup
app.use('/payement', stripeRoutes);

// Lancement du serveur
app.listen(5000, () => {
  console.log('🚀 Serveur backend démarré sur http://localhost:5000');
});
