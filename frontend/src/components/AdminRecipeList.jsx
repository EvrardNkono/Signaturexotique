// src/components/AdminRecipeList.jsx
import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';

const AdminRecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [setEditingRecipe, setSetEditingRecipe] = useState(() => () => {});

  const fetchRecipes = async () => {
    try {
      const res = await fetch(`${API_URL}/recetteRoutes`);
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error("Erreur de chargement :", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer suppression ?")) return;
    try {
      const res = await fetch(`${API_URL}/recetteRoutes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  const handleEdit = (recipe) => {
    setEditingRecipe(recipe);
  };

  useEffect(() => {
    fetchRecipes();
    // Petit hack : permet de synchroniser avec l'état parent sans props
    const globalSetter = window.__setEditingRecipe__;
    if (globalSetter) setSetEditingRecipe(() => globalSetter);
  }, []);

  return (
    <div className="admin-recipe-list">
      <h3>Recettes existantes</h3>
      <ul>
        {recipes.map((r) => (
          <li key={r.id}>
            <strong>{r.title}</strong>
            <button onClick={() => handleEdit(r)}>Modifier</button>
            <button onClick={() => handleDelete(r.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRecipeList;
