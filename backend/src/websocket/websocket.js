const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

let wss;
const clients = {};

// Parse cookies from the raw cookie header string
const parseCookies = (cookieHeader) => {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(";").forEach((pair) => {
    const [name, ...rest] = pair.trim().split("=");
    if (name) cookies[name.trim()] = rest.join("=");
  });
  return cookies;
};

// eslint-disable-next-line camelcase
const broadcastMessage = (message, user_ID1, user_ID2) => {
  // eslint-disable-next-line camelcase
  [user_ID1, user_ID2].forEach((userId) => {
    if (clients[userId] && clients[userId].readyState === WebSocket.OPEN) {
      clients[userId].send(JSON.stringify(message));
    }
  });
};

const setupWebSocketServer = (server) => {
  // Attach to the existing HTTP server — no separate port needed
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    // Authenticate via JWT cookie at connection time (cookie sent on WS handshake)
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.token;

    if (!token) {
      ws.send(JSON.stringify({ error: "Non authentifié" }));
      ws.close();
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.sub;
      // eslint-disable-next-line no-param-reassign
      ws.authenticatedUserId = userId;
      clients[userId] = ws;
      ws.send(JSON.stringify({ type: "init_ok", userId }));
    } catch {
      ws.send(JSON.stringify({ error: "Token invalide" }));
      ws.close();
      return;
    }

    ws.on("message", async (message) => {
      try {
        const parsedMessage = JSON.parse(message);

        if (!ws.authenticatedUserId) {
          ws.send(JSON.stringify({ error: "Non authentifié" }));
          ws.close();
          return;
        }

        if (!parsedMessage.Content || !Number.isInteger(parsedMessage.user_ID2)) {
          throw new Error("Champs manquants ou invalides");
        }

        // L'expéditeur est toujours l'utilisateur authentifié — impossible à falsifier
        const user_ID1 = ws.authenticatedUserId;
        const { user_ID2 } = parsedMessage;

        const chat = await prisma.individualChat.create({
          data: {
            Content: parsedMessage.Content,
            User_ID1: user_ID1,
            User_ID2: user_ID2,
          },
        });

        broadcastMessage(
          { id: chat.Chat_ID, Content: chat.Content, User_ID1: chat.User_ID1, User_ID2: chat.User_ID2 },
          user_ID1,
          user_ID2
        );
      } catch (error) {
        console.error("Error handling message:", error);
        ws.send(JSON.stringify({ error: "Error processing your message" }));
      }
    });

    ws.on("close", () => {
      Object.keys(clients).forEach((userId) => {
        if (clients[userId] === ws) {
          delete clients[userId];
        }
      });
    });
  });

  console.info("WebSocket server attached to HTTP server");
};

module.exports = { setupWebSocketServer, broadcastMessage };
