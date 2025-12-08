import React from 'react';
import { acceptFriendRequest, removeFriend } from './friendService';

const FriendList = ({ friends = [], incomingRequests = [], outgoingRequests = [] }) => {

    return (
        <div className="space-y-6 py-2">

            {/* Incoming Requests Section */}
            {incomingRequests.length > 0 && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Requests
                        </h3>
                        <span className="bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {incomingRequests.length}
                        </span>
                    </div>
                    <ul className="space-y-2">
                        {incomingRequests.map((user) => (
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
            )}

            {/* Outgoing Requests Section */}
            {outgoingRequests.length > 0 && (
                <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                        Pending
                    </h3>
                    <ul className="space-y-2">
                        {outgoingRequests.map((user) => (
                            <li key={user.uid} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs text-gray-600 font-medium truncate w-32">
                                        {user.username}
                                    </span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium">Wait...</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Friends Section */}
            <div>
                <div className="flex items-center justify-between mb-3 px-1">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Friends
                    </h3>
                    <span className="text-[10px] font-medium text-gray-400">{friends.length}</span>
                </div>

                {friends.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                            <span className="text-xl">👋</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">No friends yet</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">Add someone to start chatting!</p>
                    </div>
                ) : (
                    <ul className="space-y-1">
                        {friends.map((user) => (
                            <li key={user.uid} className="group flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-md hover:shadow-gray-200/50 border border-transparent hover:border-gray-100 transition-all duration-200 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-0.5">
                                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-600">
                                                {user.username.slice(0, 1).toUpperCase()}
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 truncate w-28">
                                            {user.username}
                                        </p>
                                        <p className="text-[10px] text-gray-400">#{user.discriminator}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (window.confirm(`Remove friend ${user.username}?`)) removeFriend(user.uid);
                                    }}
                                    className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                                    title="Remove Friend"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default FriendList;
