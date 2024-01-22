const WebSocket = require("ws");
const models = require("../models");

const WebSocketPort = 5001;
let wss;
const clients = {};
// eslint-disable-next-line camelcase
const broadcastMessage = (message, user_ID1, user_ID2) => {
  // eslint-disable-next-line camelcase
  console.info(
    // eslint-disable-next-line camelcase
    `Broadcasting message to specific clients: ${user_ID1} and ${user_ID2}`
  );
  // eslint-disable-next-line camelcase
  [user_ID1, user_ID2].forEach((userId) => {
    if (clients[userId] && clients[userId].readyState === WebSocket.OPEN) {
      console.info(`Sending message to user: ${userId}`);
      clients[userId].send(JSON.stringify(message));
    }
  });
};

const setupWebSocketServer = () => {
  wss = new WebSocket.Server({ port: WebSocketPort });

  wss.on("connection", (ws) => {
    console.info("WebSocket client connected");

    ws.on("message", async (message) => {
      console.info("Received:", message);

      try {
        const parsedMessage = JSON.parse(message);

        // Assumer que le message initial contient l'ID de l'utilisateur pour l'associer au WebSocket
        if (parsedMessage.type === "init") {
          clients[parsedMessage.userId] = ws;
          return;
        }

        if (
          !parsedMessage.Content ||
          !Number.isInteger(parsedMessage.user_ID1) ||
          !Number.isInteger(parsedMessage.user_ID2)
        ) {
          throw new Error("Invalid or missing fields in the message");
        }

        // Insérer le message dans la base de données
        const insertResponse = await models.individualchat.insert({
          Content: parsedMessage.Content,
          User_ID1: parsedMessage.user_ID1,
          User_ID2: parsedMessage.user_ID2,
        });

        // Construire le message à diffuser
        const messageToBroadcast = {
          id: insertResponse.insertId,
          Content: parsedMessage.Content,
          User_ID1: parsedMessage.user_ID1,
          User_ID2: parsedMessage.user_ID2,
        };

        broadcastMessage(
          messageToBroadcast,
          parsedMessage.user_ID1,
          parsedMessage.user_ID2
        );
      } catch (error) {
        console.error("Error handling message:", error);
        ws.send(JSON.stringify({ error: "Error processing your message" }));
      }
    });

    ws.on("close", () => {
      console.info("WebSocket client disconnected");
      // Enlever le client de la liste lorsqu'il se déconnecte
      Object.keys(clients).forEach((userId) => {
        if (clients[userId] === ws) {
          delete clients[userId];
        }
      });
    });
  });

  console.info("WebSocket server setup complete");
};

module.exports = { setupWebSocketServer, broadcastMessage };
