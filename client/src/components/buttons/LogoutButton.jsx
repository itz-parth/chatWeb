import { signOut } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../FirebaseAuth';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      signOut(auth);
      navigate('/login');
    } catch (e) {
      console.error('✗ Error during logout:', e);
    }
  };

  return (
    <div>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;