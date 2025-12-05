// ============================================================================
// Authentication Context - Global Auth State Management
// Provides authentication state to all components in the app
// ============================================================================

import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './FirebaseAuth';

// Create the authentication context
const AuthContext = createContext();

/**
 * useAuth Hook
 * - Custom hook to access the authentication context from any component
 * - Usage: const { user } = useAuth();
 */
export const useAuth = () => useContext(AuthContext);

/**
 * AuthProvider Component
 * - Wraps the entire app to provide authentication state
 * - Monitors Firebase auth state changes
 * - Prevents rendering children until auth state is determined
 */
export const AuthProvider = ({ children }) => {
  // State to store current authenticated user
  const [user, setUser] = useState(null);
  // State to track if authentication is still loading
  const [loading, setLoading] = useState(true);

  // Subscribe to Firebase auth state changes on component mount
  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Update user state when auth state changes
      setUser(user);
      // Mark loading as complete
      setLoading(false);
    });

    // Cleanup: unsubscribe from auth state listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Create context value object containing current user
  const value = { user };

  // Render provider - don't render children until loading is complete
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};