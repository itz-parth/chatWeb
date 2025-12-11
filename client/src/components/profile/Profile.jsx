import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useFriends } from "../../context/FriendsContext";

const Profile = () => {
    const auth = getAuth();
    const db = getFirestore();

    const { username, discriminator, checkTagExists } = useFriends();

    const [isEditing, setIsEditing] = useState(false);
    const [inputName, setInputName] = useState(username);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!inputName.trim()) return;

        setIsSaving(true);

        const user = auth.currentUser;
        const newUsername = inputName.trim();
        let finalDisc = discriminator;

        try {
            if (user) {
                const tagExists = await checkTagExists(newUsername, discriminator);

                if (tagExists) {
                    const confirmed = window.confirm(
                        `The tag "${newUsername}#${discriminator}" is already taken!\n\nWould you like to generate a new discriminator?`
                    );

                    if (!confirmed) {
                        setIsSaving(false);
                        return;
                    }

                    finalDisc = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
                }

                const userDocRef = doc(db, "users", user.uid);

                await setDoc(
                    userDocRef,
                    {
                        username: newUsername,
                        discriminator: finalDisc
                    },
                    { merge: true }
                );

                await updateProfile(user, {
                    displayName: `${newUsername}#${finalDisc}`,
                });
            }

            // setUsername(newUsername); // Handled by context listener

            window.dispatchEvent(
                new CustomEvent("profile-updated", {
                    detail: { username: newUsername, discriminator: finalDisc },
                })
            );

            setIsEditing(false);

        } catch (error) {
            console.error("Error saving profile:", error);
            alert("Failed to save profile. Try again.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mb-4 p-3 bg-white rounded shadow-sm border">
            <h2 className="text-sm font-semibold mb-2">👤 Your Profile</h2>

            {!isEditing ? (
                <div className="flex items-center justify-between">
                    <div className="font-medium">
                        {username}
                        <span className="text-gray-500 ml-1">#{discriminator}</span>
                    </div>

                    <button
                        className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                        onClick={() => {
                            setInputName(username);
                            setIsEditing(true);
                        }}
                    >
                        Edit
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <input
                        className="text-sm p-1 rounded border flex-1"
                        value={inputName}
                        onChange={(e) => setInputName(e.target.value)}
                        placeholder="Enter new username"
                        disabled={isSaving}
                    />

                    <div className="px-3 py-1 text-sm text-gray-600">
                        #{discriminator}
                    </div>

                    <button
                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-gray-400"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Saving…" : "Save"}
                    </button>

                    <button
                        className="px-3 py-1 bg-gray-300 text-black rounded text-sm hover:bg-gray-400"
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;
