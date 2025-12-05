// ============================================================================
// WebSocket Server Setup and Message Handling
// Manages real-time chat connections, history, and message broadcasting
// ============================================================================

const WebSocket = require('ws');
const { db, admin } = require('./firebaseAdmin');

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
    console.log('✓ New client connected');

    // --- SECTION 1: Send Chat History ---
    // Fetch and send recent message history to newly connected client
    try {
      // Query Firestore for the 50 most recent messages
      const snapshot = await db
        .collection('messages')
        .orderBy('timestamp', 'desc') // Newest first
        .limit(50)
        .get();

      // Transform Firestore documents into message objects
      const history = snapshot.docs
        .map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            ...d,
            // Convert Firestore timestamp to ISO string
            timestamp: d.timestamp?.toDate().toISOString() || null,
          };
        })
        // Reverse to show oldest→newest order for client
        .reverse();

      // Send history if messages exist
      if (history.length > 0) {
        ws.send(
          JSON.stringify({
            type: 'history',
            messages: history,
          })
        );
      }
    } catch (err) {
      console.error('✗ Error fetching message history:', err);
    }

    // --- SECTION 2: Handle Incoming Messages ---
    // Receive messages from client, store in Firestore, and broadcast to all clients
    ws.on('message', async (message) => {
      try {
        // Parse JSON message from client
        const msgData = JSON.parse(message.toString());
        console.log('📨 Message received:', msgData);

        // Save message to Firestore database
        const docRef = await db.collection('messages').add({
          displayName: msgData.displayName,
          uid: msgData.uid,
          text: msgData.text,
          // Use server timestamp for consistency
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Prepare message data for broadcasting to all clients
        const broadcastMessage = {
          id: docRef.id,
          displayName: msgData.displayName,
          uid: msgData.uid,
          text: msgData.text,
          timestamp: new Date().toISOString(),
        };

        // Broadcast message to all connected WebSocket clients
        wss.clients.forEach((client) => {
          // Only send to clients with open connections
          if (client.readyState === WebSocket.OPEN) {
            client.send(
              JSON.stringify({
                type: 'message', // Client expects 'message' type for new messages
                data: broadcastMessage,
              })
            );
          }
        });
      } catch (err) {
        console.error('✗ Error processing message:', err);
      }
    });

    // --- SECTION 3: Handle Client Disconnect ---
    // Log when client disconnects (cleanup handled automatically by ws)
    ws.on('close', () => {
      console.log('✗ Client disconnected');
    });

    // --- SECTION 4: Handle Connection Errors ---
    ws.on('error', (error) => {
      console.error('✗ WebSocket error:', error);
    });
  });
}

module.exports = { setupWebSocket };
