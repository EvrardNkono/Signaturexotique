import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRating.css'; // pour le style

const StarRating = ({ onChange, defaultRating = 0 }) => {
  const [rating, setRating] = useState(defaultRating);
  const [hover, setHover] = useState(null);

  const handleClick = (value) => {
    setRating(value);
    if (onChange) onChange(value);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((value) => (
        <FaStar
          key={value}
          className="star-icon"
          color={value <= (hover || rating) ? 'gold' : '#e4e5e9'}
          onClick={() => handleClick(value)}
          onMouseEnter={() => setHover(value)}
          onMouseLeave={() => setHover(null)}
          style={{ cursor: 'pointer' }}
        />
      ))}
    </div>
  );
};

export default StarRating;
