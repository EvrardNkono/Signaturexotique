const fs = require('fs');
const csv = require('csv-parser');

const inputFile = 'produits.csv'; // Ton fichier CSV exporté d'Excel
const outputFile = 'insert_produits.sql';

const results = [];

// Nettoyage des prix, convertit "4,99 €" ou " 4,99€ " en 4.99
function cleanPrice(priceStr) {
  if (!priceStr) return 0;
  // Supprime tout ce qui n'est pas chiffre, virgule, point ou signe négatif
  let cleaned = priceStr.replace(/[^\d,.\-]/g, '').replace(',', '.');
  let price = parseFloat(cleaned);
  return isNaN(price) ? 0 : price;
}

// Nettoyage des poids, convertit "1000g" ou "1 000 g" en 1000
function cleanWeight(weightStr) {
  if (!weightStr) return 0;
  // Supprime tout sauf chiffres (donc espace et lettres comme g)
  let cleaned = weightStr.replace(/[^\d]/g, '');
  let weight = parseInt(cleaned, 10);
  return isNaN(weight) ? 0 : weight;
}

fs.createReadStream(inputFile)
  .pipe(csv({ separator: ';' }))
 // ici le séparateur par défaut, la virgule
  .on('data', (data) => {
    console.log(data); // DEBUG : affiche chaque ligne en objet clé/valeur
    results.push(data);
  })
  .on('end', () => {
    if(results.length === 0){
      console.error('⚠️ Aucune donnée lue. Vérifie ton fichier CSV et le séparateur.');
      return;
    }

    let sqlStatements = '';
    for (const row of results) {
      // Ajuste les clés en fonction du nom exact dans le CSV (attention aux fautes comme retailWeiht)
      const category = (row['caterory'] || row['category'] || '').replace(/'/g, "''").trim();
      const name = (row['name'] || '').replace(/'/g, "''").trim();
      const unitPrice = cleanPrice(row['unitPrice']);
      const retailWeight = cleanWeight(row['retailWeiht'] || row['retailWeight']); // fais gaffe à l'orthographe dans ton CSV
      const wholesalePrice = cleanPrice(row['wholesalePrice']);
      const wholesaleWeight = cleanWeight(row['wholesaleWeiht'] || row['wholesaleWeight']); // idem
      const reduction = parseInt(row['reduction'], 10) || 0;
      const lotQuantity = parseInt(row['lotQuantity'], 10) || 0;
      const lotPrice = cleanPrice(row['lotPrice']);
      const inStock = parseInt(row['inStock'], 10) || 0;
      const details = (row['details'] || '').replace(/'/g, "''").trim();
      const isVisible = parseInt(row['isVisible'], 10) || 0;

      sqlStatements += `INSERT INTO products (category, name, unitPrice, retailWeight, wholesalePrice, wholesaleWeight, reduction, lotQuantity, lotPrice, inStock, details, isVisible) VALUES ('${category}', '${name}', ${unitPrice}, ${retailWeight}, ${wholesalePrice}, ${wholesaleWeight}, ${reduction}, ${lotQuantity}, ${lotPrice}, ${inStock}, '${details}', ${isVisible});\n`;
    }

    fs.writeFileSync(outputFile, sqlStatements, 'utf8');
    console.log(`✅ Fichier SQL généré : ${outputFile}`);
  });
