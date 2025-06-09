import React, { useState } from "react";
import "./SendParcelForm.css";

const SendParcelForm = () => {
  const [formData, setFormData] = useState({
    senderName: "",
    senderPhone: "",
    senderEmail: "",
    recipientName: "",
    recipientPhone: "",
    city: "",
    weight: "",
    declaredValue: "",
    insurance: "",
    dropoffPoint: "",
    paymentMethod: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (paymentMethod) => (e) => {
    e.preventDefault();
    const dataToSend = { ...formData, paymentMethod };

    console.log("Formulaire soumis avec :", dataToSend);

    alert(
      `📦 Demande envoyée avec succès !\nMode de paiement : ${
        paymentMethod === "online"
          ? "💳 Paiement en ligne"
          : "🏢 Paiement lors du dépôt"
      }`
    );
  };

  return (
    <form className="parcel-form">
      <h2 className="form-title">Envoyer un colis 📦</h2>

      <div className="form-group">
        <label>Nom complet de l’expéditeur</label>
        <input name="senderName" onChange={handleChange} value={formData.senderName} required />
      </div>

      <div className="form-group">
        <label>Téléphone</label>
        <input name="senderPhone" onChange={handleChange} value={formData.senderPhone} required />
      </div>

      <div className="form-group">
        <label>Adresse e-mail</label>
        <input name="senderEmail" type="email" onChange={handleChange} value={formData.senderEmail} />
      </div>

      <div className="form-group">
        <label>Nom du destinataire</label>
        <input name="recipientName" onChange={handleChange} value={formData.recipientName} required />
      </div>

      <div className="form-group">
        <label>Téléphone (Cameroun)</label>
        <input name="recipientPhone" onChange={handleChange} value={formData.recipientPhone} required />
      </div>

      <div className="form-group">
        <label>Ville de livraison</label>
        <select name="city" onChange={handleChange} value={formData.city} required>
          <option value="">Sélectionner</option>
          <option>Douala</option>
          <option>Yaoundé</option>
          <option>Bafoussam</option>
          <option>Garoua</option>
          <option>Autre</option>
        </select>
      </div>

      <div className="form-group">
        <label>Poids estimé (kg)</label>
        <input name="weight" type="number" min="0.1" step="0.1" onChange={handleChange} value={formData.weight} required />
      </div>

      <div className="form-group">
        <label>Valeur déclarée (€)</label>
        <input name="declaredValue" type="number" step="1" onChange={handleChange} value={formData.declaredValue} />
        <small>Utile pour l’assurance</small>
      </div>

      <div className="form-group">
        <label>Assurance ?</label>
        <select name="insurance" onChange={handleChange} value={formData.insurance} required>
          <option value="">Choisir</option>
          <option value="non">Non</option>
          <option value="oui">Oui – à partir de 5 €</option>
        </select>
      </div>

      <div className="form-group">
        <label>Point de dépôt</label>
        <select name="dropoffPoint" onChange={handleChange} value={formData.dropoffPoint} required>
          <option value="">Sélectionner</option>
          <option>Paris</option>
          <option>Lyon</option>
          <option>Marseille</option>
          <option>Autre</option>
        </select>
      </div>

      <div className="form-buttons">
        <button onClick={handleSubmit("online")} className="btn online">💳 Payer en ligne maintenant</button>
        <button onClick={handleSubmit("on_dropoff")} className="btn dropoff">🏢 Payer lors du dépôt du colis</button>
      </div>
    </form>
  );
};

export default SendParcelForm;
