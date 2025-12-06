// ============================================================================
// WebSocket Server Setup and Message Handling
// Manages real-time chat connections, history, and message broadcasting
// ============================================================================

const WebSocket = require('ws');
// Firestore admin import is optional – the server can run in a local in-memory mode
// when the environment variable USE_FIRESTORE is set to 'false'. This makes the
// project easier to run for beginners who don't have Firebase configured.
const { db, admin } = require('./firebaseAdmin');
// By default use in-memory mode (easier for beginners). Set USE_FIRESTORE=true
// in the server environment to enable Firestore persistence.
const USE_FIRESTORE = String(process.env.USE_FIRESTORE || 'false').toLowerCase() === 'true';

// In-memory storage used when Firestore is disabled (local demo mode)
const localState = {
  messages: [], // recent messages
};

/**
 * setupWebSocket Function
 * - Creates WebSocket server for real-time communication
 * - Handles client connections and disconnections
 * - Manages message history and broadcasting
 */
function setupWebSocket(server) {
  // Create WebSocket server attached to HTTP server
  const wss = new WebSocket.Server({ server });

  // ============================================================================
  // Handle new client connections
  // ============================================================================
  wss.on('connection', async (ws) => {

    // --- SECTION 1: Send Chat History ---
    // Fetch and send recent message history to newly connected client
    try {
      if (USE_FIRESTORE && db) {
        // Fetch recent messages from Firestore (if available)
        const snapshot = await db
          .collection('messages')
          .orderBy('timestamp', 'desc')
          .limit(50)
          .get();

        const history = snapshot.docs
          .map((doc) => {
            const d = doc.data();
            return {
              id: doc.id,
              ...d,
              timestamp: d.timestamp?.toDate().toISOString() || null,
            };
          })
          .reverse();

        ws.send(JSON.stringify({ type: 'history', messages: history }));
      } else {
        // Firestore disabled – send in-memory message history
        ws.send(JSON.stringify({ type: 'history', messages: localState.messages }));
      }
    } catch (err) {
      console.error('Error fetching message history', err);
      ws.send(JSON.stringify({ type: 'history', messages: [] }));
    }

    // --- SECTION 2: Handle Incoming Messages ---
    // Receive messages from client, store in Firestore, and broadcast to all clients
    ws.on('message', async (message) => {
      try {
        const payload = JSON.parse(message.toString());
        const msgData = payload.data || payload;

        // Validate required fields
        if (!msgData.text || !msgData.text.trim()) return;

        // Prepare message payload for broadcasting
        const broadcastMessage = {
          id: `local-${Date.now()}`,
          displayName: msgData.displayName || 'Anonymous',
          uid: msgData.uid || 'unknown',
          text: msgData.text.trim(),
          timestamp: new Date().toISOString(),
        };

        console.log('Message received:', broadcastMessage);

        if (USE_FIRESTORE && db) {
          // Save to Firestore (server timestamp used for reliable ordering)
          try {
            const docRef = await db.collection('messages').add({
              displayName: broadcastMessage.displayName,
              uid: broadcastMessage.uid,
              text: broadcastMessage.text,
              timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });
            broadcastMessage.id = docRef.id;
          } catch (e) {
            console.warn('Failed to write message to Firestore, falling back to in-memory store', e);
            localState.messages.push(broadcastMessage);
          }
        } else {
          // In-memory demo mode
          localState.messages.push(broadcastMessage);
          console.log('Message stored in memory. Total:', localState.messages.length);
        }

        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) client.send(JSON.stringify({ type: 'message', data: broadcastMessage }));
        });
      } catch (err) {
        console.error('Error processing message', err);
      }
    });

    ws.on('close', () => {});
    ws.on('error', (error) => { console.error('WebSocket error', error); });
  });
}

module.exports = { setupWebSocket };
