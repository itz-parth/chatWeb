// ============================================================================
// Server Main Entry Point
// Sets up Express HTTP server with WebSocket support
// ============================================================================

// Load environment variables from .env file
require('dotenv').config();

// Import required modules
const express = require('express');
const http = require('http');
const cors = require('cors');
const { setupWebSocket } = require('./socket');

// Create Express application instance
const app = express();

// Enable CORS to allow cross-origin requests
app.use(cors());

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize WebSocket server on HTTP server
setupWebSocket(server);

// Define server port
const PORT = 5000;

// Start server and listen on specified port
server.listen(PORT, () => {
  console.log(`✓ Server is running on port ${PORT}`);
  console.log(`✓ WebSocket server ready at ws://localhost:${PORT}`);
});
