const express = require('express');
const http = require('http');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log("New client connected");

  // Listen to messages from THIS client
  ws.on('message', (message) => {
    console.log("Received message:", message.toString());

    // Broadcast to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  ws.on('close', () => {
    console.log("Client disconnected");
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
