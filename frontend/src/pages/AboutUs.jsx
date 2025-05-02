import React from 'react';
import './AboutUs.css';

const sections = [
  {
    title: "Qui sommes-nous ?",
    content: "Meka France fait la promotion de produits agroalimentaires et exotiques provenant d'Afrique, d'Asie, des Caraïbes et d'ailleurs. Nous célébrons la richesse des cultures à travers leurs saveurs authentiques.",
    image: "/assets/aboutus1.jpg",
  },
  {
    title: "Notre Mission",
    content: "Offrir une vitrine aux producteurs du monde en valorisant leurs produits et en favorisant un commerce éthique, équitable et humain.",
    image: "/assets/aboutus2.jpg",
  },
  {
    title: "Nos Valeurs",
    content: "Passion, authenticité, qualité, respect des traditions et ouverture sur le monde. Voilà ce qui guide Meka France au quotidien.",
    image: "/assets/aboutus3.jpg",
  },
  {
    title: "Engagement Humanitaire",
    content: "Nous soutenons des actions concrètes au Cameroun : éducation, santé, culture. Parce que pour nous, entreprendre rime avec partager.",
    image: "/assets/aboutus4.jpg",
  }
];

const AboutUs = () => {
  return (
    <section className="about-us-container">
      {sections.map((section, index) => (
        <div
          key={index}
          className={`about-us-section ${index % 2 !== 0 ? 'reverse' : ''}`}
        >
          <div className="about-us-text">
            <h2>{section.title}</h2>
            <p>{section.content}</p>
          </div>
          <div className="about-us-image">
            <img src={section.image} alt={section.title} />
          </div>
        </div>
      ))}

      <div className="about-us-cta">
        <h3>Envie de collaborer avec nous ?</h3>
        <p>N'hésitez pas à nous contacter pour toute demande de partenariat, projet ou information.</p>
        <button>Contactez-nous</button>
      </div>
    </section>
  );
};

export default AboutUs;
