import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import AdminRecipeList from '../components/AdminRecipeList';
import './Recipes.css';

const Recipes = () => {
  const [editingRecipe, setEditingRecipe] = useState(null);
  window.__setEditingRecipe__ = setEditingRecipe;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [tiktokLink, setTiktokLink] = useState('');
  const [facebookLink, setFacebookLink] = useState('');
  const [instagramLink, setInstagramLink] = useState('');

  useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title || '');
      setDescription(editingRecipe.description || '');
      setIngredients(Array.isArray(editingRecipe.ingredients) ? editingRecipe.ingredients.join('\n') : (editingRecipe.ingredients || ''));
      setSteps(Array.isArray(editingRecipe.steps) ? editingRecipe.steps.join('\n') : (editingRecipe.steps || ''));
      setImage(editingRecipe.image || '');
      setTiktokLink(editingRecipe.tiktokLink || '');
      setFacebookLink(editingRecipe.facebookLink || '');
      setInstagramLink(editingRecipe.instagramLink || '');
    }
  }, [editingRecipe]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('ingredients', JSON.stringify(ingredients.split('\n').map((ing) => ing.trim()).filter(Boolean)));
    formData.append('steps', JSON.stringify(steps.split('\n').map((step) => step.trim()).filter(Boolean)));
    if (imageFile) formData.append('image', imageFile);
    formData.append('tiktokLink', tiktokLink);
    formData.append('facebookLink', facebookLink);
    formData.append('instagramLink', instagramLink);

    const url = editingRecipe ? `${API_URL}/recetteRoutes/${editingRecipe.id}` : `${API_URL}/recetteRoutes`;
    const method = editingRecipe ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, body: formData });
      const text = await res.text();
      const data = JSON.parse(text);

      if (res.ok) {
        alert(`Recette ${editingRecipe ? 'mise à jour' : 'ajoutée'} avec succès`);
        setEditingRecipe(null);
        setTitle('');
        setDescription('');
        setIngredients('');
        setSteps('');
        setImage('');
        setImageFile(null);
        setTiktokLink('');
        setFacebookLink('');
        setInstagramLink('');
      } else {
        alert(`Erreur : ${data.message || 'Réponse serveur invalide'}`);
      }
    } catch (err) {
      alert(`Erreur soumission : ${err.message}`);
      console.error("Erreur lors de la soumission :", err);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) setImageFile(file);
  };

  return (
    <div className="recipes-container">
      <h2 className="recipes-title">
        {editingRecipe ? '✏️ Modifier la recette' : '🍽️ Ajouter une nouvelle recette'}
      </h2>

      <form onSubmit={handleSubmit} className="recipes-form">
        <div className="form-group">
          <label>Titre</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Ingrédients (un par ligne)</label>
            <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Étapes (une par ligne)</label>
            <textarea value={steps} onChange={(e) => setSteps(e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label>Image</label>
          <input type="file" onChange={handleImageUpload} accept="image/*" />
          {image && <img src={image} alt="Aperçu" className="image-preview" />}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Lien TikTok</label>
            <input type="url" value={tiktokLink} onChange={(e) => setTiktokLink(e.target.value)} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>Lien Facebook</label>
            <input type="url" value={facebookLink} onChange={(e) => setFacebookLink(e.target.value)} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>Lien Instagram</label>
            <input type="url" value={instagramLink} onChange={(e) => setInstagramLink(e.target.value)} placeholder="https://..." />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit">
            {editingRecipe ? '💾 Modifier' : '➕ Ajouter'}
          </button>
          {editingRecipe && (
            <button type="button" onClick={() => setEditingRecipe(null)} className="btn-cancel">
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="recipes-list">
        <AdminRecipeList />
      </div>
    </div>
  );
};

export default Recipes;
