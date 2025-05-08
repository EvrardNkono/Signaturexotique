import React, { useState, useEffect } from 'react';
import './AdminRecipeForm.css';
import { API_URL } from '../config';
import AdminRecipeList from './AdminRecipeList';

const AdminRecipeForm = () => {
  const [editingRecipe, setEditingRecipe] = useState(null);
  window.__setEditingRecipe__ = setEditingRecipe; // accessible depuis AdminRecipeList

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (editingRecipe) {
      console.log("Chargement de la recette pour édition :", editingRecipe);

      setTitle(editingRecipe.title || '');
      setDescription(editingRecipe.description || '');

      // Vérifie si ingrédients/étapes sont des tableaux, sinon traite comme string
      const safeIngredients = Array.isArray(editingRecipe.ingredients)
        ? editingRecipe.ingredients.join('\n')
        : (editingRecipe.ingredients || '');
      const safeSteps = Array.isArray(editingRecipe.steps)
        ? editingRecipe.steps.join('\n')
        : (editingRecipe.steps || '');

      setIngredients(safeIngredients);
      setSteps(safeSteps);
      setImage(editingRecipe.image || '');
    }
  }, [editingRecipe]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append(
      'ingredients',
      JSON.stringify(
        ingredients.split('\n').map((ing) => ing.trim()).filter(Boolean)
      )
    );
    formData.append(
      'steps',
      JSON.stringify(
        steps.split('\n').map((step) => step.trim()).filter(Boolean)
      )
    );
  
    if (imageFile) {
      formData.append('image', imageFile);
    }
  
    const url = editingRecipe
      ? `${API_URL}/recetteRoutes/${editingRecipe.id}`
      : `${API_URL}/recetteRoutes`;
    const method = editingRecipe ? 'PUT' : 'POST';
  
    try {
      console.log("Soumission de la recette :", {
        title, description, ingredients, steps, imageFile
      });
  
      const res = await fetch(url, { method, body: formData });
      const text = await res.text();
  
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.warn('Réponse non-JSON du serveur :', text);
        data = {};
      }
  
      if (res.ok) {
        alert(`Recette ${editingRecipe ? 'mise à jour' : 'ajoutée'} avec succès`);
        // Réinitialise le formulaire
        setEditingRecipe(null);
        setTitle('');
        setDescription('');
        setIngredients('');
        setSteps('');
        setImage('');
        setImageFile(null);
      } else {
        alert(`Erreur : ${data.message || 'Réponse serveur invalide'}`);
      }
    } catch (err) {
      alert(`Erreur soumission : ${err.message}`);
      console.error("Erreur lors de la soumission :", err);
    }
  };
  

  return (
    <div className="admin-recipe-form">
      <h2>{editingRecipe ? 'Modifier la recette' : 'Ajouter une nouvelle recette'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titre</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Ingrédients (un par ligne)</label>
          <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Étapes (une par ligne)</label>
          <textarea value={steps} onChange={(e) => setSteps(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input type="file" onChange={handleImageUpload} accept="image/*" />
          {image && <img src={image} alt="Aperçu" className="image-preview" />}
        </div>
        <button type="submit" className="submit-button">Soumettre</button>
      </form>

      {/* Liste des recettes intégrée en dessous */}
      <AdminRecipeList />
    </div>
  );
};

export default AdminRecipeForm;
