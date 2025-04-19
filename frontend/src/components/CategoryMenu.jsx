import React from 'react';
import './CategoryMenu.css';

const CategoryMenu = ({ categories, onSelectCategory }) => (
  <div className="category-menu">
    <h3>Catégories</h3>
    <ul>
      {categories.map((category) => (
        <li key={category} onClick={() => onSelectCategory(category)}>
          {category}
        </li>
      ))}
    </ul>
  </div>
);

export default CategoryMenu;
