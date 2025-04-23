// updateSuperadminPassword.js
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db'); // adapte le chemin si besoin

const motDePasseEnClair = 'superadmin1';

bcrypt.hash(motDePasseEnClair, 10, (err, hash) => {
  if (err) {
    return console.error('❌ Erreur de hachage :', err.message);
  }
  console.log('🔑 Hash généré :', hash);

  db.run(
    `UPDATE users SET mot_de_passe = ? WHERE email = ?`,
    [hash, 'superadmin@gmail.com'],
    function (err) {
      if (err) {
        return console.error('❌ Erreur SQL :', err.message);
      }
      console.log('✅ Mot de passe superadmin mis à jour avec succès ! 🔐');
    }
  );
});
