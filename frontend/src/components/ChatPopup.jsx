import React, { useState } from "react";
import "./ChatPopup.css"; // Tu peux personnaliser les styles ici
import Form from "react-bootstrap/Form"; // en haut de ton fichier

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Bonjour ! Comment puis-je vous aider ?" },
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() === "") return;
    setMessages([...messages, { sender: "user", text: message }]);
    setMessage("");
    
    // Simuler une réponse automatique du bot
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Je suis là pour vous aider ! Que puis-je faire pour vous ?" },
      ]);
    }, 1000);
  };

  return (
    <div className={`chat-popup ${isOpen ? "open" : ""}`}>
      <button className="chat-toggle" onClick={toggleChat}>
        💬
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
                className={`message ${msg.sender === "bot" ? "bot" : "user"}`}
              >
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <Form className="chat-input" onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
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
