import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './PopupUploader.css';

const PopupUploader = () => {
  const [images, setImages] = useState([null, null, null]);
  const [messages, setMessages] = useState(['', '', '']);
  const [titles, setTitles] = useState(['', '', '']); // Ajout des titres
  const [existingImages, setExistingImages] = useState(['', '', '']);
  const [responseMessage, setResponseMessage] = useState('');

  // Récupérer les popups existants au chargement
  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const res = await fetch(`${API_URL}/popups`);
        const data = await res.json();

        const imgs = ['', '', ''];
        const msgs = ['', '', ''];
        const ttl = ['', '', '']; // Ajouter un tableau pour les titres

        data.forEach((popup, index) => {
          imgs[index] = popup.image_url || '';
          msgs[index] = popup.message || '';
          ttl[index] = popup.title || ''; // Initialiser les titres existants
        });

        setExistingImages(imgs);
        setMessages(msgs);
        setTitles(ttl); // Mettre à jour les titres existants
      } catch (err) {
        console.error('Erreur récupération popups :', err);
      }
    };

    fetchPopups();
  }, []);

  const handleImageChange = (e, index) => {
    const newImages = [...images];
    newImages[index] = e.target.files[0];
    setImages(newImages);
  };

  const handleMessageChange = (e, index) => {
    const newMessages = [...messages];
    newMessages[index] = e.target.value;
    setMessages(newMessages);
  };

  const handleTitleChange = (e, index) => {
    const newTitles = [...titles];
    newTitles[index] = e.target.value;
    setTitles(newTitles);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    images.forEach((img, index) => {
      if (img) {
        formData.append('images', img, `image_${index + 1}`); // image_1, image_2...
      } else {
        formData.append(`existing_image_${index + 1}`, existingImages[index]);
      }
    });

    messages.forEach((msg, index) => {
      formData.append(`message_${index + 1}`, msg);
    });

    titles.forEach((title, index) => { // Ajouter les titres
      formData.append(`title_${index + 1}`, title);
    });

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
      {[0, 1, 2].map((index) => (
        <div key={index} style={{ marginBottom: '30px' }}>
          <h4>Popup {index + 1}</h4>

          <input
            type="text"
            value={titles[index]}
            onChange={(e) => handleTitleChange(e, index)} 
            placeholder={`Titre du popup ${index + 1}`}
            style={{ width: '100%', marginTop: '10px', padding: '10px' }}
          />

          <input 
            type="file" 
            name={`image_${index + 1}`} 
            accept="image/*"
            onChange={(e) => handleImageChange(e, index)} 
          />

          {existingImages[index] && !images[index] && (
            <div>
              <p>Image actuelle :</p>
              <img 
                src={existingImages[index]} 
                alt={`Image ${index + 1}`} 
                style={{ width: '100px', marginTop: '10px' }} 
              />
            </div>
          )}

          <textarea 
            value={messages[index]} 
            onChange={(e) => handleMessageChange(e, index)} 
            placeholder={`Saisissez un message pour le popup ${index + 1}`} 
            rows="4"
            style={{ width: '100%', marginTop: '10px', padding: '10px' }}
          />
        </div>
      ))}

      <button type="submit" style={{ marginTop: '10px' }}>
        Uploader les popups
      </button>

      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
};

export default PopupUploader;
