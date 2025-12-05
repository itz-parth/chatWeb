// ============================================================================
// ChatBox Component - Main Chat Interface
// Manages WebSocket connection, displays messages, and handles chat UI
// ============================================================================

import React, { useState, useEffect } from 'react';
import LogoutButton from './buttons/LogoutButton';
import SendMessage from './buttons/SendMessege';

// Simple module-level socket to avoid duplicate connections when component remounts
let sharedSocket = null;

/**
 * ChatBox Component
 * - Establishes WebSocket connection to server
 * - Receives chat history and new messages
 * - Displays messages in real-time
 */
const ChatBox = () => {
  // Messages displayed in the chat
  const [messages, setMessages] = useState([]);

  // (status removed for now)

  // Socket instance used by this component (kept in state so renders update)
  const [socket, setSocket] = useState(null);

  const WS_URL = 'ws://localhost:5000';

  useEffect(() => {
    // If no sharedSocket exists, create one. This prevents duplicate connections
    if (!sharedSocket) {
      try {
        sharedSocket = new WebSocket(WS_URL);
      } catch (e) {
        console.error('WebSocket create failed', e);
        return;
      }

      sharedSocket.onopen = () => {
        console.log('✓ WebSocket connected');
      };

      sharedSocket.onmessage = (event) => {
        try {
          const msgData = JSON.parse(event.data);
          if (msgData.type === 'history') {
            setMessages(msgData.messages || []);
            return;
          }
          if (msgData.type === 'message') {
            setMessages((prev) => [...prev, msgData.data]);
            return;
          }
          console.warn('Unknown WS message type:', msgData);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err, event.data);
        }
      };

      sharedSocket.onclose = (ev) => {
        console.warn('✗ WebSocket closed', ev);
        setStatus('disconnected');
      };

      sharedSocket.onerror = (ev) => {
        console.error('✗ WebSocket error', ev);
        setStatus('disconnected');
      };
    } else {
      // If it already has history/messages, they will not be resent; assume single ChatBox usage
    }

    // Keep socket in component state so child components get the reference
    setSocket(sharedSocket);

    // NOTE: we're intentionally not closing sharedSocket on unmount to avoid closing the connection
    // if the component briefly unmounts and remounts; for a single-page app this is acceptable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full p-4">
      {/* Header with title, status and logout button */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-xl font-bold">Chat App</h1>
        </div>
        <LogoutButton />
      </div>

      {/* Message display area - scrollable container */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-3 rounded-lg shadow-inner">
        {/* Render each message with sender name and text */}
        {messages.map((msg, index) => (
          <div key={msg.id || index} className="mb-2">
            <span className="font-bold">{msg.displayName || 'Anonymous'}:</span>{' '}
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      {/* Controls: clear messages + send message component */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex-1 ml-3">
          <SendMessage socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
