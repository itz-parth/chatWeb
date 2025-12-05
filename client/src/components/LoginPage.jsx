// ============================================================================
// LoginPage Component - Authentication Interface
// Handles Google Sign-In and redirects authenticated users
// ============================================================================

import { useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from './FirebaseAuth';
import '../App.css';

/**
 * LoginPage Component
 * - Displays login UI with Google Sign-In button
 * - Redirects to home if user is already authenticated
 * - Shows loading state while checking auth status
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // If user is logged in, redirect to home page
      if (user) {
        navigate('/');
      } else {
        // User not authenticated, show login page
        setLoading(false);
      }
    });

    // Cleanup: unsubscribe from auth listener
    return () => unsubscribe();
  }, [navigate]);

  /**
   * Handle Google Sign-In
   * - Opens Google authentication popup
   * - User grants permissions
   * - Firebase updates auth state and redirects via useEffect
   */
  const signInWithGoogle = async () => {
    try {
      // Create Google authentication provider
      const provider = new GoogleAuthProvider();
      // Open Google sign-in popup
      const result = await signInWithPopup(auth, provider);
      console.log('✓ User successfully signed in:', result.user);
    } catch (e) {
      console.error('✗ Error during sign-in:', e);
    }
  };

  // Glassmorphic card styling
  const glassCard = {
    width: '25vw',
    height: '60vh',
    backdropFilter: 'blur(3px) saturate(200%)',
    WebkitBackdropFilter: 'blur(3px) saturate(200%)',
    backgroundColor: 'rgba(155, 155, 155, 0.73)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.125)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-[url('/assets/login_bg.jpg')] bg-cover bg-center w-screen h-screen flex justify-center items-center">
      {/* Glass-effect login card */}
      <div style={glassCard}>
        <h1 className="text-white text-2xl mb-6">Login to the App</h1>
        {/* Google Sign-In button */}
        <button
          onClick={signInWithGoogle}
          className="bg-white text-black font-semibold px-6 py-2 rounded hover:bg-gray-200 transition"
        >
          Click to Sign In
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
