import { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export function useProfile() {
  const [profile, setProfile] = useState({
    username: "",
    discriminator: "0000",
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
    friendsList: [],
    incomingRequestsList: [],
    outgoingRequestsList: []
  });

  const [loading, setLoading] = useState(true);

  const db = getFirestore();
  const auth = getAuth();

  // Fetch user details for list of UIDs
  const fetchUserDetails = async (uids = []) => {
    if (!uids.length) return [];

    const results = await Promise.all(
      uids.map(async (uid) => {
        const snap = await getDoc(doc(db, "users", uid));
        if (!snap.exists()) return { uid, username: "Unknown", discriminator: "0000" };

        const data = snap.data();
        return {
          uid,
          username: data.username,
          discriminator: data.discriminator
        };
      })
    );

    return results;
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setProfile({
        username: "Guest",
        discriminator: "0000",
        friends: [],
        incomingRequests: [],
        outgoingRequests: [],
        friendsList: [],
        incomingRequestsList: [],
        outgoingRequestsList: []
      });
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

      // Helper to generate chat ID
      const getChatId = (uid1, uid2) => [uid1, uid2].sort().join("_");

      // Fetch full lists in parallel
      const [friendsData, incomingList, outgoingList] = await Promise.all([
        fetchUserDetails(data.friends || []),
        fetchUserDetails(data.incomingRequests || []),
        fetchUserDetails(data.outgoingRequests || [])
      ]);

      // Add chatroomId to friends
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
  }, []);

  // Tag exists check
  const checkTagExists = async (user, username, disc) => {
    try {
      const q = query(
        collection(db, "users"),
        where("username", "==", username)
      );

      const snap = await getDocs(q);

      return snap.docs.some(
        (d) => d.data().discriminator === disc && d.id !== user.uid
      );
    } catch (err) {
      console.error("Error checking tag:", err);
      return false;
    }
  };

  return { ...profile, loading, checkTagExists };
}
