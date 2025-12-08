import React from 'react';

const MessageList = ({ messages = [] }) => {
    return (
        <div className="flex-1 overflow-y-auto bg-gray-100 p-3 rounded-lg shadow-inner">
            {messages.length === 0 ? (
                <div className="text-gray-500">No messages yet</div>
            ) : (
                messages.map((msg, i) => (
                    <div key={msg.id || i} className="mb-2">
                        <span className="font-bold">{msg.displayName || 'Anonymous'}:</span>{' '}
                        <span>{msg.text}</span>
                    </div>
                ))
            )}
        </div>
    );
};

export default MessageList;
