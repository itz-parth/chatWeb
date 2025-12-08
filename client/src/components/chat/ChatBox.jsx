import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import LogoutButton from "../auth/LogoutButton";
import MessageList from "./MessageList";
import ChatControls from "./ChatControls";
import { useProfile } from "../../hooks/useProfile";

let sharedSocket = null;

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const { username, discriminator, loading } = useProfile();
    const db = getFirestore();

    useEffect(() => {
        if (!sharedSocket) {
            sharedSocket = new WebSocket("ws://localhost:5000");

            sharedSocket.onopen = () => {
                console.log('✓ Connected to signaling server');
            };

            sharedSocket.onmessage = (event) => {
                // Handle signals here (e.g. typing indicators)
                // For now just logging signals
                try {
                    const msg = JSON.parse(event.data);
                    if (msg.type === 'signal') {
                        console.log('Signal received:', msg.data);
                    }
                } catch (e) {
                    console.error("Signal parse error", e);
                }
            };

            sharedSocket.onerror = (err) => {
                console.error('✗ Signaling connection error:', err);
            };
        }
        setSocket(sharedSocket);

        // Firestore listener for Messages (Storage)
        const q = query(
            collection(db, "messages"),
            orderBy("timestamp", "desc"),
            limit(50)
        );

        const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
            const fetchedMessages = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
                };
            }).reverse();

            setMessages(fetchedMessages);
        });

        return () => {
            unsubscribeFirestore();
            // We usually don't close sharedSocket on unmount if we want to persist connection across nav,
            // but strict mode might create duplicates. 
            // For now, let's keep it simple.
        };
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
