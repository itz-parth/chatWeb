import { useState, useEffect } from "react";
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export function useProfile() {
  const [username, setUsername] = useState("");
  const [discriminator, setDiscriminator] = useState("0000");
  const [loading, setLoading] = useState(true);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const loadUserProfile = async () => {
      const user = auth.currentUser;

      if (!user) {
        setUsername("Guest");
        setDiscriminator("0000");
        setLoading(false);
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const profileData = userDocSnap.data();
        setUsername(profileData.username);
        setDiscriminator(profileData.discriminator);
        setLoading(false);
        return;
      }

      const newDisc = String(Math.floor(Math.random() * 10000)).padStart(4, "0");

      await setDoc(userDocRef, {
        username: user.displayName || "User",
        discriminator: newDisc,
      });

      setUsername(user.displayName || "User");
      setDiscriminator(newDisc);
      setLoading(false);
    };

    loadUserProfile();
  }, []);

  const checkTagExists = async (user, checkUsername, checkDisc) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("username", "==", checkUsername)
      );
      const snapshot = await getDocs(q);
      
      for (const docSnap of snapshot.docs) {
        if (docSnap.data().discriminator === checkDisc && docSnap.id !== user.uid) {
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking tag:", error);
      return false;
    }
  };

  return { 
    username, 
    discriminator, 
    loading, 
    setUsername, 
    setDiscriminator,
    checkTagExists
  };
}
