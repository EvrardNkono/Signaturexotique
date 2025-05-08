const db = require('../config/db'); // Connexion à la base de données

// Fonction utilitaire pour générer le chemin de l'image
const getImagePath = (file) => {
  if (file) {
    return `/uploads/${file.filename}`;
  }
  return null;
};

// Fonction utilitaire pour parser en toute sécurité
function parseSafely(field) {
  try {
    return JSON.parse(field);
  } catch {
    return [];
  }
}

// Récupérer toutes les recettes
const getAllRecipes = (req, res) => {
  const query = 'SELECT * FROM recipes';
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const host = req.protocol + '://' + req.get('host'); // http://localhost:5000

    const updatedRows = rows.map((recipe) => {
      return {
        ...recipe,
        ingredients: parseSafely(recipe.ingredients),
        steps: parseSafely(recipe.steps),
        image: recipe.image ? `${host}${recipe.image}` : null,
      };
    });

    console.log('📦 Recettes enrichies :', updatedRows);
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

    const host = req.protocol + '://' + req.get('host');

    const recipe = {
      ...row,
      ingredients: parseSafely(row.ingredients),
      steps: parseSafely(row.steps),
      image: row.image ? `${host}${row.image}` : null,
    };

    res.json(recipe);
  });
};

module.exports = {
  getAllRecipes,
  getRecipeById,
};


// Créer une nouvelle recette
const createRecipe = (req, res) => {
  console.log('req.file :', req.file);
  console.log('req.body :', req.body);

  const { title, description, ingredients, steps } = req.body;

  let parsedIngredients;
  let parsedSteps;

  try {
    parsedIngredients = JSON.parse(ingredients);
    parsedSteps = JSON.parse(steps);
  } catch (err) {
    return res.status(400).json({ error: "Les champs 'ingredients' et 'steps' doivent être des tableaux JSON valides." });
  }

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
  const recipeId = req.params.id;
  const { title, description } = req.body;

  let ingredients, steps;

  try {
    ingredients = JSON.parse(req.body.ingredients);
    steps = JSON.parse(req.body.steps);
  } catch (error) {
    return res.status(400).json({ message: 'Format JSON invalide pour ingrédients ou étapes.' });
  }

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  const selectQuery = `SELECT * FROM recipes WHERE id = ?`;
  db.get(selectQuery, [recipeId], (err, existingRecipe) => {
    if (err) return res.status(500).json({ message: "Erreur lors de la récupération de la recette." });
    if (!existingRecipe) return res.status(404).json({ message: "Recette introuvable." });

    const finalImage = image || existingRecipe.image;

    const updateQuery = `
      UPDATE recipes
      SET title = ?, description = ?, ingredients = ?, steps = ?, image = ?
      WHERE id = ?
    `;

    db.run(
      updateQuery,
      [title, description, JSON.stringify(ingredients), JSON.stringify(steps), finalImage, recipeId],
      function (err) {
        if (err) return res.status(500).json({ message: "Erreur lors de la mise à jour de la recette." });

        res.json({ message: "Recette mise à jour avec succès", id: recipeId });
      }
    );
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

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
};
