import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./ChatWebSocket.css";
import { hostname } from "../../../HostnameConnect/Hostname";

function ChatWebSocket({
  userId,
  isMinimized,
  onClose,
  onMinimize,
  style,
  position,
}) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const endOfMessagesRef = useRef(null);
  const userIdSend = localStorage.getItem("userId");
  const Username = localStorage.getItem("username");

  // WS URL auto-détectée : même domaine que la page, protocole adapté (wss en HTTPS)
  const wsUrl = `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}`;

  // Établissement de la connexion WebSocket
  useEffect(() => {
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.info("WebSocket connected");
      // Auth via cookie httpOnly — aucun token à envoyer manuellement
    };

    ws.current.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      if (receivedMessage && receivedMessage.Content) {
        if (receivedMessage.User_ID1 !== parseInt(userIdSend, 10)) {
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        }
      }
    };

    ws.current.onclose = () => console.info("WebSocket disconnected");

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  // Charger les messages historiques
  useEffect(() => {
    fetch(`${hostname}/individualchats/user/${userIdSend}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors du chargement des messages");
        return response.json();
      })
      .then((data) => {
        const filteredMessages = data.filter(
          (msg) =>
            (parseInt(msg.User_ID1, 10) === parseInt(userIdSend, 10) &&
              parseInt(msg.User_ID2, 10) === parseInt(userId, 10)) ||
            (parseInt(msg.User_ID1, 10) === parseInt(userId, 10) &&
              parseInt(msg.User_ID2, 10) === parseInt(userIdSend, 10))
        );
        setMessages(filteredMessages);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des messages:", error);
      });
  }, [userId, userIdSend]);

  // Envoyer des messages via WebSocket
  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      const messageToSend = {
        Content: currentMessage,
        user_ID2: userId,
      };
      ws.current.send(JSON.stringify(messageToSend));
      setCurrentMessage("");
    }
  };

  // Défilement automatique vers le dernier message
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`chat-modal ${isMinimized ? "minimized" : ""}`}
      style={{
        ...style,
        bottom: "20px",
        right: `${position}px`,
        position: "fixed",
      }}
    >
      <div className="chat-header">
        <button type="button" className="minimize-button" onClick={onMinimize}>
          {isMinimized ? "+" : "-"}
        </button>
        <h5>Tchat avec {Username}</h5>
        <button type="button" className="close-button" onClick={onClose}>
          X
        </button>
      </div>
      {!isMinimized && (
        <>
          <div className="chat-body">
            <div className="message-container">
              {messages.map((msg, index) => (
                <div
                  className={`message ${
                    msg.User_ID1 === parseInt(userIdSend, 10) ? "sent" : "received"
                  }`}
                  key={msg.id || index}
                  ref={index === messages.length - 1 ? endOfMessagesRef : null}
                >
                  {msg.Content}
                </div>
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
            <button
              type="submit"
              className="send-button"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
}
ChatWebSocket.propTypes = {
  userId: PropTypes.number.isRequired,
  isMinimized: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  position: PropTypes.number.isRequired,
  onMinimize: PropTypes.func.isRequired,
  style: PropTypes.shape({
    right: PropTypes.string.isRequired,
  }).isRequired,
};
export default ChatWebSocket;
