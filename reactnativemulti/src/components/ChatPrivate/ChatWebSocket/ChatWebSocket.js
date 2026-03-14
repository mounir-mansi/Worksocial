import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView,Platform} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hostname, wsHostname } from '../../../components/HostnameConnect/Hostname';

const styles = Platform.OS === 'web'
  ? require('./styles.web').default
  : require('./styles.mobile').default;

function ChatWebSocket({ userId, isMinimized, onClose, onMinimize, position }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const endOfMessagesRef = useRef(null);
    const [token, setToken] = useState("");
  const [userIdSend, setUserIdSend] = useState("");
  const [Username, setUsername] = useState("");
const scrollViewRef = useRef(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const userUserId = await AsyncStorage.getItem("userId");
      const username = await AsyncStorage.getItem("username");

      setToken(userToken);
      setUserIdSend(userUserId);
      setUsername(username);
    };

    fetchUserData();
  }, []);

  // Établissement de la connexion WebSocket (uniquement quand le token est disponible)
  useEffect(() => {
    if (!token) return;

    ws.current = new WebSocket(wsHostname);

    ws.current.onopen = () => {
      console.info("WebSocket connected");
      ws.current.send(JSON.stringify({ type: "init", token }));
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
  }, [token]);

  // Charger les messages historiques
 useEffect(() => {
  // Remplacer cette URL par l'URL de votre API pour charger les messages
  const url = `${hostname}/individualchats/user/${userIdSend}`;

  console.log("URL de requête:", url); // Ajouter cette ligne pour afficher l'URL de la requête

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

    .then((response) => {
      console.log("Réponse du serveur:", response); // Ajouter cette ligne pour afficher la réponse du serveur
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des messages");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Données récupérées:", data); // Ajouter cette ligne pour afficher les données récupérées
      const filteredMessages = data.filter(
        (msg) =>
          (parseInt(msg.User_ID1, 10) === parseInt(userIdSend, 10) &&
            parseInt(msg.User_ID2, 10) === parseInt(userId, 10)) ||
          (parseInt(msg.User_ID1, 10) === parseInt(userId, 10) &&
            parseInt(msg.User_ID2, 10) === parseInt(userIdSend, 10))
      );

      console.log("Messages filtrés:", filteredMessages); // Ajouter cette ligne pour afficher les messages filtrés
      setMessages(filteredMessages);
    })

    .catch((error) => {
      console.error("Erreur lors du chargement des messages:", error); // Ajouter cette ligne pour afficher les erreurs
    });
}, [userId, userIdSend, token]);

  // Envoyer des messages via WebSocket
  const handleSendMessage = () => {
    if (currentMessage.trim() !== "") {
      const messageToSend = {
        Content: currentMessage,
        user_ID2: parseInt(userId, 10),
      };

      ws.current.send(JSON.stringify(messageToSend)); // Convertit l'objet en chaîne JSON

      // Ajout du message à l'état local
      // setMessages((prevMessages) => [...prevMessages, messageToSend]);
      setCurrentMessage("");
    }
  };

  //Défilement automatique vers le dernier message
  useEffect(() => {
  scrollViewRef.current?.scrollToEnd({ animated: true });
}, [messages]);
return (
    <View style={[styles.chatModal, isMinimized ? styles.minimized : null, { bottom: 20, right: position }]}>
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.minimizeButton} onPress={onMinimize}>
          <Text>{isMinimized ? "+" : "-"}</Text>
        </TouchableOpacity>
        <Text>Tchat avec {Username}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text>X</Text>
        </TouchableOpacity>
      </View>
      {!isMinimized && (
        <>
          <ScrollView style={styles.chatBody}
            ref={scrollViewRef}
            >
            <View style={styles.messageContainer}>
              {messages.map((msg, index) => (
                <View key={msg.id || index} style={[styles.message, msg.user_ID1 === parseInt(userIdSend, 10) ? styles.sent : styles.received]}>
                  <Text>{msg.Content}</Text>
                </View>
              ))}
            </View>
           {/* <View ref={endOfMessagesRef}></View> */}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.chatInput}
              value={currentMessage}
              onChangeText={(text) => setCurrentMessage(text)}
              placeholder="Écrivez un message ici..."
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Text>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

export default ChatWebSocket;