import React from 'react';
import { useFriends } from '../../context/FriendsContext';

const OutgoingRequestsList = () => {
    const { outgoingRequestsList } = useFriends();

    if (outgoingRequestsList.length === 0) return null;

    return (
        <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
                Pending
            </h3>
            <ul className="space-y-2">
                {outgoingRequestsList.map((user) => (
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
    );
};

export default OutgoingRequestsList;
