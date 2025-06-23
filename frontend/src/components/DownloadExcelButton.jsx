import React, { useState } from 'react';
import { API_URL } from '../config';

const DownloadExcelButton = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      alert('Merci de sélectionner une date de début ET une date de fin.');
      return;
    }
    if (startDate > endDate) {
      alert('La date de début doit être antérieure ou égale à la date de fin.');
      return;
    }

    try {
      // Construit l’URL avec query params pour filtrer côté backend
      const url = new URL(`${API_URL}/api/orders/export`);
      url.searchParams.append('startDate', startDate);
      url.searchParams.append('endDate', endDate);

      const response = await fetch(url);

      if (!response.ok) throw new Error('Erreur pendant le téléchargement');

      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = 'commandes_filtrees.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
    } catch (err) {
      console.error('Erreur de téléchargement :', err);
      alert("Le fichier n'a pas pu être téléchargé.");
    }
  };

  return (
    <div>
      <div className="mb-3">
        <label>De :</label>
        <input 
          type="date" 
          value={startDate} 
          onChange={e => setStartDate(e.target.value)} 
          max={endDate || undefined}
        />
      </div>

      <div className="mb-3">
        <label>À :</label>
        <input 
          type="date" 
          value={endDate} 
          onChange={e => setEndDate(e.target.value)} 
          min={startDate || undefined}
        />
      </div>

      <button onClick={handleDownload} className="btn btn-warning fw-bold">
        📥 Télécharger commandes Excel filtrées
      </button>
    </div>
  );
};

export default DownloadExcelButton;
