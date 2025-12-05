// ============================================================================
// LogoutButton Component - User Sign-Out
// Provides button to sign out and redirect to login page
// ============================================================================

import { signOut } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../FirebaseAuth';

/**
 * LogoutButton Component
 * - Displays a logout button
 * - Signs user out from Firebase
 * - Redirects to login page after logout
 */
const LogoutButton = () => {
  const navigate = useNavigate();

  /**
   * Handle logout functionality
   * - Signs user out from Firebase
   * - Redirects user to login page
   * - Handles any errors during logout
   */
  const handleLogout = () => {
    try {
      // Sign out user from Firebase
      signOut(auth);
      // Redirect to login page
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