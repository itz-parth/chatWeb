import React, { useEffect, useState } from 'react';
import './App.css'; // Make sure this path is correct

const App = () => {
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
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, index) => (
          <div className="message" key={index}>{msg}</div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
