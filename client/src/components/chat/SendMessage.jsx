import React, { useState } from "react";
import { useChat } from "../../context/ChatContext";

const SendMessage = () => {
    const [input, setInput] = useState("");
    const { sendMessage } = useChat();

    const handleSend = async () => {
        if (!input.trim()) return;

        try {
            await sendMessage(input);
            setInput("");
        } catch (error) {
            alert("Failed to send message");
        }
    };

    const handleInput = (e) => {
        setInput(e.target.value);
        // Typing indicators can be reimplemented here via context if exposed
    };

    return (
        <div className="flex p-2 border-t border-gray-300">
            <input
                type="text"
                className="w-full p-2 border mr-3 rounded"
                placeholder="Type your message..."
                value={input}
                onChange={handleInput}
                onKeyUp={(e) => e.key === "Enter" && handleSend()}
            />

            <button
                onClick={handleSend}
                className="p-2 border rounded bg-blue-500 text-white"
            >
                Send
            </button>
        </div>
    );
};

export default SendMessage;
