const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();

require('dotenv').config();
const resend = new Resend(process.env.RESEND_API_KEY);

// 🔌 Connexion à SQLite
const db = new sqlite3.Database('./db.sqlite');

// 📤 Route POST /verify-email/send à appeler après inscription
router.post('/send', (req, res) => {
  console.log("Body reçu :", req.body);
  const { email, userId } = req.body;

  if (!email || !userId) {
    return res.status(400).json({ success: false, error: 'Données manquantes.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const verificationUrl = `https://mekafrance.fr/verify-email?token=${token}`;

  // 🧠 Enregistre le token en base
  db.run(
    'UPDATE users SET email_verification_token = ? WHERE id = ?',
    [token, userId],
    async function (err) {
      if (err) {
        console.error('Erreur enregistrement token :', err);
        return res.status(500).json({ success: false, error: 'Erreur base de données.' });
      }

      try {
        await resend.emails.send({
          from: 'contact@mekafrance.fr',
          to: email,
          subject: '🛡️ Vérification de votre adresse e-mail',
          html: `
            <p>Bonjour,</p>
            <p>Merci pour votre inscription sur Meka France.</p>
            <p>Veuillez cliquer sur le lien ci-dessous pour confirmer votre adresse e-mail :</p>
            <p><a href="${verificationUrl}">✅ Vérifier mon e-mail</a></p>
            <p>Ce lien est valable pendant 24h.</p>
          `
        });

        res.status(200).json({ success: true, message: 'E-mail de vérification envoyé.' });
      } catch (mailErr) {
        console.error('Erreur envoi mail :', mailErr);
        res.status(500).json({ success: false, error: 'Échec d’envoi de l’e-mail.' });
      }
    }
  );
});

// 📥 Route GET /verify-email?token=... (appelée quand on clique sur le lien)
router.get('/', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Lien invalide.');
  }

  db.get(
    'SELECT * FROM users WHERE email_verification_token = ?',
    [token],
    (err, user) => {
      if (err || !user) {
        return res.status(400).send('Lien invalide ou expiré.');
      }

      db.run(
        'UPDATE users SET is_email_verified = 1, email_verification_token = NULL WHERE id = ?',
        [user.id],
        function (updateErr) {
          if (updateErr) {
            return res.status(500).send('Erreur lors de la validation.');
          }

          res.send(`
            <h2>🎉 Adresse e-mail vérifiée !</h2>
            <p>Vous pouvez maintenant vous connecter à votre compte.</p>
            <a href="https://mekafrance.fr/login">Connexion</a>
          `);
        }
      );
    }
  );
});

module.exports = router;
