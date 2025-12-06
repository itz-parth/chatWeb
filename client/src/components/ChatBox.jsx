import React, { useState, useEffect } from "react";
import LogoutButton from "./buttons/LogoutButton";
import MessageList from "./MessageList";
import ChatControls from "./ChatControls";
import { useProfile } from "../hooks/useProfile";

let sharedSocket = null;

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const { username, discriminator, loading } = useProfile();

  useEffect(() => {
    if (!sharedSocket) {
      sharedSocket = new WebSocket("ws://localhost:5000");

      sharedSocket.onopen = () => {
        console.log('✓ Connected to chat server');
      };

      sharedSocket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        
        if (msg.type === "history") {
          setMessages(msg.messages);
        } else if (msg.type === "message") {
          setMessages((oldMessages) => [...oldMessages, msg.data]);
        }
      };

      sharedSocket.onerror = (err) => {
        console.error('✗ Connection error:', err);
      };

      sharedSocket.onclose = () => {
        console.log('✗ Disconnected from chat server');
      };
    }

    setSocket(sharedSocket);
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading your profile…</div>;
  }

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">💬 Chat App</h1>
        <LogoutButton />
      </div>

      <MessageList messages={messages} />

      <ChatControls
        socket={socket}
        username={`${username}#${discriminator}`}
      />
    </div>
  );
};

export default ChatBox;
