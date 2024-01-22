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

server.listen(port, () => {
  console.info(`HTTP server running on http://localhost:${port}`);
});
