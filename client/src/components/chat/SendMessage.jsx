import React, { useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const SendMessage = ({ socket, username }) => {
    const [input, setInput] = useState("");
    const auth = getAuth();
    const db = getFirestore();

    const handleInput = (e) => {
        setInput(e.target.value);

        // Optional: Send typing signal via WebSocket
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'signal',
                data: { type: 'typing', user: username }
            }));
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        if (!auth.currentUser) return alert("Please log in first");

        // 1. Send to Firestore (Storage)
        const messageData = {
            text: input.trim(),
            displayName: username,
            uid: auth.currentUser.uid,
            timestamp: serverTimestamp(),
        };

        try {
            await addDoc(collection(db, "messages"), messageData);
            setInput("");
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message");
        }
    };

    return (
        <div className="flex p-2 border-t border-gray-300">
            <input
                type="text"
                className="w-full p-2 border mr-3 rounded"
                placeholder="Type your message..."
                value={input}
                onChange={handleInput}
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
