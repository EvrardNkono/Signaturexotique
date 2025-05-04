import React, { useState } from 'react';
import { API_URL } from '../config'; // ou le bon chemin relatif
import './PopupUploader.css';

const PopupUploader = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(''); // Message que l'admin souhaite saisir
  const [responseMessage, setResponseMessage] = useState(''); // Message de réponse après upload

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!image || !message) {
      setResponseMessage('Veuillez télécharger une image et ajouter un message.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('message', message); // Ajouter le message au formData

    try {
      const response = await fetch(`${API_URL}/admin/popup`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResponseMessage(data.message || 'Upload réussi !');
    } catch (error) {
      console.error('Erreur upload :', error);
      setResponseMessage('Une erreur est survenue.');
    }
  };

  return (
    <form className="popup-upload-form" onSubmit={handleUpload}>
      <div>
        <input 
          type="file" 
          accept="image/*" 
          onChange={e => setImage(e.target.files[0])} 
        />
      </div>

      <div>
        <textarea 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Saisissez un message pour le popup" 
          rows="4"
          style={{ width: '100%', marginTop: '10px', padding: '10px' }}
        />
      </div>

      <button type="submit" style={{ marginTop: '10px' }}>Uploader le popup</button>

      {responseMessage && <p>{responseMessage}</p>} {/* Message de réponse */}
    </form>
  );
};

export default PopupUploader;
