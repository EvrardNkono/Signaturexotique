import React from 'react';
import './NewsletterPage.css';

// Utilisation correcte des images dans public/
const brandImage = '/assets/brand-launch.jpg';
const deliveryImage = '/assets/delivery.jpg';
const promoImage = '/assets/promo.jpg';
const seasonImage = '/assets/season.jpg';
const recipeImage = '/assets/recette-taro.jpg'; // Ajoute cette image dans public/assets/
const NewsletterPage = () => {
  return (
    <section className="newsletter-page">
      <div className="container">
        <h1 className="title">🌍 Bienvenue dans l’univers Meka France 🌶</h1>
        <p className="intro">Découvrez notre aventure humaine, nos saveurs exotiques et notre nouvelle marque <strong>Signature Exotique</strong> 🌿</p>

        {/* Bloc 1 - Lancement de la marque */}
        <div className="bloc bloc-brand" style={{ backgroundImage: `url(${brandImage})` }}>
          <div className="bloc-content">
            <h2>✨ Lancement de notre marque : <span>Signature Exotique</span></h2>
            <p>
              Une collection authentique de produits faits avec passion et savoir-faire. <br />
              🌶 <strong>Épices & mélanges maison</strong> pour sublimer vos plats<br />
              🥜 <strong>Apéritifs salés & sucrés</strong>, pimentés juste comme il faut<br />
              🍵 <strong>Tisanes & thés</strong> pour des instants bien-être, à la camerounaise !
            </p>
          </div>
        </div>

        {/* Bloc 2 - Livraison */}
        <div className="bloc bloc-delivery" style={{ backgroundImage: `url(${deliveryImage})` }}>
          <div className="bloc-content">
            <h2>🚚 Des livraisons rapides, partout en France</h2>
            <p>
              Commandez en quelques clics et recevez vos produits préférés à domicile. <br />
              Fraîcheur garantie, service aux petits oignons. Vos produits exotiques, sans compromis.
            </p>
          </div>
        </div>

        {/* Bloc 3 - Bons plans */}
        <div className="bloc bloc-promos" style={{ backgroundImage: `url(${promoImage})` }}>
          <div className="bloc-content">
            <h2>🎁 Nos bons plans à venir</h2>
            <ul>
              <li>✔️ Réductions de lancement sur Signature Exotique</li>
              <li>✔️ Packs découverte pour les gourmands</li>
              <li>✔️ Offres en gros pour les familles & revendeurs</li>
            </ul>
          </div>
        </div>

        {/* Bloc 4 - Teasing saisonnier */}
        <div className="bloc bloc-season" style={{ backgroundImage: `url(${seasonImage})` }}>
          <div className="bloc-content">
            <h2>🌾 La saison des arachides approche…</h2>
            <p>
              Préparez-vous pour une sélection exceptionnelle de produits de saison. <br />
              Et ce n’est que le début ! Manioc, gingembre, hibiscus, feuilles africaines… Le meilleur est à venir 🌺
            </p>
            <div className="teaser-banner">🌱 *Signature Exotique, une saveur à chaque saison.*</div>
          </div>
        </div>

        {/* Bloc 5 - Recettes alléchantes */}
        <div className="bloc bloc-recipes" style={{ backgroundImage: `url(${recipeImage})` }}>
          <div className="bloc-content">
            <h2>🍽 Nos recettes alléchantes à venir</h2>
            <p>
              Préparez vos papilles ! Bientôt en ligne, une sélection de plats traditionnels exotiques à tester chez vous. <br />
              🥘 <strong>Le fameux taro à la sauce jaune</strong> – une merveille camerounaise qui fait danser les papilles <br />
              🍛 Recettes de manioc, ndolé, riz au coco, et bien d’autres trésors culinaires à découvrir.
            </p>
            <div className="teaser-banner">👨🏽‍🍳 *Des recettes pour voyager depuis votre cuisine !*</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterPage;
