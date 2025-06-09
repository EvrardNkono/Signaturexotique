import React from "react";
import "./DeliveryPage.css";
import { useNavigate } from "react-router-dom";

const DeliveryPageTemp = () => {
  const navigate = useNavigate();

  return (
    <div className="page-livraison">
      <h1>Livraison de Colis au Cameroun 🇨🇲</h1>

      <p>
        Envoyer un colis au Cameroun n’a jamais été aussi simple ! Grâce à notre service de livraison
        fiable, vos proches reçoivent leurs colis en toute sécurité, où qu’ils soient au pays.
      </p>

       {/* 👇 Ici, le bouton vers le formulaire */}
      <div className="form-button-wrapper">
        <button className="btn-orange" onClick={() => navigate("/envoyer-colis")}>
          ✍️ Remplir le formulaire d’envoi
        </button>
      </div>

      <section>
        <h2>Pourquoi choisir notre service ?</h2>
        <ul>
          <li>✅ Livraison sécurisée et traçable</li>
          <li>✅ Délais optimisés (7 à 15 jours ouvrés)</li>
          <li>✅ Tarifs compétitifs, adaptés au poids et à la destination</li>
          <li>✅ Assurance colis disponible selon la valeur déclarée</li>
          <li>✅ Service client réactif pour vous accompagner</li>
        </ul>
      </section>

      <section>
        <h2>Zones desservies</h2>
        <p>
         Cameroun
        </p>
      </section>

      <section>
        <h2>Tarifs & Délais</h2>
        <table>
          <thead>
            <tr>
              <th>Poids</th>
              <th>Tarif</th>
              <th>Délai</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0 - 5 kg</td>
              <td>35 €</td>
              <td>7 à 10 jours</td>
            </tr>
            <tr>
              <td>5 - 10 kg</td>
              <td>60 €</td>
              <td>7 à 10 jours</td>
            </tr>
            <tr>
              <td>10 - 20 kg</td>
              <td>100 €</td>
              <td>7 à 10 jours</td>
            </tr>
          </tbody>
        </table>
        <p className="note">* Assurance facultative à partir de 5 € selon la valeur de votre colis.</p>
      </section>

      <section>
        <h2>Comment ça marche ?</h2>
        <ol>
          <li>📦 Préparez votre colis</li>
          <li>📲 Remplissez le formulaire ou contactez-nous via WhatsApp</li>
          <li>📍 Choisissez le point de depos du colis</li>
          <li>💳 Payez en ligne ou en agence</li>
          <li>📬 Suivez votre livraison</li>
        </ol>
      </section>

      <section>
        <h2>Besoin d’aide ?</h2>
        <p>
          Contactez-nous par WhatsApp au <strong>+33 0644951184 </strong> ou par email à{" "}
          <strong>mekafrance@outlook.fr</strong>. Service disponible 7j/7 !
        </p>
      </section>
    </div>
  );
};

export default DeliveryPageTemp;
