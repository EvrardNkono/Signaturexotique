import React, { useState } from 'react';
import './AboutUs.css';
import { Link } from 'react-router-dom';
import Biography from '../components/Biography';

const sections = [
  {
    title: "Qui sommes-nous ?",
    content: [
      "Chez Meka France, nous sommes spécialisés dans le commerce, l'importation et l'exportation de produits agroalimentaires et exotiques en provenance d'Afrique, d'Asie, des Caraïbes et d'ailleurs.",
      "Nous vous proposons des saveurs authentiques, issues de cultures riches et diversifiées, pour offrir à vos repas un voyage culinaire unique.",
      { quote: "Meka France, c’est l’expertise et la passion des produits du monde entier, à votre service." }
    ],
    image: "/assets/aboutus1.jpg",
  },
  {
    title: "Notre Mission",
    content: [
      "Notre mission est de rendre accessible la richesse des produits agroalimentaires et exotiques en provenance d'Afrique, d'Asie, des Caraïbes et d'ailleurs.",
      "Nous nous engageons à offrir des produits de qualité, issus de collaborations avec des producteurs passionnés à travers le monde.",
      { quote: "Nous souhaitons démocratiser les saveurs exotiques, en les apportant au cœur de la France, de l’Europe et au-delà." }
    ],
    image: "/assets/aboutus2.jpg",
  },
  {
    title: "Nos Valeurs",
    content: [
      "Passion, authenticité, qualité, respect des traditions et ouverture sur le monde.",
      { quote: "Voilà ce qui guide Meka France au quotidien." }
    ],
    image: "/assets/aboutus3.jpg",
  },
  {
    title: "Engagement Humanitaire",
    content: [
      "Nous nous engageons activement dans des actions solidaires concrètes au Cameroun : éducation, santé et culture.",
      { quote: "Chaque réussite d’entreprise est une occasion de redonner." },
      "Nous croyons que l'entrepreneuriat doit avoir un impact positif et durable."
    ],
    image: "/assets/aboutus4.jpg",
  }
];

const AboutUs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="about-us-container">
      <Biography />

      {sections.map((section, index) => (
        <div key={index} className="accordion-section">
          <div
            className="accordion-header"
            onClick={() => toggleAccordion(index)}
          >
            <h2>{section.title}</h2>
            <span>{openIndex === index ? '-' : '+'}</span>
          </div>

          {openIndex === index && (
            <div className="accordion-content">
              <div className="accordion-image">
                <img src={section.image} alt={section.title} />
              </div>
              <div className="accordion-text">
                {section.content.map((item, i) =>
                  typeof item === 'string' ? (
                    <p key={i}>{item}</p>
                  ) : (
                    <blockquote key={i}>{item.quote}</blockquote>
                  )
                )}
              </div>
            </div>
          )}
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
