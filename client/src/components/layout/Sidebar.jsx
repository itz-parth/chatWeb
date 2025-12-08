import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import FriendAction from '../friends/FriendAction';
import FriendList from '../friends/FriendList';

const Sidebar = () => {
    // using friendsList, incomingRequestsList, and outgoingRequestsList now which contain full user data
    const { friendsList, incomingRequestsList, outgoingRequestsList, loading, username, discriminator } = useProfile();

    if (loading) {
        return (
            <div className="flex flex-col h-full bg-white/80 backdrop-blur-md border-r border-gray-200 p-6 items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-sm text-gray-500 font-medium">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            {/* Header / User Info */}
            <div className="p-6 pb-4 bg-gradient-to-b from-white to-gray-50/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                        {username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-800 text-base leading-tight">{username || 'Guest'}</h2>
                        <span className="text-xs font-medium text-gray-400">#{discriminator}</span>
                    </div>
                </div>

                <FriendAction />
            </div>

            {/* Scrollable List Area */}
            <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                <FriendList
                    friends={friendsList} // Pass full user objects
                    incomingRequests={incomingRequestsList} // Pass full user objects
                    outgoingRequests={outgoingRequestsList}
                />
            </div>

            {/* Footer / Status (Optional) */}
            <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    Online
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
