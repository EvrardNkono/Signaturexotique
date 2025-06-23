// src/pages/PopupImages.jsx
import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './PopupImages.css';

export default function PopupImages() {
  const [images, setImages] = useState([null, null, null]);
  const [titles, setTitles] = useState(['', '', '']);
  const [messages, setMessages] = useState(['', '', '']);
  const [existingImages, setExistingImages] = useState(['', '', '']);
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    async function fetchPopups() {
      try {
        const res = await fetch(`${API_URL}/popups`);
        const data = await res.json();

        const imgs = ['', '', ''];
        const ttl = ['', '', ''];
        const msgs = ['', '', ''];

        data.forEach((popup, i) => {
          imgs[i] = popup.image_url || '';
          ttl[i] = popup.title || '';
          msgs[i] = popup.message || '';
        });

        setExistingImages(imgs);
        setTitles(ttl);
        setMessages(msgs);
      } catch (error) {
        console.error('Erreur récupération popups :', error);
      }
    }

    fetchPopups();
  }, []);

  const handleFileChange = (e, idx) => {
    const files = [...images];
    files[idx] = e.target.files[0];
    setImages(files);
  };

  const handleInputChange = (setter, idx, value) => {
    setter((prev) => {
      const copy = [...prev];
      copy[idx] = value;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    images.forEach((img, i) => {
      if (img) formData.append('images', img, `image_${i + 1}`);
      else formData.append(`existing_image_${i + 1}`, existingImages[i]);
    });

    titles.forEach((title, i) => formData.append(`title_${i + 1}`, title));
    messages.forEach((msg, i) => formData.append(`message_${i + 1}`, msg));

    try {
      const res = await fetch(`${API_URL}/admin/popup`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResponseMessage(data.message || 'Upload réussi !');
    } catch (error) {
      console.error('Erreur upload :', error);
      setResponseMessage('Une erreur est survenue.');
    }
  };

  return (
    <div className="popup-images-container">
      <h2 className="popup-title">Gestion des images popup 📸</h2>
      <form className="popup-form" onSubmit={handleSubmit}>
        {[0, 1, 2].map((i) => (
          <section key={i} className="popup-section">
            <h3>Popup {i + 1}</h3>

            <input
              type="text"
              className="popup-input"
              placeholder={`Titre du popup ${i + 1}`}
              value={titles[i]}
              onChange={(e) => handleInputChange(setTitles, i, e.target.value)}
              maxLength={50}
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, i)}
              className="popup-file-input"
            />

            {!images[i] && existingImages[i] && (
              <div className="popup-image-preview">
                <p>Image actuelle :</p>
                <img src={existingImages[i]} alt={`Popup ${i + 1}`} />
              </div>
            )}

            <textarea
              className="popup-textarea"
              rows={4}
              placeholder={`Message du popup ${i + 1}`}
              value={messages[i]}
              onChange={(e) => handleInputChange(setMessages, i, e.target.value)}
              maxLength={200}
            />
          </section>
        ))}

        <button type="submit" className="popup-submit-btn">
          Uploader les popups
        </button>

        {responseMessage && <p className="popup-response">{responseMessage}</p>}
      </form>
    </div>
  );
}
