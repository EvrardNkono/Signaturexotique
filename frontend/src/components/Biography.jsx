import React from 'react';
import './Biography.css';

const BiographyFull = () => {
  return (
    <div className="biography-container">
      <h1>TOUT SAVOIR SUR NOUS</h1>
      {/* Images en haut */}
      <div className="biography-images-top">
        <img src="/assets/image1.jpg" alt="Image 1" className="biography-image" />
        <img src="/assets/image2.jpg" alt="Image 2" className="biography-image" />
        <img src="/assets/image3.jpg" alt="Image 3" className="biography-image" />
      </div>

      {/* Texte principal */}
      <div className="biography-text">
        <p>
          Je me nomme Blaise Mordret, d'origine camerounaise, marié et heureux père de trois merveilleux enfants. Ma famille représente ce que j’ai de plus cher au monde. C’est pour elle que je me lève chaque matin, animé par le désir de transmettre des valeurs solides, et de bâtir un avenir digne et prospère.
        </p>
        <p>
          Titulaire d’un cursus en comptabilité et gestion, j’ai fait le choix courageux, en 2013, de me lancer dans l’entrepreneuriat en fondant Meka France, une entreprise spécialisée dans la distribution de produits agroalimentaires. Sans capital de départ, sans soutien bancaire, j’ai pu compter sur la générosité de mes proches : un euro par-ci, quelques tréteaux par-là, et surtout, beaucoup de foi et de détermination.
        </p>
        <p>
          C’est ainsi, humblement, que j’ai commencé à vendre sur les marchés, depuis un petit étalage. Grâce à ma rigueur et à mon engagement, cet étalage a grandi, et avec lui, la confiance de mes premiers clients. Très vite, j’ai ressenti le besoin d’offrir plus de stabilité et de confort à ma clientèle. J’ai alors ouvert un premier magasin sur la place François Mitterrand à Viry-Châtillon. Ce fut une étape cruciale. Malgré les nombreux obstacles, le travail acharné et la persévérance m’ont permis d’ouvrir un second point de vente, situé au 12 rue de Draveil, à Juvisy-sur-Orge.
        </p>
        <p>
          Mais comme pour tant d’autres, la pandémie de COVID-19 est venue bouleverser notre équilibre. Elle a eu raison de notre première boutique. Cette épreuve n’a toutefois pas entamé ma détermination. Fort de plus de 12 ans d’expérience dans le secteur agroalimentaire, et entouré de collaborateurs passionnés, j’ai pris le temps d’écouter les besoins du terrain.
        </p>
        <p>
          Une étude de marché sérieuse est venue confirmer une réalité : de nombreuses personnes vivant en province ou dans des zones éloignées peinent à accéder aux produits exotiques qui leur sont chers. Face à ce constat, nous avons décidé de franchir une nouvelle étape en lançant notre site internet, une plateforme moderne, intuitive et sécurisée, conçue pour rapprocher les saveurs du monde de celles et ceux qui en ont besoin, où qu’ils soient.
        </p>
        <p>
          Nos produits proviennent d’Afrique et d’ailleurs. Pour l’Afrique, nous travaillons principalement avec des producteurs du Cameroun, du Congo, de la Côte d’Ivoire, du Burkina Faso, du Sénégal, du Mali et du Gabon.
        </p>
        <p>
          Au Cameroun, nous avons initié une belle initiative solidaire : une communauté de femmes dynamiques, actrices essentielles de la transformation locale des produits que nous commercialisons. Grâce à leur savoir-faire, à leur courage et à leur engagement, ces femmes assurent une production de qualité, tout en restant autonomes dans la gestion de leur quotidien.
        </p>
        <p>
          C’est pourquoi, pour chaque euro dépensé sur notre site, 0,10 € sont reversés à ces associations de femmes, afin de soutenir leurs actions et contribuer à l'amélioration de leurs conditions de vie. C’est notre manière, concrète et sincère, d’agir pour un commerce plus équitable et plus humain.
        </p>
        <p>
          Aujourd’hui, Meka France, c’est bien plus qu’une entreprise : c’est une aventure familiale, humaine et solidaire. Nous croyons en une alimentation qui unit les cultures, respecte les producteurs, et honore les traditions.
        </p>
        <p>
          Nous vous invitons chaleureusement à faire partie de cette belle histoire, à nous accompagner, à nous soutenir. Parce que chaque commande est un geste qui compte. Parce que, ensemble, nous pouvons aller plus loin.
        </p>
      </div>

      {/* Images en bas */}
      <div className="biography-images-bottom">
        <img src="/assets/image4.jpg" alt="Image 4" className="biography-image" />
        <img src="/assets/image5.jpg" alt="Image 5" className="biography-image" />
        <img src="/assets/image6.jpg" alt="Image 6" className="biography-image" />
      </div>
    </div>
  );
};

export default BiographyFull;
