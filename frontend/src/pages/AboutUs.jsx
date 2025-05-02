import React from 'react';
import './AboutUs.css';
import { Link } from 'react-router-dom';

const sections = [
  {
    title: "Qui sommes-nous ?",
    content: "Chez Meka France, nous sommes spécialisés dans le commerce, l'importation et l'exportation de produits agroalimentaires et exotiques en provenance d'Afrique, d'Asie, des Caraïbes et d'ailleurs. Nous vous proposons des saveurs authentiques, issues de cultures riches et diversifiées, pour offrir à vos repas un voyage culinaire unique. Meka France, c’est l’expertise et la passion des produits du monde entier, à votre service.",
    image: "/assets/aboutus1.jpg",
  },
  {
    title: "Notre Mission",
    content: "Notre mission est de rendre accessible la richesse des produits agroalimentaires et exotiques en provenance d'Afrique, d'Asie, des Caraïbes et d'ailleurs. Nous nous engageons à offrir des produits de qualité, issus de collaborations avec des producteurs passionnés à travers le monde, tout en respectant des valeurs de commerce équitable et humain. Nous souhaitons démocratiser les saveurs exotiques, en les apportant au cœur de la France, de l’Europe et au-delà, tout en soutenant des pratiques commerciales éthiques et durables.",
    image: "/assets/aboutus2.jpg",
  },
  {
    title: "Nos Valeurs",
    content: "Passion, authenticité, qualité, respect des traditions et ouverture sur le monde. Voilà ce qui guide Meka France au quotidien.",
    image: "/assets/aboutus3.jpg",
  },
  {
    title: "Engagement Humanitaire",
    content: "Chez Meka France, nous nous engageons activement dans des actions solidaires concrètes au Cameroun, notamment dans les secteurs de l'éducation, de la santé et de la culture. Nous croyons que l'entrepreneuriat doit avoir un impact positif et durable, c'est pourquoi nous soutenons des initiatives qui transforment des vies et favorisent le bien-être des communautés locales. Pour nous, chaque réussite d’entreprise est une occasion de partager et de redonner aux autres, en construisant un avenir meilleur et plus équitable.",    
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
        <Link to="/contact">
          <button>Contactez-nous</button>
        </Link>
      </div>
    </section>
  );
};

export default AboutUs;
