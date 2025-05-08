import React, { useState, useEffect } from 'react';
import './RecipePage.css';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';
import { API_URL } from '../config'; // Importation de l'URL de l'API

const RecipePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${API_URL}/recetteRoutes`);
        const data = await response.json();
        console.log("Recettes brutes depuis l'API :", data);

        const updatedData = data.map(recipe => {
          const fullImagePath = recipe.image && recipe.image !== 'null'
            ? recipe.image.startsWith('/')
              ? recipe.image.slice(1)
              : recipe.image
            : null;

          return {
            ...recipe,
            image: fullImagePath,
          };
        });

        console.log("Recettes avec chemins d'image complets :", updatedData);
        setRecipes(updatedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des recettes:", error);
      }
    };

    fetchRecipes();
  }, []);

  const openModal = (recipe) => {
    const safeRecipe = {
      ...recipe,
      ingredients: Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : typeof recipe.ingredients === 'string'
          ? JSON.parse(recipe.ingredients)
          : [],
  
      steps: Array.isArray(recipe.steps)
        ? recipe.steps
        : typeof recipe.steps === 'string'
          ? JSON.parse(recipe.steps)
          : [],
    };
  
    console.log("Recette sélectionnée :", safeRecipe);
    setSelectedRecipe(safeRecipe);
  };
  

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="recipe-page">
      <h1 className="page-title">NOS DÉLICIEUSES RECETTES DU MONDE</h1>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="recipe-image" 
            />
            <div className="recipe-info">
              <h2 className="recipe-title">{recipe.title}</h2>
              <p className="recipe-description">{recipe.description}</p>
              <div className="social-section">
                <p className="social-message">Voir la vidéo de la recette sur nos réseaux sociaux</p>
                <div className="social-icons">
                  <a href="#" className="social-icon" aria-label="TikTok"><FaTiktok /></a>
                  <a href="#" className="social-icon" aria-label="Facebook"><FaFacebookF /></a>
                  <a href="#" className="social-icon" aria-label="Instagram"><FaInstagram /></a>
                </div>
              </div>
              <button className="recipe-button" onClick={() => openModal(recipe)}>
                Voir la recette
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedRecipe && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>&times;</button>
            <h2>{selectedRecipe.title}</h2>

            <h3>Ingrédients</h3>
            {selectedRecipe.ingredients.length > 0 ? (
              <ul>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            ) : (
              <p>Aucun ingrédient spécifié pour cette recette.</p>
            )}

            <h3>Préparation</h3>
            {selectedRecipe.steps.length > 0 ? (
              <ol>
                {selectedRecipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            ) : (
              <p>Aucune étape de préparation disponible.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipePage;
