const WebSocket = require('ws')

function setupWebSocket(server){
    const wss = new WebSocket.Server({server})

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
}

module.exports = {setupWebSocket}