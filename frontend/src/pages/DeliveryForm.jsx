import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import CountryFlag from "react-world-flags";
import {
  FaMapMarkerAlt,
  FaUserAlt,
  FaCity,
  FaGlobeEurope,
  FaShieldAlt,
  FaWeightHanging,
} from "react-icons/fa";
import "./DeliveryForm.css";

import CalculateDistance from "../api/calculateDistance";
import { calculateDeliveryCost } from "../utils/deliveryTariffs";

const DeliveryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    hasInsurance: false,
    zone: "",
    deliveryMethod: "",
    distance: 0,
    deliveryCost: 0,
    weight: 0,
    totalPrice: localStorage.getItem("cartTotal") || 0,
  });

  const totalPrice = localStorage.getItem("cartTotal");
  const totalWeight = localStorage.getItem("totalWeight");

  const countries = [
    { name: "Allemagne", code: "DE", zone: "Zone 1" },
    { name: "France", code: "FR", zone: "Zone 1" },
    { name: "Belgique", code: "BE", zone: "Zone 1" },
    { name: "Luxembourg", code: "LU", zone: "Zone 1" },
    { name: "Pays-Bas", code: "NL", zone: "Zone 1" },
    { name: "Autriche", code: "AT", zone: "Zone 2" },
    { name: "Espagne", code: "ES", zone: "Zone 2" },
    { name: "Italie", code: "IT", zone: "Zone 2" },
    { name: "Portugal", code: "PT", zone: "Zone 2" },
    { name: "République d’Irlande", code: "IE", zone: "Zone 2" },
    { name: "Royaume-Uni", code: "GB", zone: "Zone 2" },
    { name: "Danemark", code: "DK", zone: "Zone 3" },
    { name: "Suède", code: "SE", zone: "Zone 3" },
  ];

  const debouncedUpdateAddress = useCallback(
    debounce(async (address) => {
      try {
        const distanceRaw = await CalculateDistance(address);
        const distance = parseFloat(distanceRaw);
        if (isNaN(distance)) return;

        const poidsConverti = totalWeight ? parseFloat(totalWeight) / 1000 : 0;

        const deliveryCost = calculateDeliveryCost({
          distance,
          weight: poidsConverti,
          hasInsurance: formData.hasInsurance,
          mode: distance > 40 ? formData.deliveryMethod : "livraison",
        });

        setFormData((prev) => ({
          ...prev,
          distance: distance.toFixed(2),
          deliveryCost,
        }));
      } catch (err) {
        console.error("Erreur de calcul de distance :", err);
      }
    }, 700),
    [formData.hasInsurance, formData.deliveryMethod, totalWeight]
  );

  const updateDeliveryCost = async (newData = {}, recalculateDistance = false) => {
    let distance = parseFloat(formData.distance);

    if (recalculateDistance && newData.address) {
      try {
        const distanceRaw = await CalculateDistance(newData.address);
        distance = parseFloat(distanceRaw);
        if (isNaN(distance)) return;
      } catch (err) {
        console.error("Erreur lors du calcul de la distance :", err);
        return;
      }
    }

    const poidsConverti = totalWeight ? parseFloat(totalWeight) / 1000 : 0;

    const deliveryCost = calculateDeliveryCost({
      distance,
      weight: newData.weight ?? poidsConverti,
      hasInsurance: newData.hasInsurance ?? formData.hasInsurance,
      mode: distance > 40 ? newData.deliveryMethod ?? formData.deliveryMethod : "livraison",
    });

    setFormData((prev) => {
      const safeData = { ...prev };
      for (let key in newData) {
        if (newData[key] !== undefined) {
          safeData[key] = newData[key];
        }
      }
      return {
        ...safeData,
        distance: distance.toFixed(2),
        deliveryCost,
      };
    });
  };

  const debouncedUpdateDeliveryCost = useCallback(
    debounce((data, recalc) => updateDeliveryCost(data, recalc), 500),
    [formData]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "address") debouncedUpdateAddress(value);
  };

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    const selectedCountry = countries.find((c) => c.name === countryName);
    setFormData((prev) => ({
      ...prev,
      country: countryName,
      zone: selectedCountry?.zone || "",
    }));
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({ ...prev, hasInsurance: checked }));
    debouncedUpdateDeliveryCost({ hasInsurance: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(formData.distance) > 40 && !formData.deliveryMethod) {
      alert("Veuillez sélectionner un mode d’expédition.");
      return;
    }
    console.log("Formulaire soumis :", formData);
  };


  return (
    <form className="delivery-form" onSubmit={handleSubmit}>
  <h2 className="form-title">Détails de livraison</h2>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="form-group">
      <label htmlFor="name"><FaUserAlt /> Nom</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Entrez votre nom complet"
      />
    </div>

    <div className="form-group">
      <label htmlFor="address"><FaMapMarkerAlt /> Adresse</label>
      <input
        type="text"
        id="address"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="Entrez votre adresse"
      />
    </div>

    <div className="form-group">
      <label htmlFor="city"><FaCity /> Ville</label>
      <input
        type="text"
        id="city"
        name="city"
        value={formData.city}
        onChange={handleInputChange}
        placeholder="Entrez votre ville"
      />
    </div>

    <div className="form-group">
      <label htmlFor="postalCode">Code Postal</label>
      <input
        type="text"
        id="postalCode"
        name="postalCode"
        value={formData.postalCode}
        onChange={handleInputChange}
        placeholder="Code postal"
      />
    </div>

    <div className="form-group col-span-1 md:col-span-2">
      <label htmlFor="country"><FaGlobeEurope /> Pays</label>
      <div className="country-select flex items-center gap-2">
        <select
          id="country"
          name="country"
          value={formData.country}
          onChange={handleCountryChange}
        >
          <option value="">-- Sélectionnez un pays --</option>
          {countries.map((country) => (
            <option key={country.code} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
        {formData.country && (
          <CountryFlag
            code={countries.find((c) => c.name === formData.country).code}
            alt={formData.country}
            style={{ width: "24px", height: "16px" }}
          />
        )}
      </div>
    </div>

    <div className="form-group">
      <label>Poids total (kg)</label>
      <p>{(totalWeight / 1000).toFixed(2)} kg</p>
    </div>

    <div className="form-group">
      <label>Prix total du panier (€)</label>
      <p>{formData.totalPrice} €</p>
    </div>

    <div className="form-group md:col-span-2">
      <label>
        <input
          type="checkbox"
          checked={formData.hasInsurance}
          onChange={handleCheckboxChange}
        />
        <FaShieldAlt /> Assurance
      </label>
    </div>

    <div className="form-group md:col-span-2">
      <label>Distance (km)</label>
      <p>{formData.distance} km</p>
    </div>

    {parseFloat(formData.distance) > 40 && (
      <div className="form-group md:col-span-2">
        <label>Méthode d’expédition</label>
        <div className="delivery-options">
          {[
            {
              label: "Colissimo Domicile sans signature",
              value: "Colissimo Domicile sans signature",
              image: "/assets/colis.png",
            },
            {
              label: "Colissimo Point Retrait",
              value: "Colissimo Point Retrait",
              image: "/assets/relais.png",
            },
            {
              label: "Colissimo Domicile avec signature",
              value: "Colissimo Domicile avec signature",
              image: "/assets/avec_signature.png",
            },
          ].map((option) => (
            <div
              key={option.value}
              className={`delivery-option ${formData.deliveryMethod === option.value ? "selected" : ""}`}
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  deliveryMethod: option.value,
                }));
                debouncedUpdateDeliveryCost({ deliveryMethod: option.value });
              }}
            >
              <img src={option.image} alt={option.label} />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {formData.deliveryCost != null && (
      <div className="form-group md:col-span-2">
        <label>Frais de livraison (€)</label>
        <p className="text-green-600 font-semibold">{formData.deliveryCost} €</p>
      </div>
    )}

    <div className="form-group md:col-span-2">
      <button type="submit" className="submit-button">Valider</button>
    </div>
  </div>
</form>

  );
};

export default DeliveryForm;
