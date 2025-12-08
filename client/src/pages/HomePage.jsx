import React from 'react';
import ChatBox from '../components/chat/ChatBox.jsx';
import LogoutButton from '../components/auth/LogoutButton.jsx';
import Sidebar from '../components/layout/Sidebar.jsx';
import Profile from '../components/profile/Profile.jsx';

const HomePage = () => {
    return (
        <div className="flex pt-8 pl-12 pb-4 h-screen">
            <div className="w-1/5 h-full">
                <Sidebar />
            </div>

            <div className="w-4/5 h-full ml-4 mr-4 border border-amber-200">
                <ChatBox />
            </div>

            <div className="w-1/6 h-full mr-4">
                <Profile />
            </div>
        </div>
    );
};

export default HomePage;
