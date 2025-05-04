const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../../config/db'); // adapte selon ton projet

const router = express.Router();

// Configuration de multer pour accepter plusieurs fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, 'popup_' + Date.now() + path.extname(file.originalname)); // Nom unique pour chaque fichier
  }
});

const upload = multer({ storage });

// POST /admin/popup pour accepter jusqu'à 3 fichiers
router.post('/popup', upload.array('images'), async (req, res) => {
    try {
      const messages = [
        req.body.message_1 || null,
        req.body.message_2 || null,
        req.body.message_3 || null
      ];
  
      const existingImages = [
        req.body.existing_image_1 || null,
        req.body.existing_image_2 || null,
        req.body.existing_image_3 || null
      ];
  
      const newImages = Array(3).fill(null);
      if (req.files) {
        req.files.forEach((file, i) => {
          const index = parseInt(file.originalname.split('_')[1]) - 1; // image_1, image_2...
          newImages[index] = '/uploads/' + file.filename;
        });
      }
  
      // Supprimer les anciennes entrées et remettre les nouvelles
      await db.run('DELETE FROM popup_settings');
  
      const values = [];
      for (let i = 0; i < 3; i++) {
        const image = newImages[i] || existingImages[i] || null;
        const message = messages[i] || '';
        values.push(image, message);
      }
  
      await db.run(
        'INSERT INTO popup_settings (image_url, message) VALUES (?, ?), (?, ?), (?, ?)',
        values
      );
  
      res.json({ success: true, message: 'Popups mis à jour', images: newImages, messages });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Erreur lors de l’enregistrement des popups.' });
    }
  });
  


// GET /popups pour récupérer jusqu'à 3 popups
router.get('/popups', (req, res) => {
  db.all('SELECT * FROM popup_settings ORDER BY created_at DESC LIMIT 3', (err, rows) => {
    if (err) {
      console.error('Erreur DB :', err);
      return res.status(500).json({ error: 'Erreur lors de la récupération des popups.' });
    }

    console.log('[GET] Popups récupérés :', rows);
    res.json(rows || []);
  });
});

module.exports = router;
