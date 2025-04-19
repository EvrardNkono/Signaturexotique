const express = require('express');
const sendEmail = require('./sendEmail'); // Importer la logique d'envoi d'email

const router = express.Router();

// Définir la route POST pour envoyer un email
router.post('/', sendEmail);

module.exports = router;
