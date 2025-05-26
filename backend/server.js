const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const { fileTypeFromBuffer } = require('file-type');

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Importation des routes admin
const categoryRoutes = require('./modules/admin/category');
const productRoutes = require('./modules/admin/product');
const filterRoutes = require('./modules/admin/filter'); // ✅ Corrigé ici
//const orderRoutes = require('./modules/checkout');
const searchRoutes = require('./modules/admin/search');
const emailRoutes = require('./modules/contact/emailRoutes'); // Importer les routes d'email
// J’importe les routes d’authentification
const authRoutes = require('./modules/auth/auth');
const categoryHomeRouter = require('./modules/admin/categoryhome');
const recommendationRoutes = require('./routes/recommendations');
const stripeRoutes = require('./modules/payement/stripe'); // adapte selon ton arborescence
const popupRoutes = require('./modules/admin/popup');
const recetteRoutes = require('./routes/recetteRoutes');
const orderRoutes = require('./routes/order');  // Importer la route de commande
const chatRoute = require('./routes/chat');  // Utilisation de require
const catalogueRoutes = require('./modules/routes/catalogue');
const contactMailRoute = require('./modules/routes/contactmail');
const usersRoutes = require('./modules/routes/users');



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
//app.use('/modules/checkout', orderRoutes);
// Route de recherche spécifique
app.use('/admin/search', searchRoutes);  // Utiliser la route de recherche ici
app.use('/admin/categoryhome', categoryHomeRouter); // Utiliser les routes de catégorie
app.use('/modules/contact/emailRoutes', emailRoutes);
app.use('/routes/recommendations', recommendationRoutes);
app.use('/admin', popupRoutes); // pour POST
app.use('/', popupRoutes); // pour GET /popup
app.use('/stripe', stripeRoutes); // au lieu de /payement


app.use('/recetteRoutes', recetteRoutes); // les routes des recettes sont maintenant accessibles via /api/recettes
app.use('/orderRoutes', orderRoutes);
app.use('/chat', chatRoute);
app.use('/routes/catalogue', catalogueRoutes);
app.use('/routes/contactmail', contactMailRoute)
app.use('/users', usersRoutes);


app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});



// Route TEMPORAIRE pour télécharger la DB
app.get('/download-db', (req, res) => {
  const dbPath = path.join(__dirname, 'database.db'); // Ton vrai fichier ici
  res.download(dbPath, 'database.db', err => {
    if (err) {
      console.error('Erreur lors du téléchargement :', err);
      res.status(500).send('Erreur de téléchargement');
    }
  });
});



// ⚠️ Route publique TEMPORAIRE pour télécharger les images

app.get('/download-images', async (req, res) => {
  const folderPath = path.join(__dirname, 'public', 'uploads');

  if (!fs.existsSync(folderPath)) {
    return res.status(404).send('Dossier introuvable');
  }

  res.setHeader('Content-Disposition', 'attachment; filename=images-renommees.zip');
  res.setHeader('Content-Type', 'application/zip');

  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);

  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const buffer = fs.readFileSync(filePath);

    const fileType = await fileTypeFromBuffer(buffer);
    if (!fileType) {
      console.warn(`Type de fichier inconnu pour : ${file}`);
      continue;
    }

    // Nom de fichier sans extension d’origine
    const baseName = path.parse(file).name;

    // Nouveau nom avec la bonne extension détectée
    const correctedFileName = `${baseName}.${fileType.ext}`;

    // Ajouter dans l’archive sous le nouveau nom
    archive.append(buffer, { name: correctedFileName });
  }


  
  archive.finalize();
});




// Lancement du serveur
app.listen(5000, () => {
  console.log('🚀 Serveur backend démarré sur http://localhost:5000');
});
