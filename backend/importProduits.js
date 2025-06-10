const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dbFile = './database.db'; // Chemin vers ta base SQLite
const sqlFile = './insert_produits.sql'; // Ton fichier SQL généré

// Ouvre la base SQLite
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) {
    return console.error('Erreur ouverture DB :', err.message);
  }
  console.log('Base SQLite connectée.');
});

// Lis le contenu du fichier SQL
const sql = fs.readFileSync(sqlFile, 'utf8');

// Exécute tout le contenu SQL (plusieurs requêtes INSERT)
db.exec(sql, (err) => {
  if (err) {
    return console.error('Erreur lors de l’insertion :', err.message);
  }
  console.log('✅ Produits insérés avec succès !');
});

// Ferme la base de données
db.close((err) => {
  if (err) {
    return console.error('Erreur fermeture DB :', err.message);
  }
  console.log('Base SQLite fermée.');
});
