import React from 'react';
import Slider from 'react-slick';
import ProductCard from './ProductCard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './ProductCarousel.css';

const ProductCarousel = ({ products, title }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2, // <-- ici au lieu de 1
        },
      },
    ],
  };

  return (
    <div className="product-carousel">
      <h2>{title}</h2>
      <Slider {...settings}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
