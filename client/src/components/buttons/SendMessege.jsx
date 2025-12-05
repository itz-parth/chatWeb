// ============================================================================
// SendMessage Component - Message Input and Sending
// Handles user input and sends messages via WebSocket
// ============================================================================

import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';

/**
 * SendMessage Component
 * - Provides input field for typing messages
 * - Sends messages over WebSocket connection
 * - Includes user info (name, uid) with each message
 */
const SendMessage = ({ socket }) => {
  const auth = getAuth();
  // State to track message input value
  const [input, setInput] = useState('');

  /**
   * Send message via WebSocket
   * - Validates input and user authentication
   * - Creates message payload with user info
   * - Sends over WebSocket if connection is open
   * - Clears input field after sending
   */
  const sendMessage = () => {
    // Skip if input is empty or whitespace only
    if (!input.trim()) return;

    // Ensure user is authenticated
    if (!auth.currentUser) {
      alert('You must log in first!');
      return;
    }

    // Use singleton send helper; if socket not open, inform user
    const payload = {
      text: input,
      uid: auth.currentUser.uid,
      displayName: auth.currentUser.displayName || auth.currentUser.email.split('@')[0] || 'User',
      timestamp: new Date().toISOString(),
    };

    // Send via provided socket prop (keeps things simple)
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      alert('Unable to send message: disconnected.');
      return;
    }

    socket.send(JSON.stringify(payload));

    // Clear input field after sending
    setInput('');
  };

  return (
    <div className="flex p-2 border-t border-gray-300">
      {/* Message input field */}
      <input
        type="text"
        value={input}
        placeholder="Type your message..."
        onChange={(e) => setInput(e.target.value)}
        // Send message on Enter key press
        onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
        className="w-full p-2 border mr-3 rounded"
      />
      {/* Send message button */}
      <button className="p-2 border rounded bg-blue-500 text-white hover:bg-blue-600 transition" onClick={sendMessage}>
        Send
      </button>
    </div>
  );
};

export default SendMessage;
