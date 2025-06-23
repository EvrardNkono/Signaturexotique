const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const ExcelJS = require('exceljs');

const path = require('path');
const dbPath = path.resolve(__dirname, '../database.db'); // un dossier au-dessus de routes/
const db = new sqlite3.Database(dbPath);

// Route pour enregistrer une commande (inchangée)
router.post('/', (req, res) => {
  const { name, email, address, total, items } = req.body;

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');

    db.run(
      `INSERT INTO orders (customer_name, customer_email, customer_address, total_amount)
       VALUES (?, ?, ?, ?)`,
      [name, email, address, total],
      function (err) {
        if (err) {
          db.run('ROLLBACK');
          return res.status(500).json({ error: err.message });
        }

        const orderId = this.lastID;
        const stmt = db.prepare(
          `INSERT INTO order_items (order_id, product_name, quantity, unit_price, weight)
           VALUES (?, ?, ?, ?, ?)`
        );

        for (const item of items) {
          stmt.run([orderId, item.name, item.quantity, item.unitPrice, item.weight]);
        }

        stmt.finalize();
        db.run('COMMIT');
        res.status(200).json({ message: 'Commande enregistrée avec succès' });
      }
    );
  });
});

// Route pour exporter les commandes en Excel avec filtre par date
router.get('/export', (req, res) => {
  const { startDate, endDate } = req.query;

  // Validation basique des dates
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate et endDate sont requis en query params' });
  }

  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ error: 'startDate doit être antérieure ou égale à endDate' });
  }

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Commandes');

  sheet.columns = [
    { header: 'Commande ID', key: 'order_id', width: 12 },
    { header: 'Nom client', key: 'customer_name', width: 20 },
    { header: 'Email', key: 'customer_email', width: 25 },
    { header: 'Adresse', key: 'customer_address', width: 30 },
    { header: 'Produit', key: 'product_name', width: 20 },
    { header: 'Quantité', key: 'quantity', width: 10 },
    { header: 'Prix unitaire', key: 'unit_price', width: 12 },
    { header: 'Poids (g)', key: 'weight', width: 10 },
    { header: 'Montant total', key: 'total_amount', width: 15 },
    { header: 'Date commande', key: 'order_date', width: 20 }
  ];

  const query = `
    SELECT 
      o.id AS order_id,
      o.customer_name,
      o.customer_email,
      o.customer_address,
      o.total_amount,
      o.order_date,
      oi.product_name,
      oi.quantity,
      oi.unit_price,
      oi.weight
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    WHERE o.order_date BETWEEN ? AND ?
    ORDER BY o.id DESC
  `;

  db.all(query, [startDate, endDate], async (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    rows.forEach(row => sheet.addRow(row));

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=commandes_${startDate}_to_${endDate}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  });
});

module.exports = router;
