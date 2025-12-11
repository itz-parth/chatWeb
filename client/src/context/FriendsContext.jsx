import { createContext, useContext, useEffect, useState } from "react";
import { getFirestore, doc, onSnapshot, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const FriendsContext = createContext();

export const useFriends = () => useContext(FriendsContext);

export const FriendsProvider = ({ children }) => {
    const { user } = useAuth();
    const db = getFirestore();

    const [profile, setProfile] = useState({
        username: "Guest",
        discriminator: "0000",
        friends: [],
        incomingRequests: [],
        outgoingRequests: [],
        friendsList: [],
        incomingRequestsList: [],
        outgoingRequestsList: []
    });
    const [loading, setLoading] = useState(true);

    const fetchUserDetails = async (uids = []) => {
        if (!uids.length) return [];
        const results = await Promise.all(
            uids.map(async (uid) => {
                const snap = await getDoc(doc(db, "users", uid));
                if (!snap.exists()) return { uid, username: "Unknown", discriminator: "0000" };
                const data = snap.data();
                return { uid, username: data.username, discriminator: data.discriminator };
            })
        );
        return results;
    };

    useEffect(() => {
        if (!user) {
            setProfile(prev => ({ ...prev, username: "Guest" }));
            setLoading(false);
            return;
        }

        const ref = doc(db, "users", user.uid);
        const unsub = onSnapshot(ref, async (snap) => {
            if (!snap.exists()) {
                const newDisc = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
                await setDoc(ref, {
                    username: user.displayName || "User",
                    discriminator: newDisc,
                    friends: [],
                    incomingRequests: [],
                    outgoingRequests: []
                });
                return;
            }

            const data = snap.data();
            const getChatId = (uid1, uid2) => [uid1, uid2].sort().join("_");

            const [friendsData, incomingList, outgoingList] = await Promise.all([
                fetchUserDetails(data.friends || []),
                fetchUserDetails(data.incomingRequests || []),
                fetchUserDetails(data.outgoingRequests || [])
            ]);

            const friendsList = friendsData.map(f => ({
                ...f,
                chatroomId: getChatId(user.uid, f.uid)
            }));

            setProfile({
                username: data.username,
                discriminator: data.discriminator,
                friends: data.friends || [],
                incomingRequests: data.incomingRequests || [],
                outgoingRequests: data.outgoingRequests || [],
                friendsList,
                incomingRequestsList: incomingList,
                outgoingRequestsList: outgoingList
            });
            setLoading(false);
        });

        return () => unsub();
    }, [user, db]);

    const checkTagExists = async (username, disc) => {
        try {
            const q = query(
                collection(db, "users"),
                where("username", "==", username)
            );
            const snap = await getDocs(q);
            return snap.docs.some(d => d.data().discriminator === disc && d.id !== user?.uid);
        } catch (err) {
            console.error(err);
            return false;
        }
    };

    const value = { ...profile, loading, checkTagExists };

    return (
        <FriendsContext.Provider value={value}>
            {children}
        </FriendsContext.Provider>
    );
};
