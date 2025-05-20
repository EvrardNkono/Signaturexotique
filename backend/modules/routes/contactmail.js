const express = require('express');
const router = express.Router();
const { Resend } = require('resend');

// ⚠️ Charge les variables d’environnement
require('dotenv').config();

// 🔐 Initialise l'instance Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

// 📮 Route POST /contactmail pour recevoir les données du formulaire
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Champs manquants.' });
  }

  try {
    const result = await resend.emails.send({
      from: 'contact@mekafrance.fr', // ⚠️ Utilisable en dev, à changer après configuration de domaine
      to: 'mekafrance@outlook.fr', // 🎯 Adresse de réception réelle
      subject: '📩 Nouveau message depuis le formulaire de contact',
      html: `
        <h3>Vous avez reçu un message via le formulaire de contact :</h3>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `
    });

    console.log('Message envoyé :', result);
    res.status(200).json({ success: true, message: 'Message envoyé avec succès.' });
  } catch (error) {
    console.error('Erreur envoi mail via Resend :', error);
    res.status(500).json({ success: false, error: 'Erreur lors de l’envoi du message.' });
  }
});

module.exports = router;
