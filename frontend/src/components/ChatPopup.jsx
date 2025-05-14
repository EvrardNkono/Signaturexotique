import React, { useState } from "react";
import "./ChatPopup.css"; // Tu peux personnaliser les styles ici
import Form from "react-bootstrap/Form"; // en haut de ton fichier
import { API_URL } from '../config'; // Importer l'URL de l'API

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "assistant", text: "Bonjour ! Comment puis-je vous aider ?" },
  ]);

  // Ouvrir et fermer la fenêtre de chat
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Gérer le changement du message utilisateur
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  // Gérer l'envoi du message
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Pour éviter le rechargement de la page
    if (message.trim() === "") return; // Ne rien envoyer si le message est vide

    // Ajouter le message utilisateur dans le chat
    setMessages([...messages, { sender: "user", text: message }]);
    setMessage(""); // Réinitialiser le champ de message

    try {
      // Créer un message avec le format attendu par l'API
      const userMessage = { sender: "user", text: message };

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.sender === "assistant" ? "assistant" : msg.sender,
              content: msg.text,
            })),
            { role: "user", content: message },
          ],
        }),
      });

      if (!response.ok) {
        console.error("Erreur HTTP lors de l'appel à l'API :", response.statusText);
        const errorDetails = await response.text(); // Lire le texte de la réponse pour plus de détails
        console.error("Détails de l'erreur :", errorDetails);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "assistant", text: "Erreur API, veuillez réessayer plus tard." },
        ]);
        return;
      }

      const data = await response.json();
      console.log("Réponse reçue de l'API :", data);

      // Ajouter la réponse de l'assistant aux messages
      if (data && data.choices && data.choices.length > 0) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "assistant", text: data.choices[0].message.content },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "assistant", text: "Désolé, je n'ai pas compris. Peux-tu reformuler ?" },
        ]);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "assistant", text: "Oups, quelque chose a mal tourné. Essaie de nouveau plus tard." },
      ]);
    }
  };

  return (
    <div className={`chat-popup ${isOpen ? "open" : ""}`}>
      <button className="chat-toggle" onClick={toggleChat}>
  <div className="smiley-chat">
    <div className="eyes">
      <span className="eye left"></span>
      <span className="eye right"></span>
    </div>
    <div className="bubble-mouth">💬</div>
  </div>
</button>


      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Chat en direct</h3>
            <button className="close-chat" onClick={toggleChat}>X</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender === "assistant" ? "assistant" : "user"}`}
              >
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <Form className="chat-input" onSubmit={handleSendMessage}>
            <Form.Group className="flex-grow-1 me-2 mb-0">
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Écrivez un message..."
                value={message}
                onChange={handleMessageChange}
                className="chat-textarea"
              />
            </Form.Group>
            <button type="submit" className="btn btn-warning">
              Envoyer
            </button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default ChatPopup;
