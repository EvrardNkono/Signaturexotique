// --- Imports et fonctions utilitaires déjà présents ---
const db = require('../config/db');

const getImagePath = (file) => {
  return file ? `/uploads/${file.filename}` : null;
};

function parseSafely(field) {
  try {
    return JSON.parse(field);
  } catch {
    return [];
  }
}

// --- Récupérer toutes les recettes ---
const getAllRecipes = (req, res) => {
  const query = 'SELECT * FROM recipes';
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    const host = req.protocol + '://' + req.get('host');
    const updatedRows = rows.map((recipe) => ({
      ...recipe,
      ingredients: parseSafely(recipe.ingredients),
      steps: parseSafely(recipe.steps),
      image: recipe.image ? `${host}${recipe.image}` : null,
    }));

    res.json(updatedRows);
  });
};

// --- Récupérer une recette par ID ---
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

// --- Créer une recette avec champs facultatifs ---
const createRecipe = (req, res) => {
  const { title, description, ingredients, steps, tiktokLink = '', facebookLink = '', instagramLink = '' } = req.body;

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
    INSERT INTO recipes (title, description, ingredients, steps, image, tiktokLink, facebookLink, instagramLink)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    title,
    description,
    JSON.stringify(parsedIngredients),
    JSON.stringify(parsedSteps),
    image,
    tiktokLink,
    facebookLink,
    instagramLink
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
        image,
        tiktokLink,
        facebookLink,
        instagramLink
      }
    });
  });
};

// --- Mettre à jour une recette ---
const updateRecipe = (req, res) => {
  const recipeId = req.params.id;
  const { title, description, ingredients, steps, tiktokLink = '', facebookLink = '', instagramLink = '' } = req.body;

  let parsedIngredients, parsedSteps;
  try {
    parsedIngredients = JSON.parse(ingredients);
    parsedSteps = JSON.parse(steps);
  } catch (err) {
    return res.status(400).json({ message: 'Format JSON invalide pour ingrédients ou étapes.' });
  }

  const newImage = getImagePath(req.file);

  db.get('SELECT * FROM recipes WHERE id = ?', [recipeId], (err, existingRecipe) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la récupération de la recette.' });
    if (!existingRecipe) return res.status(404).json({ message: 'Recette introuvable.' });

    const finalImage = newImage || existingRecipe.image;

    const updateQuery = `
      UPDATE recipes
      SET title = ?, description = ?, ingredients = ?, steps = ?, image = ?, tiktokLink = ?, facebookLink = ?, instagramLink = ?
      WHERE id = ?
    `;

    db.run(updateQuery, [
      title,
      description,
      JSON.stringify(parsedIngredients),
      JSON.stringify(parsedSteps),
      finalImage,
      tiktokLink,
      facebookLink,
      instagramLink,
      recipeId
    ], function (err) {
      if (err) return res.status(500).json({ message: 'Erreur lors de la mise à jour.' });

      res.json({
        message: 'Recette mise à jour avec succès ✅',
        updatedRecipe: {
          id: recipeId,
          title,
          description,
          ingredients: parsedIngredients,
          steps: parsedSteps,
          image: finalImage,
          tiktokLink,
          facebookLink,
          instagramLink
        }
      });
    });
  });
};

// --- Supprimer une recette ---
const deleteRecipe = (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM recipes WHERE id = ?', [id], function (err) {
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
