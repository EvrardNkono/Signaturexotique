import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

const CategorySelector = ({ categories, onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {selectedCategory ? selectedCategory.name : 'Sélectionner une catégorie'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {categories.map((category) => (
          <Dropdown.Item
            key={category.id}
            onClick={() => handleSelect(category)}
          >
            {category.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CategorySelector;
