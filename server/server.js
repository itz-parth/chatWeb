//importing modules
const express = require('express');
const http = require('http');
const cors = require('cors');
const { setupWebSocket } = require('./socket');

//creating app
const app = express();
app.use(cors()); 

//creating server
const server = http.createServer(app);
setupWebSocket(server)

const PORT = 5000;
server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
