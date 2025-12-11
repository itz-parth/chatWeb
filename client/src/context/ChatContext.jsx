import { createContext, useContext, useEffect, useState, useRef } from "react";
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { useFriends } from "./FriendsContext";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const { username } = useFriends(); // Get current username for signalling/messages
    const db = getFirestore();

    const [activeChat, setActiveChat] = useState(null); // chatroomId
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    // Initialize Socket
    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = new WebSocket("ws://localhost:5000");

            socketRef.current.onopen = () => console.log('✓ Connected to signaling server');

            socketRef.current.onmessage = (event) => {
                try {
                    const msg = JSON.parse(event.data);
                    if (msg.type === 'signal') {
                        console.log('Signal received:', msg.data);
                    }
                } catch (e) {
                    console.error("Signal parse error", e);
                }
            };

            socketRef.current.onerror = (err) => console.error('✗ Signaling error:', err);

            setSocket(socketRef.current);
        }

        // Cleanup isn't strictly necessary for singleton socket in SPA, 
        // but good practice if provider unmounts (e.g. logout)
        return () => {
            // socketRef.current?.close(); 
        };
    }, []);

    // Listen to Messages when activeChat changes
    useEffect(() => {
        if (!activeChat) {
            setMessages([]);
            return;
        }

        const q = query(
            collection(db, "chats", activeChat, "messages"),
            orderBy("timestamp", "asc")
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date()
                };
            });
            setMessages(fetched);
        });

        return () => unsub();
    }, [activeChat, db]);

    // Send Message Function
    const sendMessage = async (text) => {
        if (!text.trim() || !user || !activeChat) return;

        try {
            await addDoc(collection(db, "chats", activeChat, "messages"), {
                text: text.trim(),
                displayName: username,
                uid: user.uid,
                timestamp: serverTimestamp(),
            });

            // Optional: Send socket signal
            if (socket?.readyState === WebSocket.OPEN) {
                // socket.send(...)
            }
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    };

    const value = {
        activeChat,
        setActiveChat,
        messages,
        socket,
        sendMessage
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
