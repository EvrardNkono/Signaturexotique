const db = require('../config/db'); // Connexion à la base de données

// Fonction utilitaire pour générer le chemin de l'image
const getImagePath = (file) => {
  if (file) {
    return `/uploads/${file.filename}`;
  }
  return null;
};

// Récupérer toutes les recettes
const getAllRecipes = (req, res) => {
  const query = 'SELECT * FROM recipes';
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const host = req.protocol + '://' + req.get('host'); // http://localhost:5000
    const updatedRows = rows.map((recipe) => {
      if (recipe.image) {
        // Si l'image existe, nous générons l'URL complète
        recipe.image = `${host}${recipe.image}`;
      }
      return recipe;
    });

    console.log('📦 Recettes enrichies :', updatedRows); // Pour debug
    res.json(updatedRows);
  });
};

// Récupérer une recette par ID
const getRecipeById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM recipes WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Recette non trouvée' });

    // Générer le chemin de l'image pour la recette
    if (row.image) {
      const host = req.protocol + '://' + req.get('host');
      row.image = `${host}${row.image}`;
    }

    res.json(row);
  });
};

// Créer une nouvelle recette
const createRecipe = (req, res) => {
  console.log('req.file :', req.file);
  console.log('req.body :', req.body);

  const { title, description, ingredients, steps } = req.body;

  // On parse les champs s'ils sont transmis en JSON stringifiés
  let parsedIngredients;
  let parsedSteps;

  try {
    parsedIngredients = JSON.parse(ingredients);
    parsedSteps = JSON.parse(steps);
  } catch (err) {
    return res.status(400).json({ error: "Les champs 'ingredients' et 'steps' doivent être des tableaux JSON valides." });
  }

  // Utilisation de la fonction utilitaire pour récupérer le chemin de l'image
  const image = getImagePath(req.file);

  const query = `
    INSERT INTO recipes (title, description, ingredients, steps, image)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [
    title,
    description,
    JSON.stringify(parsedIngredients),
    JSON.stringify(parsedSteps),
    image
  ], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      message: 'Recette créée avec succès 🎉',
      recipe: {
        id: this.lastID,
        title,
        description,
        ingredients: parsedIngredients,
        steps: parsedSteps,
        image
      }
    });
  });
};

// Mettre à jour une recette
const updateRecipe = (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients, steps } = req.body;
  
  // Utilisation de la fonction utilitaire pour récupérer le chemin de l'image
  const image = getImagePath(req.file);

  // Si une image est téléchargée, on met à jour le champ image, sinon on ne met pas à jour le champ image
  const query = req.file
    ? `UPDATE recipes SET title = ?, description = ?, ingredients = ?, steps = ?, image = ? WHERE id = ?`
    : `UPDATE recipes SET title = ?, description = ?, ingredients = ?, steps = ? WHERE id = ?`;

  db.run(query, [title, description, JSON.stringify(ingredients), JSON.stringify(steps), image, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Recette non trouvée' });

    res.json({
      id,
      title,
      description,
      ingredients,
      steps,
      image,
    });
  });
};

// Supprimer une recette
const deleteRecipe = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM recipes WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Recette non trouvée' });
    res.status(204).send();
  });
};

module.exports = { getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe };
