import axios from 'axios';

const apiKey = import.meta.env.VITE_ORS_API_KEY;
 // Remplace par ta vraie clé API
const origin = [2.3849, 48.6891]; // Coordonnées de départ (long, lat) - Juvisy-sur-Orge

export default async function CalculateDistance(address) {
  try {
    console.log("Adresse reçue pour calcul de distance :", address);

    // Étape 1 : Géocodage de l’adresse client
    const geocodeUrl = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`;

    const geocodeRes = await axios.get(geocodeUrl);
    console.log("Réponse géocodage :", geocodeRes.data);

    const coordinates = geocodeRes.data?.features?.[0]?.geometry?.coordinates;
    if (!coordinates) {
      console.warn("Adresse invalide ou non trouvée par ORS.");
      return null;
    }

    console.log("Coordonnées destination :", coordinates);

    // Étape 2 : Calcul de distance avec ORS Directions
    const directionsUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';
    const body = {
      coordinates: [origin, coordinates],
    };

    const directionRes = await axios.post(directionsUrl, body, {
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
      },
    });

    console.log("Réponse directions :", directionRes.data);

    const distanceInMeters = directionRes.data.routes[0].summary.distance;
    const distanceInKm = distanceInMeters / 1000;

    console.log("Distance en km (brut) :", distanceInKm);

    // Arrondi à 2 décimales, retourne un Number
    const finalDistance = Number(distanceInKm.toFixed(2));
    console.log("Distance finale arrondie :", finalDistance);

    return finalDistance;

  } catch (error) {
    console.error("Erreur lors du calcul de distance :", error);
    return null;
  }
}
