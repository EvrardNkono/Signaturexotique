// utils/deliveryTariffs.js

export const deliveryTariffs = {
    "Colissimo Domicile sans signature": [
      { weight: 0.25, price: 6.41 },
      { weight: 0.5, price: 7.22 },
      { weight: 0.75, price: 8.06 },
      { weight: 1, price: 8.74 },
      { weight: 2, price: 9.8 },
      { weight: 3, price: 10.75 },
      { weight: 4, price: 11.73 },
      { weight: 5, price: 12.66 },
      { weight: 6, price: 13.25 },
      { weight: 7, price: 14.17 },
      { weight: 8, price: 15.1 },
      { weight: 9, price: 16.06 },
      { weight: 10, price: 16.98 },
      { weight: 11, price: 17.56 },
      { weight: 12, price: 18.48 },
      { weight: 13, price: 19.38 },
      { weight: 14, price: 20.32 },
      { weight: 15, price: 21.24 },
      { weight: 16, price: 22.14 },
      { weight: 17, price: 23.05 },
      { weight: 18, price: 23.98 },
      { weight: 19, price: 24.9 },
      { weight: 20, price: 25.8 },
      { weight: 21, price: 26.46 },
      { weight: 22, price: 27.35 },
      { weight: 23, price: 28.28 },
      { weight: 24, price: 29.19 },
      { weight: 25, price: 30.06 },
      { weight: 26, price: 30.99 },
      { weight: 27, price: 31.87 },
      { weight: 28, price: 32.79 },
      { weight: 29, price: 33.73 },
      { weight: 30, price: 34.59 },
    ],
    "Colissimo Domicile avec signature": [
      { weight: 0.25, price: 7.41 },
      { weight: 0.5, price: 8.22 },
      { weight: 0.75, price: 9.05 },
      { weight: 1, price: 9.73 },
      { weight: 2, price: 10.8 },
      { weight: 3, price: 11.75 },
      { weight: 4, price: 12.72 },
      { weight: 5, price: 13.66 },
      { weight: 6, price: 14.25 },
      { weight: 7, price: 15.17 },
      { weight: 8, price: 16.09 },
      { weight: 9, price: 17.05 },
      { weight: 10, price: 17.98 },
      { weight: 11, price: 18.56 },
      { weight: 12, price: 19.47 },
      { weight: 13, price: 20.37 },
      { weight: 14, price: 21.33 },
      { weight: 15, price: 22.24 },
      { weight: 16, price: 23.14 },
      { weight: 17, price: 24.5 },
      { weight: 18, price: 24.97 },
      { weight: 19, price: 25.89 },
      { weight: 20, price: 26.79 },
      { weight: 21, price: 27.46 },
      { weight: 22, price: 28.36 },
      { weight: 23, price: 29.27 },
      { weight: 24, price: 30.18 },
      { weight: 25, price: 31.06 },
      { weight: 26, price: 31.99 },
      { weight: 27, price: 32.88 },
      { weight: 28, price: 33.79 },
      { weight: 29, price: 34.73 },
      { weight: 30, price: 35.59 },
    ],
    "Colissimo Point Retrait": [
      { weight: 0.25, price: 4.88 },
      { weight: 0.5, price: 5.68 },
      { weight: 0.75, price: 6.54 },
      { weight: 1, price: 7.22 },
      { weight: 2, price: 8.27 },
      { weight: 3, price: 9.22 },
      { weight: 4, price: 10.19 },
      { weight: 5, price: 11.13 },
      { weight: 6, price: 11.73 },
      { weight: 7, price: 12.64 },
      { weight: 8, price: 13.57 },
      { weight: 9, price: 14.53 },
      { weight: 10, price: 15.44 },
      { weight: 11, price: 16.04 },
      { weight: 12, price: 16.96 },
      { weight: 13, price: 17.86 },
      { weight: 14, price: 18.08 },
      { weight: 15, price: 19.7 },
      { weight: 16, price: 20.61 },
      { weight: 17, price: 21.52 },
      { weight: 18, price: 22.44 },
      { weight: 19, price: 23.37 },
      { weight: 20, price: 24.26 },
      { weight: 21, price: 24.92 },
      { weight: 22, price: 25.82 },
      { weight: 23, price: 26.75 },
      { weight: 24, price: 27.65 },
      { weight: 25, price: 28.54 },
      { weight: 26, price: 29.45 },
      { weight: 27, price: 30.36 },
      { weight: 28, price: 31.27 },
      { weight: 29, price: 32.19 },
      { weight: 30, price: 33.07 },
    ],
  };
  
  
  // Fonction pour obtenir le prix de livraison en fonction du mode et du poids
