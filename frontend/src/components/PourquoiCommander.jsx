import React from 'react';
import './PourquoiCommander.css';
import { FaHandHoldingHeart, FaTruck, FaLeaf, FaGlobeAfrica } from 'react-icons/fa';

const PourquoiCommander = () => {
  return (
    <section className="pourquoi-commander">
      <div className="container">
        <h2 className="section-title">Pourquoi commander chez nous ?</h2>
        <p className="section-subtitle">Meka France, bien plus qu’une entreprise… Une aventure humaine, une mission solidaire, un goût d’ailleurs livré chez vous.</p>

        <div className="avantages-grid">

          <div className="avantage">
            <FaHandHoldingHeart className="icon" />
            <h3>Achat solidaire</h3>
            <p>Pour chaque commande, vous soutenez des associations de femmes au Cameroun qui transforment les produits localement. 0,10 € reversés par euro dépensé.</p>
          </div>

          <div className="avantage">
            <FaLeaf className="icon" />
            <h3>Produits authentiques & de qualité</h3>
            <p>Des saveurs exotiques soigneusement sélectionnées, en direct des producteurs, pour une alimentation saine, authentique et responsable.</p>
          </div>

          <div className="avantage">
            <FaGlobeAfrica className="icon" />
            <h3>12 ans d’expertise terrain</h3>
            <p>Une entreprise fondée sur la rigueur, l’expérience et une passion vraie pour les cultures et les saveurs du monde.</p>
          </div>
        </div>

        <div className="cta">
          <p>✨ Rejoignez une aventure humaine et savoureuse. Faites partie du changement, commandez sur Meka France ✨</p>
        </div>
      </div>
    </section>
  );
};

export default PourquoiCommander;
