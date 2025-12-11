import React from "react";
import LogoutButton from "../auth/LogoutButton";
import MessageList from "./MessageList";
import ChatControls from "./ChatControls";
import { useFriends } from "../../context/FriendsContext";
import { useChat } from "../../context/ChatContext";

const ChatBox = () => {
    const { username, discriminator, loading } = useFriends();
    const { activeChat, messages, socket } = useChat();

    if (loading) {
        return <div className="p-4 text-center text-gray-500">Loading your profile…</div>;
    }

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">💬 Chat App</h1>
                <LogoutButton />
            </div>

            {activeChat ? (
                <>
                    <MessageList messages={messages} />
                    <ChatControls
                        socket={socket}
                        username={`${username}#${discriminator}`}
                    />
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                    Select a friend to start chatting
                </div>
            )}
        </div>
    );
};

export default ChatBox;
