import React, { useState } from "react";
import { getAuth } from "firebase/auth";

const SendMessage = ({ socket, username }) => {
  const [input, setInput] = useState("");
  const auth = getAuth();

  const sendMessage = () => {
    if (!input.trim()) return;
    if (!auth.currentUser) return alert("Please log in first");

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return alert("WebSocket disconnected");
    }

    const payload = {
      type: "message",
      data: {
        text: input,
        displayName: username,
        uid: auth.currentUser.uid,
        timestamp: Date.now(),
      },
    };

    socket.send(JSON.stringify(payload));
    setInput("");
  };

  return (
    <div className="flex p-2 border-t border-gray-300">
      <input
        type="text"
        className="w-full p-2 border mr-3 rounded"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        onClick={sendMessage}
        className="p-2 border rounded bg-blue-500 text-white"
      >
        Send
      </button>
    </div>
  );
};

export default SendMessage;
