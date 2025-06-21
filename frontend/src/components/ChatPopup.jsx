import React, { useState, useEffect, useRef } from "react";
import "./ChatPopup.css";
import Form from "react-bootstrap/Form";
import { API_URL } from '../config';

// Utilisation des chemins accessibles publiquement depuis le dossier public/
const avatarEric = "/assets/avatareric.jpg";
const avatarUser = "/assets/avataruser.jpg";

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "assistant", text: "Bonjour !! Comment puis-je vous aider ?" },
  ]);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef(null);

 useEffect(() => {
  const seenThisSession = sessionStorage.getItem("chatSeen");
  if (!seenThisSession) {
    setIsOpen(true); // On ouvre le chat directement
    setHasUnread(false); // On peut annuler la pastille ici si le chat est ouvert
    sessionStorage.setItem("chatSeen", "true");
  }
}, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasUnread(false);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "") return;

    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    const currentMessage = message;
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.sender === "assistant" ? "assistant" : msg.sender,
              content: msg.text,
            })),
            { role: "user", content: currentMessage },
          ],
        }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Erreur API :", errorDetails);
        setMessages(prev => [...prev, {
          sender: "assistant",
          text: "Erreur API, veuillez réessayer plus tard.",
        }]);
        return;
      }

      const data = await response.json();
      const assistantReply = data?.choices?.[0]?.message?.content || "Désolé, je n'ai pas compris.";
      setMessages(prev => [...prev, { sender: "assistant", text: assistantReply }]);
    } catch (error) {
      console.error("Erreur:", error);
      setMessages(prev => [...prev, {
        sender: "assistant",
        text: "Oups, quelque chose a mal tourné. Essaie de nouveau plus tard.",
      }]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen]);

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
        {hasUnread && <span className="chat-notification">1</span>}
      </button>

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <h3>Chat en direct</h3>
            <button className="close-chat" onClick={toggleChat}>X</button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="avatar">
  <img
    src={msg.sender === "assistant" ? avatarEric : avatarUser}
    alt={msg.sender}
    className="avatar-img"
  />
</div>

                <span className="message-text">{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <Form className="chat-input" onSubmit={handleSendMessage}>
            <Form.Group className="flex-grow-1 me-2 mb-0">
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Écrivez un message..."
                value={message}
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}
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
