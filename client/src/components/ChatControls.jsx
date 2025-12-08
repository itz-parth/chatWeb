import React from 'react';
import SendMessage from './buttons/SendMessege';

const ChatControls = ({ socket, username }) => {
  return (
    <div className="flex items-center justify-between mt-2">
      <div className="flex-1 ml-3">
        <SendMessage socket={socket} username={username} />
      </div>
    </div>
  );
};

export default ChatControls;
