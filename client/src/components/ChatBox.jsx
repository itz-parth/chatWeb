import React from 'react'
import { useState, useEffect } from 'react';
import LogoutButton from './buttons/LogoutButton';

const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:5000');
    setSocket(newSocket);

    newSocket.onopen = () => console.log("WebSocket connected");
    newSocket.onmessage = (event) => {
      const message = event.data.toString();
      setMessages((prev) => [...prev, message]);
    };
    newSocket.onclose = () => console.log("WebSocket disconnected");
    newSocket.onerror = (error) => console.error("WebSocket error:", error);

    return () => newSocket.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() && socket?.readyState === WebSocket.OPEN) {
      socket.send(input);
      setInput('');
    }
  };

  return (
    <div className="chat-container p-10 pb-4 flex flex-col h-full">
      <div className="messages flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <div className="message" key={index}>{msg}</div>
        ))}
      </div>
      <div className="input-area flex">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
          className="w-full p-2 border mr-3"
        />
        <button 
          className='p-2  border'
          onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default HomePage