import React, { useState } from 'react';
import './RecipePage.css';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const recipes =[
    {
      "id": 7,
      "title": "Ndolé aux gambas",
      "image": "./assets/ndole.jpg",
      "description": "Un plat typique du Cameroun, à base de feuilles amères et de gambas, savoureux et nourrissant.",
      "ingredients": [
        "500g de feuilles de ndolé (fraîches ou surgelées)",
        "300g de pâte d’arachide naturelle non sucrée",
        "500g de gambas ou grosses crevettes décortiquées",
        "2 oignons moyens",
        "2 à 3 gousses d’ail",
        "1 morceau de gingembre (environ 3 cm)",
        "2 cubes d’assaisonnement",
        "Sel, poivre noir moulu",
        "Piment (au goût)",
        "4 à 5 cuillères à soupe d’huile végétale",
        "1 pincée de bicarbonate de soude (si les feuilles sont fraîches)"
      ],
      "steps": [
        "Si les feuilles de ndolé sont fraîches : les laver soigneusement plusieurs fois, puis les bouillir 15 à 20 minutes avec une pincée de bicarbonate pour enlever l’amertume. Égoutter et hacher finement.",
        "Si les feuilles sont surgelées : les décongeler, les rincer et les hacher.",
        "Dans une casserole, cuire la pâte d’arachide avec un peu d’eau, à feu doux, en remuant jusqu’à ce qu’elle devienne une pâte lisse et épaisse.",
        "Faire revenir les gambas dans une poêle avec un peu d’huile, l’ail haché, du sel et du poivre pendant 5 minutes. Réserver.",
        "Dans une grande marmite, faire revenir les oignons émincés avec de l’huile. Ajouter le gingembre et l’ail hachés.",
        "Incorporer la pâte d’arachide cuite, bien mélanger, puis ajouter les feuilles de ndolé hachées. Bien remuer.",
        "Assaisonner avec les cubes, sel, poivre, et éventuellement le piment. Laisser mijoter 20 à 30 minutes à feu moyen, en remuant régulièrement.",
        "Ajouter les gambas dans la préparation, bien mélanger et laisser mijoter encore 5 minutes.",
        "Servir chaud, accompagné de miondo (bâtonnets de manioc), de plantains mûrs frits ou de riz blanc."
      ]
    },
    {
      "id": 2,
      "title": "Okok Sucré",
      "image": "./assets/okok.jpg",
      "description": "Spécialité du Centre du Cameroun à base de feuilles d'okok et pâte d'arachide.",
      "ingredients": [
        "500g de feuilles d'okok",
        "200g de pâte d’arachide",
        "200g de sucre",
        "1 litre d’eau",
        "Piment (au goût)"
      ],
      "steps": [
        "Faire tremper les feuilles d’okok dans de l’eau chaude pendant environ 15 minutes.",
        "Faire cuire la pâte d’arachide avec un peu d’eau à feu doux.",
        "Mélanger les feuilles d’okok et la pâte d’arachide dans une marmite.",
        "Ajouter le sucre et laisser mijoter pendant 30 minutes.",
        "Assaisonner avec du sel et du piment, puis servir."
      ]
    },
    {
      "id": 3,
      "title": "Eru",
      "image": "./assets/eru.jpg",
      "description": "Mélange de feuilles d'okok et waterleaf, cuit avec viande et poisson.",
      "ingredients": [
        "500g de feuilles d'okok",
        "500g de waterleaf",
        "300g de viande de boeuf",
        "300g de poisson",
        "2 oignons",
        "2 cubes d'assaisonnement",
        "Huile végétale",
        "Sel, poivre"
      ],
      "steps": [
        "Laver et hacher les feuilles d'okok et waterleaf.",
        "Faire bouillir la viande et le poisson avec les cubes d’assaisonnement.",
        "Faire revenir les oignons dans l'huile.",
        "Ajouter les feuilles hachées dans la marmite avec la viande et le poisson, puis laisser mijoter.",
        "Assaisonner avec du sel, du poivre et laisser cuire à feu moyen."
      ]
    },
    {
      "id": 4,
      "title": "Placali",
      "image": "./assets/placali.jpg",
      "description": "Couscous de manioc servi avec une sauce épicée.",
      "ingredients": [
        "500g de manioc",
        "1 litre d'eau",
        "2 gousses d’ail",
        "1 oignon",
        "Piment (au goût)",
        "2 cuillères à soupe d’huile",
        "1 cube d'assaisonnement"
      ],
      "steps": [
        "Peler et râper le manioc.",
        "Faire cuire le manioc avec de l'eau jusqu'à obtenir une pâte ferme.",
        "Faire revenir les oignons et l'ail dans l’huile.",
        "Ajouter de l’eau et le cube d’assaisonnement, puis laisser mijoter pendant 20 minutes.",
        "Servir le couscous de manioc avec la sauce épicée."
      ]
    },
    {
      "id": 5,
      "title": "Poulet DG",
      "image": "./assets/poulet DG.jpg",
      "description": "Plat populaire à base de poulet, plantains et légumes.",
      "ingredients": [
        "1 poulet",
        "4 plantains mûrs",
        "2 oignons",
        "2 tomates",
        "Piment (au goût)",
        "1 cube d'assaisonnement",
        "Huile d'arachide"
      ],
      "steps": [
        "Faire cuire le poulet dans de l'eau salée.",
        "Faire frire les plantains dans l’huile.",
        "Faire revenir les oignons et les tomates.",
        "Ajouter le poulet et les plantains, puis assaisonner.",
        "Laisser mijoter pendant 15 à 20 minutes."
      ]
    },
    {
      "id": 6,
      "title": "Bitterleaf Soup",
      "image": "./assets/bitterleaf-soup.jpg",
      "description": "Soupe épicée à base de feuilles amères et viande.",
      "ingredients": [
        "500g de feuilles amères",
        "300g de viande de boeuf",
        "2 oignons",
        "Piment (au goût)",
        "2 cubes d'assaisonnement",
        "Huile d'arachide"
      ],
      "steps": [
        "Faire bouillir les feuilles amères dans de l'eau salée.",
        "Faire revenir les oignons et la viande dans l’huile.",
        "Ajouter les feuilles amères et laisser mijoter.",
        "Assaisonner avec des cubes et du piment, puis servir chaud."
      ]
    }
  ]
  

const RecipePage = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const openModal = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className="recipe-page">
      <h1 className="page-title">Nos Délicieuses Recettes Africaines</h1>
      <div className="recipe-list">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card">
            <img src={recipe.image} alt={recipe.title} className="recipe-image" />
            <div className="recipe-info">
              <h2 className="recipe-title">{recipe.title}</h2>
              <p className="recipe-description">{recipe.description}</p>
              <div className="social-section">
                <p className="social-message">Voir la vidéo de la recette sur nos réseaux sociaux</p>
                <div className="social-icons">
                  <a href="#" className="social-icon" aria-label="TikTok">
                    <FaTiktok />
                  </a>
                  <a href="#" className="social-icon" aria-label="Facebook">
                    <FaFacebookF />
                  </a>
                  <a href="#" className="social-icon" aria-label="Instagram">
                    <FaInstagram />
                  </a>
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
      <ul>
        {selectedRecipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>

      <h3>Préparation</h3>
      <ol>
        {selectedRecipe.steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
    </div>
  </div>
)}


    </div>
  );
};

export default RecipePage;
