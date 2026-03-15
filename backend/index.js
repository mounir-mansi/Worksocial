require("dotenv").config();

const http = require("http");
const app = require("./src/app");
const { setupWebSocketServer } = require("./src/websocket/websocket");

// HTTP server setup
const server = http.createServer(app);

// WebSocket server setup
setupWebSocketServer(server);

// Port for HTTP server
const port = process.env.PORT || 5000;

// En production : écoute uniquement sur 127.0.0.1 (Nginx reverse proxy)
// En dev : écoute sur toutes les interfaces pour faciliter le développement
const host = process.env.NODE_ENV === "production" ? "127.0.0.1" : undefined;

server.listen(port, host, () => {
  console.info(`HTTP server running on http://${host || "0.0.0.0"}:${port}`);
});
