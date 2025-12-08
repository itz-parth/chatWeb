import React, { useState } from 'react';
import { sendFriendRequest } from './friendService';

const FriendAction = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendRequest = async () => {
        if (!searchTerm.trim()) return;
        setIsLoading(true);
        try {
            await sendFriendRequest(searchTerm);
            setSearchTerm('');
            alert("Friend request sent!");
        } catch (error) {
            console.error(error);
            alert("Failed to send request. Check console for details.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter UID or Username#0000"
                className="block w-full pl-9 pr-10 py-2.5 sm:text-sm border-gray-200 rounded-xl bg-gray-50 text-gray-700 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleSendRequest()}
            />
            <button
                onClick={handleSendRequest}
                disabled={isLoading || !searchTerm.trim()}
                className={`absolute inset-y-1 right-1 px-3 flex items-center rounded-lg transition-all duration-200 ${searchTerm.trim()
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
            >
                {isLoading ? (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                )}
            </button>
        </div>
    );
};

export default FriendAction;
