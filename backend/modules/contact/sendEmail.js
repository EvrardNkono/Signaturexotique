const nodemailer = require('nodemailer');

// Créez un transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Ou un autre service de votre choix
  auth: {
    user: process.env.EMAIL_USER, // Votre adresse email
    pass: process.env.EMAIL_PASS   // Votre mot de passe
  }
});

// Fonction pour envoyer l'email
const sendEmail = (req, res) => {
  const { name, email, message } = req.body;

  // Vérifie les données reçues dans la requête
  console.log('Données reçues:', { name, email, message });

  const mailOptions = {
    from: email,
    to: 'signaturexotique@gmail.com', // L'email de l'entreprise
    subject: `Message de ${name}`,
    text: message,
    html: `<p>Message de: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`
  };

  // Affiche les options de mail pour s'assurer qu'elles sont correctes
  console.log('Options de mail:', mailOptions);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erreur lors de l\'envoi:', error);
      return res.status(500).json({ success: false, message: 'Erreur d\'envoi' });
    }
    console.log('Email envoyé avec succès:', info.response);
    res.status(200).json({ success: true, message: 'Message envoyé avec succès!' });
  });
};

module.exports = sendEmail;
