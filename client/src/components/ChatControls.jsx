import React from 'react';
import SendMessage from './buttons/SendMessege';

// ChatControls groups the message input and send button.
// Keeps the API simple: pass `socket` and `username` props.
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
