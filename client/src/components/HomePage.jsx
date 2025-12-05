// ============================================================================
// HomePage Component - Main Chat Dashboard
// Displays three-column layout: Users, Chat, and Profile sections
// ============================================================================

import React from 'react';
import ChatBox from './ChatBox.jsx';
import LogoutButton from './buttons/LogoutButton.jsx';

/**
 * HomePage Component
 * - Only accessible to authenticated users
 * - Three-column layout: Users list | Chat area | User profile
 */
const HomePage = () => {
  return (
    <div className="flex pt-8 pl-12 pb-4 h-screen">
      {/* Left Panel: Users List (20% width) */}
      <div className="w-1/5 h-full">
        <h1>Users</h1>
        {/* TODO: Add active users list here */}
      </div>

      {/* Center Panel: Chat Interface (60% width) */}
      <div className="w-4/5 h-full ml-4 mr-4 border border-amber-200">
        <ChatBox />
      </div>

      {/* Right Panel: User Profile (17% width) */}
      <div className="w-1/6 h-full mr-4">
        <h1>Profile</h1>
        <LogoutButton />
      </div>
    </div>
  );
};

export default HomePage;