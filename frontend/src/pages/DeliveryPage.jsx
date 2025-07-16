import React from "react";
import "./DeliveryPage.css";
import { useNavigate } from "react-router-dom";

const DeliveryPage = () => {
  const navigate = useNavigate();

  return (
    <div className="delivery-container">
      <header>
        <h1>Livraison de Colis au Cameroun 🇨🇲</h1>
        <p className="subtitle">
          Envoyez vos colis en toute sérénité. Simple, rapide, sécurisé.
        </p>
      </header>

      <button className="btn-action" onClick={() => navigate("/envoyer-colis")}>
        Remplir le formulaire d’envoi
      </button>

      <section className="advantages">
        <h2>Pourquoi nous choisir ?</h2>
        <ul>
          <li>Livraison sécurisée & traçable</li>
          <li>Délais rapides (7 à 15 jours ouvrés)</li>
          <li>Service client disponible 7j/7</li>
          <li>Points de dépôt partout au Cameroun</li>
        </ul>
      </section>

      <footer className="contact-section">
        <h2>Contactez-nous</h2>
        <div className="contact-details">
          <a href="https://wa.me/33644951184" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            📱 +33 6 44 95 11 84
          </a>
          <a href="mailto:mekafrance@outlook.fr" aria-label="Email">
            📧 mekafrance@outlook.fr
          </a>
        </div>
        <p className="availability">Service client 7j/7 — Toujours là pour vous !</p>
      </footer>
    </div>
  );
};

export default DeliveryPage;
