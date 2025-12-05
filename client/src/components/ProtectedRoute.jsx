// ============================================================================
// ProtectedRoute Component - Route Access Control
// Ensures only authenticated users can access protected routes
// ============================================================================

import { Navigate } from 'react-router-dom';
import { auth } from './FirebaseAuth';
import { useAuthState } from 'react-firebase-hooks/auth';

/**
 * ProtectedRoute Component
 * - Checks if user is authenticated
 * - Redirects to login if user is not authenticated
 * - Shows loading state while checking authentication status
 * - Renders protected component if user is authenticated
 */
const ProtectedRoute = ({ children }) => {
  // Get current user and loading state from Firebase
  const [user, loading] = useAuthState(auth);

  // Show loading message while authentication status is being determined
  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  // If user is not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // User is authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
