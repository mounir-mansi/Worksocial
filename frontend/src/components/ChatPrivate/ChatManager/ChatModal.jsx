import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

function ChatModal({ userId, isMinimized, onClose, onMinimize, style }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const token = localStorage.getItem("userToken");
  const userIdSend = localStorage.getItem("userId");
  console.info("UserID Send:", userIdSend, "UserID:", userId);
  const endOfMessagesRef = useRef(null);
  // Charger les messages existants
  useEffect(() => {
    // Remplacer cette URL par l'URL de votre API pour charger les messages
    const url = `http://localhost:5000/individualchats/user/${userIdSend}`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.info("Réponse du serveur:", response);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des messages");
        }
        return response.json();
      })
      .then((data) => {
        console.info("Messages chargés:", data);
        const filteredMessages = data.filter(
          (msg) =>
            (parseInt(msg.User_ID1, 10) === parseInt(userIdSend, 10) &&
              parseInt(msg.User_ID2, 10) === parseInt(userId, 10)) ||
            (parseInt(msg.User_ID1, 10) === parseInt(userId, 10) &&
              parseInt(msg.User_ID2, 10) === parseInt(userIdSend, 10))
        );

        console.info("Messages filtrés:", filteredMessages);
        setMessages(filteredMessages);
      })

      .catch((error) => {
        console.error("Erreur lors du chargement des messages:", error);
      });
  }, [userId, userIdSend, token]);

  // Gérer l'envoi des messages
  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      fetch("http://localhost:5000/individualchats", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Content: currentMessage,
          User_ID1: userIdSend,
          User_ID2: userId,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Échec de l'envoi du message: ${response.statusText}`
            );
          }
          return response.json();
        })
        .then((data) => {
          const newMessage = {
            id: data.chatId,
            Content: currentMessage, // Assurez-vous que c'est 'Content', pas 'text'
            // Autres propriétés si nécessaire
          };
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          setCurrentMessage("");
        })
        .catch((error) => {
          console.error("Erreur lors de l'envoi du message:", error);
        });
    }
  };
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className={`chat-modal ${isMinimized ? "minimized" : ""}`}
      style={{ ...style, bottom: "20px", position: "fixed" }}
    >
      <div className="chat-header">
        <button type="button" onClick={onMinimize}>
          {isMinimized ? "+" : "-"}
        </button>
        <button type="button" onClick={onClose}>
          X
        </button>
      </div>
      <h2>Tchat avec {userId}</h2>
      {!isMinimized && (
        <>
          <div className="chat-body">
            <div className="message-container">
              {messages.map((msg, index) => (
                <p
                  key={msg.id}
                  ref={index === messages.length - 1 ? endOfMessagesRef : null}
                >
                  {msg.Content}
                </p>
              ))}
            </div>
          </div>
          <div className="input-container">
            <input
              className="chat-input"
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Écrivez un message ici..."
            />
            <button type="submit" onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
ChatModal.propTypes = {
  userId: PropTypes.number.isRequired,
  isMinimized: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMinimize: PropTypes.func.isRequired,
  style: PropTypes.shape({
    right: PropTypes.string.isRequired,
  }).isRequired,
};
export default ChatModal;
