import React from 'react';
import SendMessage from './SendMessage.jsx';

const ChatControls = () => {
    return (
        <div className="flex items-center justify-between mt-2">
            <div className="flex-1 ml-3">
                <SendMessage />
            </div>
        </div>
    );
};

export default ChatControls;
