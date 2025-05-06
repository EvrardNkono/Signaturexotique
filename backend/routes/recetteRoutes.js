const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recetteControllers');

// 🔧 Chemin absolu vers le dossier public/uploads
const uploadPath = path.join(__dirname, '../public/uploads');


// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // Enregistre dans le bon dossier
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'recette_' + Date.now() + ext); // Nom unique pour chaque image
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'), false);
    }
  },
});

// Routes API
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);
router.post('/', upload.single('image'), createRecipe);  // Upload d'une image unique
router.put('/:id', upload.single('image'), updateRecipe);  // Upload d'une image unique
router.delete('/:id', deleteRecipe);

module.exports = router;
