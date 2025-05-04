const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../../config/db'); // adapte selon ton projet

const router = express.Router();

// Upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, 'popup_' + Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

// POST /admin/popup
// POST /admin/popup
router.post('/popup', upload.single('image'), async (req, res) => {
    const message = req.body.message || ''; // Récupère le message envoyé
    const imageUrl = '/uploads/' + req.file.filename;
  
    try {
      // On supprime l’ancien enregistrement
      await db.run('DELETE FROM popup_settings');
  
      // On insère le nouveau
      await db.run(
        'INSERT INTO popup_settings (image_url, message) VALUES (?, ?)',
        [imageUrl, message]
      );
  
      res.json({ success: true, message: 'Popup mis à jour', imageUrl, message });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Erreur lors de l’enregistrement du popup.' });
    }
  });
  

// GET /popup
router.get('/popup', (req, res) => {
    db.get('SELECT * FROM popup_settings ORDER BY created_at DESC LIMIT 1', (err, row) => {
      if (err) {
        console.error('Erreur DB :', err);
        return res.status(500).json({ error: 'Erreur lors de la récupération du popup.' });
      }
  
      console.log('[GET] Popup récupéré :', row);
      res.json(row || {});
    });
  });
  

module.exports = router;
