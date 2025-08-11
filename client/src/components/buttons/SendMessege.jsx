import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore, serverTimestamp } from "firebase/firestore";

const SendMessage = ({ socket }) => {
  const db = getFirestore();
  const auth = getAuth();
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;
    if (!auth.currentUser) return alert("You must log in first!");

    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(input);
    }

    try {
      await addDoc(collection(db, "messages"), {
        text: input,
        uid: auth.currentUser.uid,
        displayName: auth.currentUser.displayName,
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.log("Error in sending message: " + e);
    }

    setInput(""); 
  }

  return (
    <div className="flex p-2 border-t border-gray-300">
      <input
        type="text"
        value={input}
        placeholder="Type your message..."
        onChange={(e) => setInput(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && sendMessage()}
        className="w-full p-2 border mr-3 rounded"
      />
      <button
        className="p-2 border rounded bg-blue-500 text-white"
        onClick={sendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default SendMessage;
