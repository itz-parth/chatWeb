// ============================================================================
// Firebase Configuration and Initialization
// Sets up Firebase services: Authentication and Firestore
// ============================================================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object with project credentials
const firebaseConfig = {
  apiKey: 'AIzaSyANCTr9cr432gffdWZdQJ5-bjHHhxZ95hU',
  authDomain: 'chatapp-d6b3a.firebaseapp.com',
  projectId: 'chatapp-d6b3a',
  storageBucket: 'chatapp-d6b3a.firebasestorage.app',
  messagingSenderId: '966037807856',
  appId: '1:966037807856:web:6c5ed40604af7773de9835',
  measurementId: 'G-9XKPWDTYJJ',
};

// Initialize Firebase app with configuration
const app = initializeApp(firebaseConfig);

// Export auth instance for use in authentication operations
export const auth = getAuth(app);

// Initialize Firestore database for data storage
const db = getFirestore(app);

export default app;
