import React from 'react';
import { acceptFriendRequest } from './friendService';
import { useFriends } from '../../context/FriendsContext';

const IncomingRequestsList = () => {
    const { incomingRequestsList } = useFriends();

    if (incomingRequestsList.length === 0) return null;

    return (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Requests
                </h3>
                <span className="bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {incomingRequestsList.length}
                </span>
            </div>
            <ul className="space-y-2">
                {incomingRequestsList.map((user) => (
                    <li key={user.uid} className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-100">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-gray-800 break-all line-clamp-1 w-24">
                                        {user.username}
                                    </p>
                                    <p className="text-[10px] text-gray-400">#{user.discriminator}</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => acceptFriendRequest(user.uid)}
                            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-200"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Accept Request
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IncomingRequestsList;
