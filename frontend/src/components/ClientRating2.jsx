import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ClientRating2.css';

const ClientRating2 = () => {
  const feedbacks = [
    {
      name: 'Lisa Redfern',
      img: '//c2.staticflickr.com/8/7310/buddyicons/24846422@N06_r.jpg',
      rating: 5,
      message: "Service au top ! Produits de qualité, je recommande à 100%.",
    },
    {
      name: 'Cassi',
      img: 'https://i.postimg.cc/ydBjdm20/michael-dam-m-EZ3-Po-FGs-k-unsplash-1.jpg',
      rating: 4,
      message: "Livraison rapide et bons produits. Peut mieux faire sur l'emballage.",
    },
    {
      name: 'Md Nahidul',
      img: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/451270/profile/profile-80.jpg',
      rating: 5,
      message: "Une super expérience client ! Je repasserai commande sans hésiter.",
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true, // Ajout de l'autoplay
    autoplaySpeed: 3000, // Temps de changement entre les slides (en ms)
 
  };

  return (
    <section className="customer-feedback">
      <div className="container text-center">
        <h2 className="section-title">Ce que nos clients disent sur nos promotions 💬</h2>
        <Slider {...settings}>
          {feedbacks.map((feedback, index) => (
            <div key={index} className="feedback-slider-item">
              <img
                src={feedback.img}
                className="center-block img-circle"
                alt={feedback.name}
              />
              <h3 className="customer-name">{feedback.name}</h3>
              <p>{feedback.message}</p>
              <span className="light-bg customer-rating">
                {feedback.rating}
                <i className="fa fa-star"></i>
              </span>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default ClientRating2;
