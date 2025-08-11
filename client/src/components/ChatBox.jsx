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
      const message = event.data.toString();
      setMessages((prev) => [...prev, message]);
    };
    newSocket.onclose = () => console.log('WebSocket disconnected');
    newSocket.onerror = (error) => console.error('WebSocket error:', error);

    return () => newSocket.close();
  }, []);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-4">
      </div>

      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            {msg}
          </div>
        ))}
      </div>
      <SendMessage socket={socket} />
    </div>
  );
};

export default HomePage;