// Fonction pour obtenir le prix en fonction du poids et du mode
export function getDeliveryPrice(mode, weight) {
    const tariffs = deliveryTariffs[mode];
    if (!tariffs) {
      console.error(`Mode de livraison introuvable : ${mode}`);
      return null; // Mode de livraison introuvable
    }
  
    if (weight == null || weight < 0) {
      console.error(`Poids invalide : ${weight}`);
      return null; // Poids invalide
    }
  
    for (let i = tariffs.length - 1; i >= 0; i--) {
      if (weight >= tariffs[i].weight) {
        return tariffs[i].price;
      }
    }
  
    return null; // Aucun tarif trouvé pour ce poids
  }

  export function calculateInsuranceFee(total, withInsurance) {
  if (!withInsurance) return 0;

  const levels = [
    { min: 5000, fee: 33.00 },
    { min: 2000, fee: 13.20 },
    { min: 1000, fee: 6.60 },
    { min: 500, fee: 3.30 },
    { min: 300, fee: 2.20 },
    { min: 150, fee: 1.10 },
  ];

  const level = levels.find(l => total >= l.min);
  return level ? level.fee : 0;
}


// Mise à jour de la fonction de calcul des frais de livraison
export function calculateDeliveryCost({ distance, weight, hasInsurance, mode, totalPrice }) {
    console.log('Paramètres reçus pour calcul des frais :', { distance, weight, hasInsurance, mode, totalPrice });

    if (distance == null || weight == null) {
        console.error('Erreur : distance ou poids manquants');
        return null;
    }

    let deliveryCost = 0;

    if (distance <= 20) {
        if (totalPrice >= 100) {
            console.log('Livraison gratuite (distance <= 20 km ET total ≥ 100 €)');
            deliveryCost = 0;
        } else {
            console.log('Frais fixe (distance <= 20 km mais total < 100 €)');
            deliveryCost = 5; // frais fixe pour livraison locale
        }
    } else if (distance <= 30) {
        deliveryCost = 5;
    } else if (distance <= 40) {
        deliveryCost = 10;
    } else {
        console.log('Calcul basé sur le poids pour une distance > 40 km');

        if (!mode) {
            console.error('Mode requis pour calculer les frais d’expédition');
            return null;
        }

        deliveryCost = getDeliveryPrice(mode, weight);

        if (deliveryCost == null) {
            console.error('Erreur dans le calcul du prix de livraison pour une distance > 40 km');
            return null;
        }
    }

    


    if (hasInsurance) {
        console.log('Assurance ajoutée');
        const assuranceFee = calculateInsuranceFee(totalPrice, hasInsurance);
deliveryCost += assuranceFee;console.log(`💸 Frais d'assurance ajoutés : ${assuranceFee} €`);


    }

    console.log('Frais de livraison calculés :', deliveryCost);
    return deliveryCost;
}




  
  export function updateDeliveryCost(formData) {
  const { mode, weight, distance, hasInsurance } = formData;

  // ✅ Récupération automatique du total depuis le panier localStorage
  const totalPrice = parseFloat(localStorage.getItem("cartTotal")) || 0;
  console.log('Total du panier récupéré depuis localStorage :', totalPrice);

  // Vérification des paramètres reçus
  if (mode == null || weight == null || distance == null) {
    console.error('Données invalides pour updateDeliveryCost', formData);
    return;
  }

  // Appel à la fonction de calcul des frais (ajout du totalPrice)
  const deliveryCost = calculateDeliveryCost({ mode, weight, distance, hasInsurance, totalPrice });

  if (deliveryCost != null) {
    console.log('Frais de livraison calculés:', deliveryCost);

    // Mettre à jour les données si besoin
    formData.deliveryCost = deliveryCost;

    // Message facultatif pour l’interface
    if (distance <= 20 && totalPrice >= 100) {
      formData.message = "Livraison offerte 🎉 pour les commandes locales supérieures à 100 € !";
    } else {
      formData.message = `Frais de livraison : ${deliveryCost.toFixed(2)} €`;
    }
  } else {
    console.error('Le calcul des frais de livraison a échoué.');
    formData.message = "Erreur dans le calcul des frais de livraison.";
  }
}




  
  