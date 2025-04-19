// src/components/CategoriesDropdown.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CategoriesDropdown = ({ onClick }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/admin/category') // adapte l'URL à ton backend
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error('Erreur chargement catégories:', err));
  }, []);

  return (
    <div className="dropdown">
      <button className="dropbtn">Catégories</button>
      <div className="dropdown-content">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/catalogue?categorie=${encodeURIComponent(cat.nom)}`}
            onClick={onClick}
          >
            {cat.nom}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesDropdown;
