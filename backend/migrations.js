const fs = require('fs');
const path = require('path');

// Liste des catégories
const categories = [
  "FRUITS FRAIS",
  "APPERITIFS",
  "BOISSONS ALCOOLISEES",
  "BOISSONS SODAS",
  "FEUILLAGES FRAIS",
  "LEGUMES FRAIS",
  "LEGUMES SECS",
  "POISSONS SALES",
  "PRODUITS FRAIS",
  "PÂTES CUISINEES",
  "PÂTES FRAICHES",
  "RACINES FRAIS",
  "CRUSTACEES SURGELES",
  "GLACES SURGELES",
  "LEGUMES SURGELES",
  "POISSONS SURGELES",
  "TISANES ET INFUSIONS",
  "EPICES SECS",
  "VIANDES SURGELES"
];

// Chemin complet vers ton dossier d’images
const basePath = "C:\\Users\\WORKSTATION\\Documents\\signature-exotique\\backend\\public\\uploads\\images";

// Création des dossiers
categories.forEach((category) => {
  const folderName = category.toLowerCase().replace(/\s+/g, '-');
  const fullPath = path.join(basePath, folderName);

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Dossier créé : ${fullPath}`);
  } else {
    console.log(`⚠️  Dossier déjà existant : ${fullPath}`);
  }
});
