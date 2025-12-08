const WebSocket = require('ws');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('✓ Client connected for signaling');

    ws.on('message', (message) => {
      try {
        const payload = JSON.parse(message.toString());

        // Broadcast signaling messages (e.g., typing, presence) to all other clients
        if (payload.type === 'signal') {
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(message.toString());
            }
          });
        }
      } catch (err) {
        console.error('Error processing signal', err);
      }
    });

    ws.on('close', () => { });
    ws.on('error', (error) => { console.error('WebSocket error', error); });
  });
}

module.exports = { setupWebSocket };
