const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // ton accès DB
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

router.post('/send-message', async (req, res) => {
  const { message, mode } = req.body;

  if (!message || !mode) {
    return res.status(400).json({ message: 'Message et mode requis' });
  }

  try {
    const { rows: users } = await db.query("SELECT * FROM users WHERE wants_offers = true");
    let sent = 0;

    for (const user of users) {
      // Envoi email si demandé
      if ((mode === 'email' || mode === 'both') && user.email) {
        await resend.emails.send({
          from: 'offres@meka-france.com',
          to: user.email,
          subject: 'Une nouvelle offre pour vous !',
          html: `<p>${message}</p>`,
        });
        sent++;
      }

      // Envoi SMS si demandé
      if ((mode === 'sms' || mode === 'both') && user.phone) {
        await client.messages.create({
          body: message,
          from: TWILIO_PHONE_NUMBER,
          to: user.phone,
        });
        sent++;
      }
    }

    res.status(200).json({ message: 'Messages envoyés', sent });
  } catch (err) {
    console.error('Erreur backend:', err.message);
    res.status(500).json({ message: 'Erreur lors de l’envoi des messages.' });
  }
});

module.exports = router;
