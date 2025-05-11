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
  

// Mise à jour de la fonction de calcul des frais de livraison
export function calculateDeliveryCost({ distance, weight, hasInsurance, mode }) {
    console.log('Paramètres reçus pour calcul des frais :', { distance, weight, hasInsurance, mode });

    // Gestion des valeurs manquantes
    if (distance == null || weight == null) {
        console.error('Erreur : distance ou poids manquants');
        return null;
    }

    let deliveryCost = 0;

    // Livraison locale (calcul selon distance)
    if (distance <= 20) {
        deliveryCost = 0; // Livraison gratuite
    } else if (distance <= 30) {
        deliveryCost = 5;
    } else if (distance <= 40) {
        deliveryCost = 10;
    } else {
        // Expédition (distance > 40 km)
        console.log('Calcul basé sur le poids pour une distance > 40 km');

        // Vérification du mode de livraison pour une distance > 40 km
        if (!mode) {
            console.error('Mode requis pour calculer les frais d’expédition');
            return null;
        }

        // Appel de la fonction getDeliveryPrice selon le mode et le poids
        deliveryCost = getDeliveryPrice(mode, weight);

        if (deliveryCost == null) {
            console.error('Erreur dans le calcul du prix de livraison pour une distance > 40 km');
            return null;
        }
    }

    // Frais d’assurance si cochée
    if (hasInsurance) {
        console.log('Assurance ajoutée');
        deliveryCost += 2; // Exemple : 2€ en plus pour l'assurance
    }

    console.log('Frais de livraison calculés :', deliveryCost);
    return deliveryCost;
}



  
  export function updateDeliveryCost(formData) {
    const { mode, weight, distance, hasInsurance } = formData;
  
    // Vérification des paramètres reçus
    if (mode == null || weight == null || distance == null) {
      console.error('Données invalides pour updateDeliveryCost', formData);
      return;
    }
  
    // Appel à la fonction de calcul des frais
    const { deliveryCost, message } = calculateDeliveryCost({ mode, weight, distance, hasInsurance });
  
    if (deliveryCost != null) {
      console.log('Frais de livraison calculés:', deliveryCost);
      console.log('Message associé:', message);
  
      // Mettre à jour l'interface utilisateur avec le message et le coût
      // Exemple : formData.deliveryCost = deliveryCost;
      // Exemple : formData.message = message;
    } else {
      console.error('Le calcul des frais de livraison a échoué.', message);
    }
  }
  
  