import { getFirestore, doc, updateDoc, setDoc, arrayUnion, arrayRemove, serverTimestamp, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const db = getFirestore();
const auth = getAuth();

const uid = () => auth.currentUser?.uid;
const useRef = (id) => doc(db, "users", id);

export const findUserByTag = async (tag) => {
    const [searchName, searchDisc] = tag.split('#');

    if (!searchName || !searchDisc) return null;

    const usersRef = collection(db, "users");
    const q = query(
        usersRef,
        where("username", "==", searchName),
        where("discriminator", "==", searchDisc)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    return snapshot.docs[0].id;
}

const getChatId = (uid1, uid2) => {
    const sorted = [uid1, uid2].sort();
    return sorted.join("_");
}

export const sendFriendRequest = async (targetInput) => {
    if (!uid()) return;
    const me = uid();

    let targetUid = targetInput;

    if (targetInput.includes('#')) {
        const foundUid = await findUserByTag(targetInput);
        if (foundUid) {
            targetUid = foundUid;
        } else {
            console.error(`Tag ${targetInput} not found in DB.`);
            throw new Error(`User tag "${targetInput}" not found`);
        }
    }

    if (me === targetUid) throw new Error("Cannot send friend request to yourself");

    const targetRef = useRef(targetUid);
    const targetSnap = await getDoc(targetRef);

    if (!targetSnap.exists()) {
        console.error(`Target UID ${targetUid} does not exist.`);
        throw new Error("User ID not found");
    }

    console.log(`Sending Friend Request: ${me} -> ${targetUid}`);

    await updateDoc(useRef(me), {
        outgoingRequests: arrayUnion(targetUid)
    })

    await updateDoc(useRef(targetUid), {
        incomingRequests: arrayUnion(me)
    })
}

export const acceptFriendRequest = async (targetUid) => {
    const me = uid();
    if (!me) return;

    const chatId = getChatId(me, targetUid);

    await updateDoc(useRef(me), {
        incomingRequests: arrayRemove(targetUid),
        friends: arrayUnion(targetUid)
    });

    await updateDoc(useRef(targetUid), {
        outgoingRequests: arrayRemove(me),
        friends: arrayUnion(me)
    });

    await setDoc(doc(db, "chats", chatId), {
        users: [me, targetUid],
        createdAt: serverTimestamp()
    }, { merge: true });

    await setDoc(doc(db, "users", me, "friends", targetUid), {
        chatId
    }, { merge: true });

    await setDoc(doc(db, "users", targetUid, "friends", me), {
        chatId
    }, { merge: true });
};

export const rejectFriendRequest = async (targetUid) => {
    if (!uid()) return;
    const me = uid();

    await updateDoc(useRef(me), {
        incomingRequests: arrayRemove(targetUid)
    })

    await updateDoc(useRef(targetUid), {
        outgoingRequests: arrayRemove(me)
    })
}

export const removeFriend = async (targetUid) => {
    if (!uid()) return;
    const me = uid();

    await updateDoc(useRef(me), {
        friends: arrayRemove(targetUid)
    })

    await updateDoc(useRef(targetUid), {
        friends: arrayRemove(me)
    })
}

export const getUserDisplayName = async (uid) => {
    const snap = await getDoc(useRef(uid));
    return snap.data().displayName;
}