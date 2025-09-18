const WebSocket = require('ws');
const { db, admin } = require('./firebaseAdmin');

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log("New client connected");

        // Listen to messages from THIS client
        ws.on('message', async (message) => {
            try {
                const msgData = JSON.parse(message.toString());
                console.log("Received message:", msgData);

                // Save to Firestore
                const docRef = await db.collection('messages').add({
                    displayName: msgData.displayName,
                    uid: msgData.uid,
                    text: msgData.text,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                });

                // Prepare object to broadcast
                const broadcastMessage = {
                    id: docRef.id, // Firestore doc id
                    displayName: msgData.displayName,
                    uid: msgData.uid,
                    text: msgData.text,
                    timestamp: new Date().toISOString(), // placeholder until Firestore timestamp resolves
                };

                // Broadcast to all connected clients
                wss.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(broadcastMessage));
                    }
                });
            } catch (err) {
                console.error("Error handling message:", err);
            }
        });

        ws.on('close', () => {
            console.log("Client disconnected");
        });
    });
}

module.exports = { setupWebSocket };
