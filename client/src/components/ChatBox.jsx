import React, { useState, useEffect } from 'react';
import LogoutButton from './buttons/LogoutButton';
import SendMessage from './buttons/SendMessege';

const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('wss://chatweb-gjbz.onrender.com');
    setSocket(newSocket);

    newSocket.onopen = () => console.log('WebSocket connected');

    newSocket.onmessage = (event) => {
      try {
        const msgData = JSON.parse(event.data); // ✅ Parse JSON
        setMessages((prev) => [...prev, msgData]);
      } catch (err) {
        console.error("Error parsing message:", err, event.data);
      }
    };

    newSocket.onclose = () => console.log('WebSocket disconnected');
    newSocket.onerror = (error) => console.error('WebSocket error:', error);

    return () => newSocket.close();
  }, []);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Chat App</h1>
        <LogoutButton />
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-100 p-3 rounded-lg shadow-inner">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="font-bold">{msg.displayName || "Anonymous"}: </span>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>

      <SendMessage socket={socket} />
    </div>
  );
};

export default HomePage;
